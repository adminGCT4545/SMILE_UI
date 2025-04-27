# ERP Dashboard Integration Plan

## Overview
This document outlines the plan to integrate the Kynsey AI chat interface as the main entry point of the SMILE UI application, with navigation to the existing ERP dashboard.

## Current Architecture
- SMILE UI Server (Express) runs on port 3000
  - Serves static files from project root
  - Currently serves `dashboard.html` at `/` and `/dashboard`
- Kynsey AI Backend (Express) runs on port 3002
  - Handles chat functionality, document processing, etc.
  - Defined in `GCT_UI_V1.0/kynsey-ai/backend/src/server.js`
  - Started via `npm start` in the backend directory

## Implementation Steps

### 1. Server Configuration Changes
Modify `server.js` to:
- Serve `GCT_UI_V1.0/kynsey-ai/enhanced-index-html.html` at the root route (`/`)
- Move the ERP dashboard to `/erp-dashboard` route
- Update static file serving to handle both applications
- Ensure proper CORS configuration for backend communication

```javascript
// Planned server.js changes
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from project root
app.use(express.static(__dirname));
app.use('/kynsey-ai', express.static(path.join(__dirname, 'GCT_UI_V1.0/kynsey-ai')));

// Root route serves Kynsey AI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'GCT_UI_V1.0/kynsey-ai/enhanced-index-html.html'));
});

// ERP Dashboard route
app.get('/erp-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});
```

### 2. Frontend Integration
Modify Kynsey AI HTML (`enhanced-index-html.html`) to:
- Add navigation link/button to ERP Dashboard in the sidebar
- Location: Just below the settings button in the sidebar
- Styling: Match existing sidebar buttons

```html
<!-- Add to sidebar in enhanced-index-html.html -->
<button class="sidebar-button" id="erpDashboardBtn" title="ERP Dashboard" onclick="window.location.href='/erp-dashboard'">
    <span>📊</span>
</button>
```

### 3. Deployment Setup
1. Backend Services:
   ```bash
   # Start Kynsey AI Backend (Port 3002)
   cd GCT_UI_V1.0/kynsey-ai/backend
   npm install
   npm start

   # In another terminal, start SMILE UI Server (Port 3000)
   cd /home/gct-core/Downloads/GCT UI NIghtly (Gem) V1.0/SMILE_UI
   npm start
   ```

2. Environment Configuration:
   - Ensure `.env` files are properly configured
   - Verify CORS settings in both servers
   - Check port configurations

### 4. Testing Plan
1. Navigation Flow:
   - Access `/` -> Should show Kynsey AI interface
   - Click ERP Dashboard button -> Should load dashboard at `/erp-dashboard`
   - Verify all dashboard functionality remains intact

2. API Communication:
   - Verify Kynsey AI chat still works with backend
   - Confirm dashboard data loading
   - Test all interactive features

3. Error Handling:
   - Test server availability
   - Verify proper error messages
   - Check fallback behaviors

## Dependencies
- Express.js
- CORS middleware
- React (loaded via CDN)
- Ollama
- Various frontend libraries (Tailwind CSS, etc.)

## Future Considerations
1. Shared State Management:
   - Consider implementing shared session management
   - Add user authentication/authorization

2. Performance Optimization:
   - Look into caching strategies
   - Consider bundling optimizations

3. Monitoring:
   - Add logging
   - Implement error tracking
   - Set up performance monitoring

## Next Steps
1. Switch to Code mode to implement server changes
2. Implement frontend modifications
3. Test the integration
4. Deploy and verify functionality