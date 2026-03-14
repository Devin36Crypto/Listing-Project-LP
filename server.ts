import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { Resend } from 'resend';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = 'localhost';

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

  if (secret && authHeader !== secret) {
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
      from: 'ListeningProject <noreply@listening-project.app>', // Updated to official brand name
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(400).json({ error: error.message || 'Failed to send email via Resend' });
    }

    res.status(200).json({ data });
  } catch (err: any) {
    console.error('Email API crash:', err);
    res.status(500).json({ error: 'Internal server error while sending email' });
  }
});

// Vite middleware setup
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa', // Use 'spa' for standard SPA behavior
      root: __dirname,
    });
    
    // Initial middleware to log requests
    app.use((req, res, next) => {
      if (!req.url.startsWith('/@') && !req.url.includes('node_modules')) {
        console.log(`${req.method} ${req.url}`);
      }
      next();
    });

    // Use vite's connect instance as middleware
    app.use(vite.middlewares);

    // No need for a custom get('*') if in appType: 'spa' and we want Vite to handle it,
    // BUT we have custom API routes, so we must ensure they are defined BEFORE this.
    // Since our API routes are defined at the top level of the file, they will be handled first.
    
    // We still need to serve index.html for non-asset routes if Vite doesn't do it automatically in middlewareMode.
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.includes('.') && !url.endsWith('.html')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });
}

startServer();
