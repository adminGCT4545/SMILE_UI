import { TimePeriod } from '../components/TimeFilterControl';

// Define realistic value ranges for each KPI
export const valueRanges = {
  surgicalRevenue: {
    min: 10000,
    max: 100000,
    scale: 1000, // For trend data scaling
    growthRate: 0.05, // 5% average monthly growth
    seasonality: 0.2, // 20% seasonal variation
  },
  appointmentsScheduled: {
    min: 20,
    max: 200,
    scale: 1,
    growthRate: 0.03,
    seasonality: 0.15,
  },
  cancellations: {
    min: 1,
    max: 30,
    scale: 0.2,
    growthRate: -0.02, // Negative growth (improvement)
    seasonality: 0.1,
  },
  activeBracesCases: {
    min: 50,
    max: 300,
    scale: 2,
    growthRate: 0.04,
    seasonality: 0.05,
  },
};

// Generate more realistic trend data with patterns
export const generateRealisticTrendData = (
  period: TimePeriod,
  key: string,
  valueKey: string,
  config: {
    min: number;
    max: number;
    scale: number;
    growthRate: number;
    seasonality: number;
  }
): Array<{ [key: string]: string | number }> => {
  const points: Array<{ [key: string]: string | number }> = [];
  let count = 0;
  let labels: string[] = [];

  // Determine number of data points and labels based on period
  switch (period) {
    case 'day':
      count = 24; // Hourly for a day
      labels = Array.from({ length: count }, (_, i) => 
        `${i.toString().padStart(2, '0')}:00`);
      break;
    case 'week':
      count = 7; // Daily for a week
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      break;
    case 'month':
      count = 30; // Daily for a month
      labels = Array.from({ length: count }, (_, i) => 
        `Day ${i + 1}`);
      break;
    case 'year':
      count = 12; // Monthly for a year
      labels = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      break;
    case 'pytd':
      count = 12; // Monthly for PYTD
      labels = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      break;
  }

  // Base value from which we'll apply growth and seasonality
  const baseValue = (config.max + config.min) / 2;
  
  for (let i = 0; i < count; i++) {
    // Calculate growth component (linear growth over time)
    const growthComponent = baseValue * config.growthRate * i / count;
    
    // Calculate seasonality component (sinusoidal pattern)
    const seasonalityComponent = baseValue * config.seasonality * 
      Math.sin(i / count * Math.PI * 2);
    
    // Add some randomness (up to 10% variation)
    const randomComponent = baseValue * 0.1 * (Math.random() - 0.5);
    
    // Calculate final value with constraints
    let value = baseValue + growthComponent + seasonalityComponent + randomComponent;
    value = Math.max(config.min, Math.min(config.max, value)); // Constrain to range
    
    points.push({
      [key]: labels[i % labels.length],
      [valueKey]: Math.floor(value),
    });
  }

  return points;
};

// Mock API function with enhanced data generation
export const enhancedMockApiFetch = (period: TimePeriod): Promise<any> => {
  console.log(`Fetching enhanced data for period: ${period}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = {
        surgicalRevenue: {
          currentValue: Math.floor(
            valueRanges.surgicalRevenue.min + 
            Math.random() * (valueRanges.surgicalRevenue.max - valueRanges.surgicalRevenue.min)
          ),
          pytdValue: Math.floor(
            valueRanges.surgicalRevenue.min * 0.9 + 
            Math.random() * (valueRanges.surgicalRevenue.max - valueRanges.surgicalRevenue.min) * 0.9
          ), // 10% lower on average
          trendData: generateRealisticTrendData(
            period, 
            'date', 
            'revenue', 
            valueRanges.surgicalRevenue
          ),
        },
        appointmentsScheduled: {
          currentValue: Math.floor(
            valueRanges.appointmentsScheduled.min + 
            Math.random() * (valueRanges.appointmentsScheduled.max - valueRanges.appointmentsScheduled.min)
          ),
          pytdValue: Math.floor(
            valueRanges.appointmentsScheduled.min * 0.9 + 
            Math.random() * (valueRanges.appointmentsScheduled.max - valueRanges.appointmentsScheduled.min) * 0.9
          ),
          trendData: generateRealisticTrendData(
            period, 
            'day', 
            'count', 
            valueRanges.appointmentsScheduled
          ),
        },
        cancellations: {
          currentValue: Math.floor(
            valueRanges.cancellations.min + 
            Math.random() * (valueRanges.cancellations.max - valueRanges.cancellations.min)
          ),
          pytdValue: Math.floor(
            valueRanges.cancellations.min * 1.1 + 
            Math.random() * (valueRanges.cancellations.max - valueRanges.cancellations.min) * 1.1
          ), // 10% higher on average (worse)
          trendData: generateRealisticTrendData(
            period, 
            'day', 
            'count', 
            valueRanges.cancellations
          ),
        },
        activeBracesCases: {
          currentValue: Math.floor(
            valueRanges.activeBracesCases.min + 
            Math.random() * (valueRanges.activeBracesCases.max - valueRanges.activeBracesCases.min)
          ),
          pytdValue: Math.floor(
            valueRanges.activeBracesCases.min * 0.85 + 
            Math.random() * (valueRanges.activeBracesCases.max - valueRanges.activeBracesCases.min) * 0.85
          ), // 15% lower on average
          trendData: generateRealisticTrendData(
            period, 
            'month', 
            'count', 
            valueRanges.activeBracesCases
          ),
        },
      };
      resolve(data);
    }, 800); // Simulate network delay
  });
};

// Function to validate KPI data structure
export const validateKpiData = (data: any): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];

  if (!data) {
    issues.push('Data is null or undefined');
    return { valid: false, issues };
  }

  // Check required KPIs
  const requiredKpis = [
    'surgicalRevenue', 
    'appointmentsScheduled', 
    'cancellations', 
    'activeBracesCases'
  ];
  
  for (const kpi of requiredKpis) {
    if (!data[kpi]) {
      issues.push(`Missing KPI: ${kpi}`);
      continue;
    }
    
    // Check KPI structure
    const kpiData = data[kpi];
    
    if (typeof kpiData.currentValue !== 'number' && kpiData.currentValue !== null) {
      issues.push(`${kpi}: currentValue must be a number or null`);
    }
    
    if (kpiData.pytdValue !== undefined && 
        typeof kpiData.pytdValue !== 'number' && 
        kpiData.pytdValue !== null) {
      issues.push(`${kpi}: pytdValue must be a number or null`);
    }
    
    if (!Array.isArray(kpiData.trendData)) {
      issues.push(`${kpi}: trendData must be an array`);
    } else if (kpiData.trendData.length === 0) {
      issues.push(`${kpi}: trendData array is empty`);
    }
  }

  return { 
    valid: issues.length === 0,
    issues 
  };
};