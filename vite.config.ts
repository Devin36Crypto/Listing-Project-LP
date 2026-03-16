/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['prism-logo.png'],
        manifest: {
          name: 'Listening Project',
          short_name: 'Listening Project',
          description: 'AI-powered audio transcription and emotional analysis',
          theme_color: '#000000',
          background_color: '#000000',
          display: 'standalone',
          icons: [
            {
              src: 'prism-logo.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.DISABLE_HMR': JSON.stringify(process.env.DISABLE_HMR),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true' ? {
        port: 24678,
        host: '127.0.0.1'
      } : false,
      proxy: {
        '/supabase-api': {
          target: 'https://uydybhioyjdmncvixsoc.supabase.co',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/supabase-api/, '')
        }
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/vitest-setup.ts',
      css: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-ui': ['motion', 'lucide-react'],
            'vendor-services': ['@supabase/supabase-js', 'resend'],
            'vendor-rc': ['@revenuecat/purchases-js']
          }
        }
      },
      chunkSizeWarningLimit: 600
    }
  };
});
