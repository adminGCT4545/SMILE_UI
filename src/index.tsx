import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ERPDashboard from './components/ERPDashboard';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

const renderApp = createRoot(root);

// Determine which component to render based on the URL path
const path = window.location.pathname;
if (path === '/' || path === '/dashboard' || path === '/erp-dashboard') {
  renderApp.render(
    <React.StrictMode>
      <ERPDashboard />
    </React.StrictMode>
  );
} else {
  renderApp.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
