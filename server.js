const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from project root and Kynsey AI directory
app.use(express.static(__dirname));
app.use('/kynsey-ai', express.static(path.join(__dirname, 'GCT_UI_V1.0/kynsey-ai')));

// Root route serves Kynsey AI interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'GCT_UI_V1.0/kynsey-ai/enhanced-index-html.html'));
});

// ERP Dashboard route
app.get('/erp-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
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
