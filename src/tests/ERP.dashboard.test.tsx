import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ERPDashboard from '../components/ERPDashboard';
import KPICard from '../components/KPICard';
import TimeFilterControl from '../components/TimeFilterControl';
import TrendChart from '../components/TrendChart';

// Mock the chart component to avoid issues with testing chart rendering
jest.mock('recharts', () => {
  const OriginalRechartsModule = jest.requireActual('recharts');
  
  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
    LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
    AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
    Line: () => <div data-testid="line-element"></div>,
    Area: () => <div data-testid="area-element"></div>,
    XAxis: () => <div data-testid="x-axis"></div>,
    YAxis: () => <div data-testid="y-axis"></div>,
    Tooltip: () => <div data-testid="tooltip"></div>,
    CartesianGrid: () => <div data-testid="cartesian-grid"></div>,
    Legend: () => <div data-testid="legend"></div>,
  };
});

// Mock Lucide icons to avoid rendering issues
jest.mock('lucide-react', () => {
  return {
    Loader2: () => <span data-testid="loader-icon">Loading Icon</span>,
    AlertTriangle: () => <span data-testid="alert-icon">Alert Icon</span>,
    DollarSign: () => <span data-testid="dollar-icon">$ Icon</span>,
    Calendar: () => <span data-testid="calendar-icon">Calendar Icon</span>,
    XCircle: () => <span data-testid="cancel-icon">X Icon</span>,
    Users: () => <span data-testid="users-icon">Users Icon</span>,
  };
});

// Tests for TimeFilterControl component
describe('TimeFilterControl Component', () => {
  const mockOnPeriodChange = jest.fn();
  
  beforeEach(() => {
    mockOnPeriodChange.mockClear();
  });
  
  test('renders all period buttons', () => {
    render(<TimeFilterControl selectedPeriod="month" onPeriodChange={mockOnPeriodChange} />);
    
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('PYTD')).toBeInTheDocument();
  });
  
  test('highlights selected period', () => {
    const { rerender } = render(
      <TimeFilterControl selectedPeriod="month" onPeriodChange={mockOnPeriodChange} />
    );
    
    const monthButton = screen.getByText('Month');
    expect(monthButton).toHaveClass('bg-white');
    expect(monthButton).toHaveClass('text-blue-600');
    
    // Change selected period and verify highlighting changes
    rerender(
      <TimeFilterControl selectedPeriod="week" onPeriodChange={mockOnPeriodChange} />
    );
    
    const weekButton = screen.getByText('Week');
    expect(weekButton).toHaveClass('bg-white');
    expect(weekButton).toHaveClass('text-blue-600');
    expect(monthButton).not.toHaveClass('bg-white');
  });
  
  test('calls onPeriodChange when button is clicked', () => {
    render(
      <TimeFilterControl selectedPeriod="month" onPeriodChange={mockOnPeriodChange} />
    );
    
    fireEvent.click(screen.getByText('Week'));
    expect(mockOnPeriodChange).toHaveBeenCalledWith('week');
    
    fireEvent.click(screen.getByText('Year'));
    expect(mockOnPeriodChange).toHaveBeenCalledWith('year');
  });
});

// Tests for TrendChart component
describe('TrendChart Component', () => {
  const sampleData = [
    { date: 'Jan', revenue: 1000, count: 10 },
    { date: 'Feb', revenue: 1500, count: 15 },
    { date: 'Mar', revenue: 1200, count: 12 },
  ];
  
  test('renders area chart correctly', () => {
    render(
      <TrendChart 
        data={sampleData} 
        chartType="area" 
        dataKey="revenue" 
        xAxisKey="date" 
      />
    );
    
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('area-element')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
  });
  
  test('renders line chart correctly', () => {
    render(
      <TrendChart 
        data={sampleData} 
        chartType="line" 
        dataKey="count" 
        xAxisKey="date" 
      />
    );
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-element')).toBeInTheDocument();
  });
  
  test('displays message when no data is available', () => {
    render(
      <TrendChart 
        data={[]} 
        chartType="line" 
        dataKey="count" 
        xAxisKey="date" 
      />
    );
    
    expect(screen.getByText('No data available for chart.')).toBeInTheDocument();
  });
});

// Tests for KPICard component
describe('KPICard Component', () => {
  const sampleTrendData = [
    { date: 'Jan', revenue: 1000 },
    { date: 'Feb', revenue: 1500 },
    { date: 'Mar', revenue: 1200 },
  ];
  
  test('renders title and values correctly', () => {
    render(
      <KPICard 
        title="Test KPI" 
        currentValue={1000}
        pytdValue={900}
        trendData={sampleTrendData}
        chartType="area"
        dataKey="revenue"
        xAxisKey="date"
        isLoading={false}
        error={null}
        valuePrefix="$"
        pytdLabel="Previous Year"
      />
    );
    
    expect(screen.getByText('Test KPI')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
    expect(screen.getByText('Previous Year: $900')).toBeInTheDocument();
  });
  
  test('displays loading state', () => {
    render(
      <KPICard 
        title="Test KPI" 
        currentValue={null}
        isLoading={true}
        error={null}
      />
    );
    
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  test('displays error state', () => {
    render(
      <KPICard 
        title="Test KPI" 
        currentValue={null}
        isLoading={false}
        error="Failed to load data"
      />
    );
    
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });
  
  test('formats values correctly', () => {
    render(
      <KPICard 
        title="Test KPI" 
        currentValue={1234567.89}
        pytdValue={987654.32}
        isLoading={false}
        error={null}
        valuePrefix="$"
        valueSuffix=" USD"
      />
    );
    
    expect(screen.getByText('$1,234,567.89 USD')).toBeInTheDocument();
    expect(screen.getByText('PYTD: $987,654.32 USD')).toBeInTheDocument();
  });
});

// Tests for the main ERPDashboard component
describe('ERPDashboard Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  
  test('renders dashboard title and filter controls', async () => {
    render(<ERPDashboard />);
    
    expect(screen.getByText('ERP Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
  });
  
  test('initially shows loading state and then displays KPI cards', async () => {
    render(<ERPDashboard />);
    
    // Initially should show loading indicators
    expect(screen.getAllByText('Loading...').length).toBe(4);
    
    // After data load, should show KPI titles
    await waitFor(() => {
      expect(screen.getByText('Surgical Revenue')).toBeInTheDocument();
      expect(screen.getByText('Appointments Scheduled')).toBeInTheDocument();
      expect(screen.getByText('Cancellations')).toBeInTheDocument();
      expect(screen.getByText('Active Braces Cases')).toBeInTheDocument();
    });
  });
  
  test('changes data when period filter is clicked', async () => {
    render(<ERPDashboard />);
    
    // Wait for initial data load
    await waitFor(() => {
      expect(screen.getByText('Surgical Revenue')).toBeInTheDocument();
    });
    
    // Change period to Week and check loading state appears again
    fireEvent.click(screen.getByText('Week'));
    
    // Should briefly show loading state
    expect(screen.getAllByText('Loading...').length).toBe(4);
    
    // Then data should load again
    await waitFor(() => {
      expect(screen.getByText('Surgical Revenue')).toBeInTheDocument();
    });
  });
});