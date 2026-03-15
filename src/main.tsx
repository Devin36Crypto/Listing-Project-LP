console.log('MAIN.TSX: Initialization started');
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';



// Sentry initialization placeholder
// if (import.meta.env.VITE_SENTRY_DSN) { ... }

const rootElement = document.getElementById('root');
console.log('MAIN.TSX: Root element:', rootElement);
if (!rootElement) {
  console.error('MAIN.TSX: Root element #root not found!');
}

try {
  console.log('MAIN.TSX: Creating root and rendering');
  const root = ReactDOM.createRoot(rootElement as HTMLElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
        <Analytics />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('MAIN.TSX: Render call completed');
} catch (error) {
  console.error('MAIN.TSX: Fatal render error:', error);
}
