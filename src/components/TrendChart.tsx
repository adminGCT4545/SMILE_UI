import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  AreaChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

// Define the structure for individual data points in the chart
interface DataPoint {
  [key: string]: string | number; // Allows for flexible keys like 'date', 'month', 'value', 'revenue', etc.
}

// Define the props for the TrendChart component
interface TrendChartProps {
  data: DataPoint[];
  chartType: 'line' | 'area';
  dataKey: string; // The key in DataPoint objects that holds the value to plot (e.g., 'revenue', 'count')
  xAxisKey: string; // The key in DataPoint objects for the X-axis label (e.g., 'date', 'month')
  strokeColor?: string; // Optional color for the line/area stroke
  fillColor?: string; // Optional color for the area fill
}

// Custom Tooltip Content Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border border-gray-300 rounded shadow-md text-sm">
        <p className="label font-semibold">{`${label}`}</p>
        <p className="intro">{`${payload[0].name} : ${payload[0].value.toLocaleString()}`}</p>
        {/* Add more details if needed */}
      </div>
    );
  }

  return null;
};


const TrendChart: React.FC<TrendChartProps> = ({
  data,
  chartType,
  dataKey,
  xAxisKey,
  strokeColor = "#3b82f6", // Default to blue-500
  fillColor = "#bfdbfe", // Default to blue-200
}) => {
  // Basic validation or placeholder if no data
  console.log('[Debug] TrendChart render:', {
    hasData: Boolean(data),
    dataLength: data?.length,
    dataKey,
    xAxisKey,
    firstDataPoint: data?.[0],
    lastDataPoint: data?.[data?.length - 1]
  });

  if (!data || data.length === 0) {
    console.log('[Debug] TrendChart: No data available');
    return <div className="text-center text-gray-500 py-4">No data available for chart.</div>;
  }

  const ChartComponent = chartType === 'line' ? LineChart : AreaChart;
  const ChartElement = chartType === 'line' ? Line : Area;

  return (
    // Ensure the container has a defined height for ResponsiveContainer to work
    <div style={{ width: '100%', height: 150 }}>
      <ResponsiveContainer>
        <ChartComponent data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 10, fill: '#6b7280' }} // Smaller font size, gray color
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd" // Adjust interval as needed
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : value} // Format numbers
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }}/>
          {console.log('[Debug] TrendChart data validation passed, rendering chart')}
          <ChartElement
            type="monotone"
            dataKey={dataKey}
            stroke={strokeColor}
            fillOpacity={1}
            fill={chartType === 'area' ? fillColor : 'none'} // Only fill for area charts
            strokeWidth={2}
            dot={false} // Hide dots on the line/area for cleaner look
            activeDot={{ r: 4, strokeWidth: 1, fill: strokeColor }} // Style for active dot on hover
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;