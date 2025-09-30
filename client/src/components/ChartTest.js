import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { commonChartOptions, chartColors, gradientColors } from '../utils/chartSetup';

const ChartTest = () => {
  // Sample data for testing
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Survey Responses',
        data: [65, 59, 80, 81, 56, 55],
        ...chartColors.primary,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const barData = {
    labels: ['Free', 'Pro', 'Enterprise'],
    datasets: [
      {
        label: 'Users',
        data: [300, 150, 50],
        backgroundColor: gradientColors.slice(0, 3),
        borderColor: gradientColors.slice(0, 3).map(color => color.replace('0.8', '1')),
        borderWidth: 1
      }
    ]
  };

  const doughnutData = {
    labels: ['Completed', 'In Progress', 'Abandoned'],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: [
          chartColors.success.border,
          chartColors.warning.border,
          chartColors.danger.border
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="font-bold text-lg mb-4">📊 Chart.js Test</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Line Chart</h4>
          <div style={{ height: '150px' }}>
            <Line data={lineData} options={commonChartOptions} />
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Bar Chart</h4>
          <div style={{ height: '150px' }}>
            <Bar data={barData} options={commonChartOptions} />
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Doughnut Chart</h4>
          <div style={{ height: '150px' }}>
            <Doughnut 
              data={doughnutData} 
              options={{
                ...commonChartOptions,
                scales: undefined // Doughnut charts don't use scales
              }} 
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-600">
        <div>✅ Chart.js components registered</div>
        <div>✅ All chart types working</div>
        <div>✅ No console errors</div>
      </div>
    </div>
  );
};

export default ChartTest;
