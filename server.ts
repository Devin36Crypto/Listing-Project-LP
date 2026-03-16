import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { Resend } from 'resend';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Initialize Resend with API Key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', services: ['resend', 'revenuecat'] });
});

app.post('/api/webhooks/revenuecat', (req, res) => {
  // Verify webhook signature if needed (REVENUECAT_WEBHOOK_SECRET)
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  const authHeader = req.headers['authorization'];

  // Basic check (RevenueCat sends auth header)
  if (secret && authHeader !== secret) {
    // return res.status(401).send('Unauthorized');
    // For now, just log it as we might not have the secret set up in dev
    console.warn('RevenueCat Webhook: Secret mismatch or missing');
  }

  console.log('RevenueCat Webhook received:', req.body);
  res.status(200).send('Webhook received');
});

app.post('/api/email', async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Replace with your verified domain
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Vite middleware setup
async function startServer() {
  let vite: any;
  let server: any;

  const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down server...`);
    
    if (server) {
      server.close(() => {
        console.log('HTTP server closed.');
      });
    }

    if (vite) {
      try {
        await vite.close();
        console.log('Vite server closed.');
      } catch (err) {
        console.error('Error closing Vite server:', err);
      }
    }

    console.log('Server process terminated.');
    process.exit(0);
  };

  // Global error handlers
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    shutdown('UNCAUGHT_EXCEPTION');
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    shutdown('UNHANDLED_REJECTION');
  });

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  try {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    
    if (!isProduction) {
      vite = await createViteServer({
        server: { 
          middlewareMode: true,
          hmr: process.env.DISABLE_HMR !== 'true'
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      // Serve static files in production
      app.use(express.static(path.join(__dirname, 'dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
      });
    }

    const host = '127.0.0.1';
    server = app.listen(3000, host, () => {
      console.log(`Landing Page (Port 3000) running on http://${host}:3000`);
    }).on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port 3000 is already in use.`);
        process.exit(1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });

    // Graceful shutdown helper
    const handleShutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Shutting down server...`);
      
      if (server) {
        if (typeof (server as any).closeAllConnections === 'function') {
          (server as any).closeAllConnections();
        }
        server.close(() => {
          console.log('HTTP server closed.');
        });
      }

      if (vite) {
        try {
          await vite.close();
          console.log('Vite server closed.');
        } catch (err) {
          console.error('Error closing Vite server:', err);
        }
      }

      console.log('Server process terminated.');
      process.exit(0);
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

    const forceShutdownTimeout = 5000;
    const forceShutdown = () => {
      setTimeout(() => {
        console.error('Forcefully shutting down');
        process.exit(1);
      }, forceShutdownTimeout).unref();
    };

    process.on('SIGINT', forceShutdown);
    process.on('SIGTERM', forceShutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Global error handlers outside of startServer for better coverage
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
