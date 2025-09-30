// Centralized Chart.js setup to avoid registration issues
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
} from 'chart.js';

// Register all Chart.js components globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

// Export ChartJS for use in components
export { ChartJS };

// Common chart options
export const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: 12,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 6,
      displayColors: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11
        },
        color: '#6B7280'
      }
    },
    y: {
      grid: {
        color: 'rgba(107, 114, 128, 0.1)'
      },
      ticks: {
        font: {
          size: 11
        },
        color: '#6B7280'
      }
    }
  }
};

// Chart color schemes
export const chartColors = {
  primary: {
    background: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 1)',
    point: 'rgba(59, 130, 246, 1)'
  },
  success: {
    background: 'rgba(34, 197, 94, 0.1)',
    border: 'rgba(34, 197, 94, 1)',
    point: 'rgba(34, 197, 94, 1)'
  },
  warning: {
    background: 'rgba(251, 191, 36, 0.1)',
    border: 'rgba(251, 191, 36, 1)',
    point: 'rgba(251, 191, 36, 1)'
  },
  danger: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 1)',
    point: 'rgba(239, 68, 68, 1)'
  },
  info: {
    background: 'rgba(99, 102, 241, 0.1)',
    border: 'rgba(99, 102, 241, 1)',
    point: 'rgba(99, 102, 241, 1)'
  }
};

// Gradient colors for charts
export const gradientColors = [
  'rgba(59, 130, 246, 0.8)',
  'rgba(34, 197, 94, 0.8)',
  'rgba(251, 191, 36, 0.8)',
  'rgba(239, 68, 68, 0.8)',
  'rgba(99, 102, 241, 0.8)',
  'rgba(236, 72, 153, 0.8)',
  'rgba(14, 165, 233, 0.8)',
  'rgba(168, 85, 247, 0.8)'
];

export default ChartJS;
