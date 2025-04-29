import React, { useState, useEffect, useCallback } from 'react';
import KPICard from './KPICard';
import TimeFilterControl, { TimePeriod } from './TimeFilterControl';
import { DollarSign, Calendar, XCircle, Users } from 'lucide-react'; // Example icons

// --- Data Structures ---

interface DataPoint {
  [key: string]: string | number;
}

interface KpiData {
  currentValue: number | null;
  pytdValue?: number | null;
  trendData?: DataPoint[];
}

interface AllKpisData {
  surgicalRevenue: KpiData;
  appointmentsScheduled: KpiData;
  cancellations: KpiData;
  activeBracesCases: KpiData;
}

// --- Mock API Function ---

// Helper to generate random trend data
const generateTrendData = (period: TimePeriod, key: string, valueKey: string, scale: number = 1): DataPoint[] => {
  const points: DataPoint[] = [];
  let count = 0;
  switch (period) {
    case 'day': count = 8; break; // Hourly for today
    case 'week': count = 7; break; // Daily for week
    case 'month': count = 30; break; // Daily for month
    case 'year': count = 12; break; // Monthly for year
    case 'pytd': count = 12; break; // Monthly for PYTD
  }

  for (let i = 0; i < count; i++) {
    points.push({
      [key]: `${period}-${i + 1}`, // Simple label
      [valueKey]: Math.floor(Math.random() * 100 * scale) + 50 * scale,
    });
  }
  return points;
};

const mockApiFetch = (period: TimePeriod): Promise<AllKpisData> => {
  console.log(`Fetching data for period: ${period}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const data: AllKpisData = {
        surgicalRevenue: {
          currentValue: Math.floor(Math.random() * 50000) + 10000,
          pytdValue: period === 'pytd' ? Math.floor(Math.random() * 45000) + 9000 : Math.floor(Math.random() * 45000) + 9000, // Always include for demo
          trendData: generateTrendData(period, 'date', 'revenue', 1000),
        },
        appointmentsScheduled: {
          currentValue: Math.floor(Math.random() * 100) + 20,
          pytdValue: period === 'pytd' ? Math.floor(Math.random() * 90) + 18 : Math.floor(Math.random() * 90) + 18,
          trendData: generateTrendData(period, 'day', 'count', 1),
        },
        cancellations: {
          currentValue: Math.floor(Math.random() * 15) + 1,
          pytdValue: period === 'pytd' ? Math.floor(Math.random() * 14) + 1 : Math.floor(Math.random() * 14) + 1,
          trendData: generateTrendData(period, 'day', 'count', 0.2),
        },
        activeBracesCases: {
          currentValue: Math.floor(Math.random() * 200) + 50,
          pytdValue: period === 'pytd' ? Math.floor(Math.random() * 180) + 45 : Math.floor(Math.random() * 180) + 45,
          trendData: generateTrendData(period, 'month', 'count', 2),
        },
      };
      resolve(data);
    }, 800); // Simulate network delay
  });
};

// --- Dashboard Component ---

const ERPDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  const [kpiData, setKpiData] = useState<AllKpisData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataForPeriod = useCallback(async (period: TimePeriod) => {
    console.log('[Debug] Starting data fetch for period:', period);
    console.log('[Debug] Previous KPI data:', kpiData);
    setIsLoading(true);
    setError(null);
    setKpiData(null); // Clear previous data immediately for better UX
    try {
      const data = await mockApiFetch(period);
      console.log('[Debug] Received data:', data);
      setKpiData(data);
      console.log('[Debug] KPI data updated');
    } catch (err) {
      console.error("Failed to fetch KPI data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on initial load and when period changes
  useEffect(() => {
    fetchDataForPeriod(selectedPeriod);
  }, [selectedPeriod, fetchDataForPeriod]);

  const handlePeriodChange = (newPeriod: TimePeriod) => {
    setSelectedPeriod(newPeriod);
  };

  // Helper to safely access nested data
  const getKpiValue = (key: keyof AllKpisData, field: keyof KpiData) => {
      if (isLoading || error || !kpiData) return field === 'trendData' ? [] : null;
      return kpiData[key]?.[field];
  }


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">ERP Dashboard</h1>
        <TimeFilterControl
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
      </div>

      {/* Grid for KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Surgical Revenue */}
        <KPICard
          title="Surgical Revenue"
          currentValue={getKpiValue('surgicalRevenue', 'currentValue') as number | null}
          pytdValue={getKpiValue('surgicalRevenue', 'pytdValue') as number | null}
          trendData={getKpiValue('surgicalRevenue', 'trendData') as DataPoint[]}
          chartType="area"
          dataKey="revenue"
          xAxisKey="date" // Matches generateTrendData key
          isLoading={isLoading}
          error={error}
          valuePrefix="$"
        />

        {/* Appointments Scheduled */}
        <KPICard
          title="Appointments Scheduled"
          currentValue={getKpiValue('appointmentsScheduled', 'currentValue') as number | null}
          pytdValue={getKpiValue('appointmentsScheduled', 'pytdValue') as number | null}
          trendData={getKpiValue('appointmentsScheduled', 'trendData') as DataPoint[]}
          chartType="line"
          dataKey="count"
          xAxisKey="day" // Matches generateTrendData key
          isLoading={isLoading}
          error={error}
        />

        {/* Cancellations */}
        <KPICard
          title="Cancellations"
          currentValue={getKpiValue('cancellations', 'currentValue') as number | null}
          pytdValue={getKpiValue('cancellations', 'pytdValue') as number | null}
          trendData={getKpiValue('cancellations', 'trendData') as DataPoint[]}
          chartType="line"
          dataKey="count"
          xAxisKey="day" // Matches generateTrendData key
          isLoading={isLoading}
          error={error}
        />

        {/* Active Braces Cases */}
        <KPICard
          title="Active Braces Cases"
          currentValue={getKpiValue('activeBracesCases', 'currentValue') as number | null}
          pytdValue={getKpiValue('activeBracesCases', 'pytdValue') as number | null}
          trendData={getKpiValue('activeBracesCases', 'trendData') as DataPoint[]}
          chartType="line"
          dataKey="count"
          xAxisKey="month" // Matches generateTrendData key
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Placeholder for potential future sections */}
      {/* <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Additional Insights</h2>
        </div> */}
    </div>
  );
};

export default ERPDashboard;