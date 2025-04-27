const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001; // Changed from 1001 to avoid permission issues

// Simple HTTP server
const server = http.createServer((req, res) => {
  // Map the URL path to file paths
  const urlPath = req.url === '/' ? 'index.html' : req.url.replace(/^\/+/, '');
  let filePath = path.join(__dirname, urlPath);
  
  // Default to index.html for directories
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Get file extension
  const extname = path.extname(filePath);
  
  // Set content type based on file extension
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
  }

  // Read and serve the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
      return;
    }

    // Success!
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  });
});

// Start server on port 3001
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Test dashboard available at http://localhost:${PORT}/test-dashboard`);
});