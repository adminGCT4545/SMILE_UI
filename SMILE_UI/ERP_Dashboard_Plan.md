# ERP Dashboard Component Plan

## 1. Analysis Summary (`smile-brands-erp.tsx`)

*   **Technology Stack:** React, TypeScript, Tailwind CSS, `recharts`, `lucide-react`.
*   **Component Structure:** Large, single-file component managing multiple views via state. Uses functional components and hooks.
*   **UI Patterns:** Sidebar navigation, cards, tables, conditional styling, responsive design.
*   **Styling:** Heavy use of Tailwind utility classes. Consistent color palette.
*   **Data:** Sample data hardcoded; no explicit data fetching logic.

## 2. Requirements Summary

*   **Functionality:** Interactive dashboard for ERP KPIs.
*   **KPIs:** Surgical Revenue, Appointments Scheduled, Cancellations, Active Braces Cases.
*   **Interactivity:** Display current value, trend visualizations (charts) with tooltips.
*   **Filtering:** Filter by Day, Week, Month, Year, PYTD. Dynamic updates.
*   **Design:** Modern, clean, user-friendly UI using Tailwind CSS. Responsive.
*   **Data Handling:** Assume API fetching (mock initially), handle loading/error states. Define data structures.
*   **Deliverable:** Complete, commented source code for the component and sub-components.

## 3. Proposed Plan

### 3.1. File Structure

*   `src/components/ERPDashboard.tsx` (Main component)
*   `src/components/KPICard.tsx` (Reusable KPI display card)
*   `src/components/TrendChart.tsx` (Reusable chart wrapper)
*   `src/components/TimeFilterControl.tsx` (Time period selector)
    *(Assumption: `src/components/` directory exists or will be created)*

### 3.2. Component Breakdown

*   **`ERPDashboard.tsx`:**
    *   Manages state: `selectedPeriod`, `kpiData`, `isLoading`, `error`.
    *   Handles data fetching via `useEffect` based on `selectedPeriod`.
    *   Renders layout, `TimeFilterControl`, and maps data to `KPICard`s.
*   **`KPICard.tsx`:**
    *   Props: `title`, `value`, `trendData`, `pytdValue` (optional), `isLoading`, `error`.
    *   Displays title, value, PYTD value (if applicable).
    *   Conditionally renders `TrendChart`.
    *   Handles loading/error states.
*   **`TrendChart.tsx`:**
    *   Props: `data`, `chartType` ('line' or 'area'), `dataKey`, `xAxisKey`.
    *   Uses `recharts` for visualization.
    *   Configures tooltips.
*   **`TimeFilterControl.tsx`:**
    *   Props: `selectedPeriod`, `onPeriodChange`.
    *   Renders UI for time selection (buttons/dropdown).
    *   Calls `onPeriodChange` on selection.

### 3.3. Data Structures & Types (TypeScript)

*   Define interfaces for API responses, props, and data points.
*   **Example API Structure (per KPI, per period):**
    ```typescript
    interface KpiApiResponse {
      currentValue: number;
      trendData: Array<{ date: string; value: number }>; // 'value' key might differ per KPI
      pytdValue?: number; // Included based on filter or comparison need
    }

    // Example for Surgical Revenue (using 'revenue' as the value key)
    // {
    //   "currentValue": 125000,
    //   "trendData": [
    //     { "date": "2025-04-01", "revenue": 5000 },
    //     { "date": "2025-04-24", "revenue": 6200 }
    //   ],
    //   "pytdValue": 115000
    // }
    ```

### 3.4. Styling

*   Use Tailwind CSS consistently for layout, spacing, typography, colors, etc.
*   Ensure responsiveness and a clean, professional look.

### 3.5. Visualizations & Comparison

*   **Chart Types:** Area charts for revenue, Line charts for counts (Appointments, Cancellations, Braces Cases).
*   **PYTD Comparison:** Display as a separate numerical value on the `KPICard`.

## 4. Component Structure Diagram (Mermaid)

```mermaid
graph TD
    A[ERPDashboard.tsx] --> B(TimeFilterControl.tsx);
    A --> C{KPI Data Loop};
    C --> D[KPICard.tsx];
    D --> E[TrendChart.tsx];
    E --> F[Recharts Components];

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#ccf,stroke:#333,stroke-width:1px
    style C fill:#eee,stroke:#333,stroke-width:1px,stroke-dasharray: 5 5
    style D fill:#ccf,stroke:#333,stroke-width:1px
    style E fill:#ccf,stroke:#333,stroke-width:1px
    style F fill:#eef,stroke:#333,stroke-width:1px