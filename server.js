const express = require('express');
const path = require('path');
const http = require('http');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Add proxy middleware for API requests
app.use('/api/*', (req, res) => {
  console.log(`Proxying API request to backend: ${req.originalUrl}`);
  
  // Forward request to backend server (port 3002)
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: req.originalUrl,
    method: req.method,
    headers: {
      ...req.headers,
      host: 'localhost:3002'
    }
  };

  const proxyReq = http.request(options, proxyRes => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (e) => {
    console.error(`Proxy error: ${e.message}`);
    res.status(502).json({ 
      error: 'Bad Gateway',
      message: 'Failed to connect to the backend server. Please ensure it is running.' 
    });
  });

  if (req.body) {
    proxyReq.write(JSON.stringify(req.body));
  }
  
  req.pipe(proxyReq);
});

// Parse JSON for non-proxied requests
app.use(express.json());

// Define routes first
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/erp-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/kynsey-ai', (req, res) => {
  res.sendFile(path.join(__dirname, 'GCT_UI_V1.0/kynsey-ai/enhanced-index-html.html'));
});

// Then serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/kynsey-ai', express.static(path.join(__dirname, 'GCT_UI_V1.0/kynsey-ai')));
app.use('/kynsey-ai/frontend', express.static(path.join(__dirname, 'GCT_UI_V1.0/kynsey-ai/frontend')));
app.use(express.static(path.join(__dirname)));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});


// Specific route for enhanced dashboard test
app.get('/test/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'tests', 'enhanced-dashboard.html'), err => {
    if (err) {
      console.error('Error serving enhanced-dashboard.html:', err);
      res.status(404).json({
        error: 'Test dashboard file not found',
        message: 'The enhanced dashboard test file could not be located'
      });
    }
  });
});

// Route for other test files
app.get('/test/*', (req, res, next) => {
  const testFilePath = path.join(__dirname, req.path);
  res.sendFile(testFilePath, err => {
    if (err) next(err);
  });
});

// Custom 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested path ${req.path} was not found on this server`,
    availableRoutes: {
      dashboard: ['/', '/dashboard', '/erp-dashboard'],
      test: ['/test/dashboard', '/test/*']
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred while processing your request',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Dashboard available at http://localhost:${PORT}/ or /dashboard`);
  console.log(`Enhanced dashboard test available at http://localhost:${PORT}/test/dashboard`);
});
