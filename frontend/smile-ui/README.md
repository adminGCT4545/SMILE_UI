# Smile Brands ERP Dashboard

A web-based dashboard application for Smile Brands that displays key performance indicators (KPIs) such as surgical revenue, appointments scheduled, cancellations, and active braces cases.

## Prerequisites

- [Node.js](https://nodejs.org/) (v12.0.0 or higher)

## Installation

1. Clone or download this repository to your local machine.

2. Navigate to the project directory:
   ```
   cd "SMILE UI"
   ```

3. No npm dependencies need to be installed as the application uses CDN-hosted libraries:
   - React and ReactDOM from unpkg.com
   - Babel for JSX transpilation
   - Recharts for data visualization
   - TailwindCSS for styling

## Configuration

The application uses an environment variable for the server port. By default, it runs on port 3001.

If you want to change the port, you can modify the `.env` file:
```
PORT=3001
```

Note: The server.js file has been configured to use port 3001 instead of the default 1001 to avoid permission issues on some systems.

## Running the Application

To start the application server, run:

```
node server.js
```

This will start a simple HTTP server that serves the application files.

## Accessing the Dashboard

Once the server is running, you can access the dashboard by opening a web browser and navigating to:

```
http://localhost:3001/
```

The main page will automatically redirect you to the enhanced dashboard test environment.

You can also directly access the test dashboard at:

```
http://localhost:3001/src/tests/enhanced-dashboard.html
```

## Test Environment

The application includes a test environment that allows you to:

1. Load sample dashboard data
2. Input custom data for testing
3. Run validation tests to ensure the dashboard is functioning correctly

The sample data includes information for:
- Surgical Revenue
- Appointments Scheduled
- Cancellations
- Active Braces Cases

Each KPI includes current values, previous year-to-date (PYTD) values, and trend data for visualization.

## Project Structure

- `server.js` - Simple Node.js HTTP server
- `index.html` - Main entry point that redirects to the test dashboard
- `dashboard.html` - Main dashboard page
- `src/components/` - React components for the dashboard
- `src/tests/` - Test environment and sample data

## Components

The dashboard consists of several React components:
- ERPDashboard - Main dashboard component
- KPICard - Component for displaying individual KPIs
- TimeFilterControl - Component for filtering data by time period
- TrendChart - Component for visualizing trend data

## Data Structure

The dashboard expects data in the following format:

```json
{
  "kpiName": {
    "currentValue": number,
    "pytdValue": number,
    "trendData": [
      { "date": "label", "value": number },
      ...
    ]
  },
  ...
}
```

Example KPIs include:
- surgicalRevenue
- appointmentsScheduled
- cancellations
- activeBracesCases
