import React from 'react';

// Define the possible time periods
export type TimePeriod = 'day' | 'week' | 'month' | 'year' | 'pytd';

// Define the props for the TimeFilterControl component
interface TimeFilterControlProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

// Define the display labels for each period
const periodLabels: Record<TimePeriod, string> = {
  day: 'Today',
  week: 'Week',
  month: 'Month',
  year: 'Year',
  pytd: 'PYTD',
};

const TimeFilterControl: React.FC<TimeFilterControlProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  const periods: TimePeriod[] = ['day', 'week', 'month', 'year', 'pytd'];

  return (
    <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
      {periods.map((period) => (
        <button
          key={period}
          data-period={period}
          onClick={() => onPeriodChange(period)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
            ${
              selectedPeriod === period
                ? 'bg-white text-blue-600 shadow-sm' // Active state
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800' // Inactive state
            }
          `}
        >
          {periodLabels[period]}
        </button>
      ))}
    </div>
  );
};

export default TimeFilterControl;