import React from 'react';
import TrendChart from './TrendChart'; // Import the chart component
import { Loader2, AlertTriangle } from 'lucide-react'; // Icons for loading and error states

// Define the structure for chart data points (consistent with TrendChart)
interface DataPoint {
  [key: string]: string | number;
}

// Define the props for the KPICard component
interface KPICardProps {
  title: string;
  currentValue: number | null; // Can be null during loading or if data is unavailable
  pytdValue?: number | null; // Previous Year To Date value (optional)
  trendData?: DataPoint[]; // Data for the chart (optional)
  chartType?: 'line' | 'area'; // Chart type (optional)
  dataKey?: string; // Key for the value in trendData (required if trendData is provided)
  xAxisKey?: string; // Key for the X-axis label in trendData (required if trendData is provided)
  isLoading: boolean;
  error: string | null;
  valuePrefix?: string; // Optional prefix for the main value (e.g., '$')
  valueSuffix?: string; // Optional suffix for the main value (e.g., '%')
  pytdLabel?: string; // Optional label for the PYTD value (defaults to 'PYTD')
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  currentValue,
  pytdValue,
  trendData,
  chartType,
  dataKey,
  xAxisKey,
  isLoading,
  error,
  valuePrefix = '',
  valueSuffix = '',
  pytdLabel = 'PYTD',
}) => {
  const formatValue = (value: number | null | undefined): string => {
    console.log('[Debug] KPICard formatting value:', { value, title });
    if (value === null || typeof value === 'undefined') return '-';
    return `${valuePrefix}${value.toLocaleString()}${valueSuffix}`;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <Loader2 className="animate-spin h-8 w-8 mb-2" />
          <span>Loading...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-600">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <span className="text-center text-sm">{error}</span>
        </div>
      );
    }

    // Ensure required props for chart are present if trendData is provided
    const canShowChart = trendData && trendData.length > 0 && chartType && dataKey && xAxisKey;
    console.log('[Debug] KPICard chart validation:', {
      title,
      hasData: Boolean(trendData),
      dataLength: trendData?.length,
      chartType,
      dataKey,
      xAxisKey,
      canShowChart
    });

    return (
      <>
        <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
        <div className="mt-1 flex items-baseline justify-between">
            <p className="text-2xl font-semibold text-gray-900">
                {formatValue(currentValue)}
            </p>
            {typeof pytdValue === 'number' && (
                <span className="text-xs font-medium text-gray-500 ml-2">
                    {pytdLabel}: {formatValue(pytdValue)}
                </span>
            )}
        </div>
        {canShowChart && (
          <div className="mt-4">
            <TrendChart
              data={trendData}
              chartType={chartType}
              dataKey={dataKey}
              xAxisKey={xAxisKey}
              // You might want to pass specific colors based on KPI later
            />
          </div>
        )}
         {!canShowChart && trendData && ( // Show message if chart data was expected but invalid/empty
             <div className="mt-4 text-center text-xs text-gray-400 italic">Chart data unavailable</div>
         )}
      </>
    );
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg p-4 flex flex-col justify-between min-h-[150px]">
      {renderContent()}
    </div>
  );
};

export default KPICard;