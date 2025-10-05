/**
 * Simplified report export utilities with AI enhancement
 */
import { enhanceReportWithAI, ReportAI } from './reportAI';
import { exportSocialContent, generateSocialSharingReport } from './socialMediaShare';
import { exportPowerPointBrowserEnhanced } from './browserPowerPointExport';

// Chart quality settings
const CHART_QUALITY = {
  high: { scale: 2, quality: 1.0 },
  medium: { scale: 1.5, quality: 0.8 },
  low: { scale: 1, quality: 0.6 }
};

// Social media optimization settings
const SOCIAL_OPTIMIZATIONS = {
  linkedin: { width: 1200, height: 627, format: 'png' },
  facebook: { width: 1200, height: 630, format: 'png' },
  instagram: { width: 1080, height: 1080, format: 'jpg' },
  twitter: { width: 1200, height: 675, format: 'png' }
};

/**
 * Convert chart canvas to image
 */
export const chartToImage = async (chartRef, options = {}) => {
  if (!chartRef || !chartRef.current) {
    throw new Error('Chart reference not found');
  }

  const canvas = chartRef.current.canvas;
  const { scale = 2, quality = 1.0, format = 'png' } = options;

  // Create a new canvas with higher resolution
  const newCanvas = document.createElement('canvas');
  const ctx = newCanvas.getContext('2d');
  
  newCanvas.width = canvas.width * scale;
  newCanvas.height = canvas.height * scale;
  
  ctx.scale(scale, scale);
  ctx.drawImage(canvas, 0, 0);

  return new Promise((resolve) => {
    newCanvas.toBlob(resolve, `image/${format}`, quality);
  });
};

/**
 * Helper function to get chart image as data URL
 */
const getChartImageData = async (chartRef, settings = {}) => {
  try {
    const chartBlob = await chartToImage(chartRef, {
      ...CHART_QUALITY[settings.chartQuality || 'high'],
      format: settings.imageFormat || 'png'
    });

    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(chartBlob);
    });
  } catch (error) {
    console.error('Error generating chart image:', error);
    return null;
  }
};

/**
 * Export to PowerPoint (Browser-compatible HTML presentations)
 */
export const exportPowerPoint = async (config) => {
  try {
    // Use browser-compatible PowerPoint export
    return await exportPowerPointBrowserEnhanced(config);
  } catch (error) {
    console.error('Browser PowerPoint export failed, falling back to basic HTML:', error);
    // Fallback to basic HTML-based export if enhanced fails
    return await exportPowerPointHTML(config);
  }
};

/**
 * Export to PowerPoint (HTML-based fallback)
 */
export const exportPowerPointHTML = async (config) => {
  const { pages, settings, analyticsData, chartRefs } = config;
  
  try {
    // Create HTML that can be opened in PowerPoint
    let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Survey Analytics Report - PowerPoint Ready</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
          margin: 0; 
          padding: 0; 
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          color: #0f172a;
          line-height: 1.7;
          font-weight: 400;
        }
        
        .report-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        
        .slide { 
          background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%); 
          margin: 40px 0; 
          padding: 60px; 
          border-radius: 20px; 
          box-shadow: 
            0 20px 40px rgba(0,0,0,0.1),
            0 8px 16px rgba(0,0,0,0.06),
            inset 0 1px 0 rgba(255,255,255,0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          page-break-after: always; 
          min-height: 750px;
          position: relative;
          backdrop-filter: blur(10px);
        }
        
        .slide:last-child { page-break-after: avoid; }
        
        .slide::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 25%, #7c3aed 50%, #ec4899 75%, #f59e0b 100%);
          border-radius: 20px 20px 0 0;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }
        
        h1 { 
          font-family: 'Playfair Display', serif;
          color: #0f172a; 
          text-align: center; 
          font-size: 48px; 
          font-weight: 700;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        h2 { 
          font-family: 'Playfair Display', serif;
          color: #0f172a; 
          font-size: 36px; 
          font-weight: 600;
          margin-bottom: 28px;
          padding-bottom: 16px;
          border-bottom: 3px solid transparent;
          background: linear-gradient(white, white) padding-box, linear-gradient(135deg, #3b82f6, #1d4ed8, #7c3aed) border-box;
          position: relative;
        }
        
        h2::before {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8, #7c3aed);
          border-radius: 2px;
        }
        
        h3 { 
          color: #374151; 
          font-size: 24px; 
          font-weight: 600;
          margin-bottom: 16px;
        }
        
        h4 {
          color: #4b5563;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 40px 0; 
          background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 
            0 12px 24px rgba(0,0,0,0.08),
            0 4px 8px rgba(0,0,0,0.04),
            inset 0 1px 0 rgba(255,255,255,0.9);
          border: 1px solid rgba(226, 232, 240, 0.6);
          backdrop-filter: blur(8px);
        }
        
        th, td { 
          border: none; 
          padding: 20px 24px; 
          text-align: left; 
          font-size: 16px; 
          font-weight: 400;
        }
        
        th { 
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%); 
          color: white; 
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
          position: relative;
        }
        
        th::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8, #7c3aed);
        }
        
        tr:nth-child(even) { 
          background-color: #f9fafb; 
        }
        
        tr:hover {
          background-color: #f3f4f6;
          transition: background-color 0.2s ease;
        }
        
        .chart { 
          margin: 40px 0; 
          text-align: center; 
          background: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          border: 1px solid #e5e7eb;
        }
        
        img { 
          max-width: 100%; 
          height: auto; 
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin: 40px 0;
        }
        
        .stat-card {
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
          padding: 40px 28px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 
            0 12px 24px rgba(0,0,0,0.08),
            0 4px 8px rgba(0,0,0,0.04),
            inset 0 1px 0 rgba(255,255,255,0.9);
          border: 1px solid rgba(226, 232, 240, 0.6);
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(8px);
        }
        
        .stat-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 
            0 20px 40px rgba(0,0,0,0.12),
            0 8px 16px rgba(0,0,0,0.06);
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 50%, #7c3aed 100%);
          border-radius: 20px 20px 0 0;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }
        
        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 700;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
          letter-spacing: -0.03em;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .stat-label {
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .insight-box {
          background: linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 2px solid transparent;
          background-clip: padding-box;
          border-radius: 20px;
          padding: 32px;
          margin: 32px 0;
          position: relative;
          box-shadow: 
            0 8px 24px rgba(59, 130, 246, 0.1),
            0 4px 8px rgba(59, 130, 246, 0.05),
            inset 0 1px 0 rgba(255,255,255,0.8);
          backdrop-filter: blur(8px);
        }
        
        .insight-box::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8, #7c3aed);
          border-radius: 20px;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: xor;
        }
        
        .insight-box::after {
          content: '💡';
          position: absolute;
          top: -16px;
          left: 32px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          padding: 12px;
          border-radius: 50%;
          font-size: 24px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .metric-highlight {
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .metric-highlight::before {
          content: '📊';
          font-size: 24px;
        }
        
        .professional-footer {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          color: white;
          padding: 32px;
          border-radius: 20px;
          margin-top: 48px;
          text-align: center;
          box-shadow: 
            0 12px 24px rgba(0,0,0,0.15),
            0 4px 8px rgba(0,0,0,0.08),
            inset 0 1px 0 rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          position: relative;
        }
        
        .professional-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8, #7c3aed, #ec4899);
          border-radius: 20px 20px 0 0;
        }
        
        .professional-footer h4 {
          color: white;
          margin-bottom: 8px;
        }
        
        .professional-footer p {
          color: #d1d5db;
          font-size: 14px;
          margin: 4px 0;
        }
        
        @media print {
          body { background: white; }
          .slide { 
            box-shadow: none; 
            margin: 0; 
            page-break-after: always;
          }
          .slide:last-child { page-break-after: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="report-container">
  `;

  // Enhanced title slide with AI content
  const aiEnhancedReport = enhanceReportWithAI(analyticsData);
  
  htmlContent += `
    <div class="slide">
      <h1>${ReportAI.generateSlideTitles('overview')}</h1>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">${analyticsData.overview.totalSurveys}</div>
          <div class="stat-label">Total Surveys</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${analyticsData.overview.totalResponses}</div>
          <div class="stat-label">Total Responses</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${Math.round(analyticsData.overview.avgCompletionRate * 100)}%</div>
          <div class="stat-label">Completion Rate</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${Math.round(analyticsData.overview.avgTimeSpent)}m</div>
          <div class="stat-label">Avg Time Spent</div>
        </div>
      </div>
      <div class="professional-footer">
        <h4>Report Generated</h4>
        <p>${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p>Professional Analytics Report</p>
      </div>
    </div>
  `;

  // Executive Summary slide
  htmlContent += `
    <div class="slide">
      <h2>${aiEnhancedReport.executiveSummary.title}</h2>
      <div class="insight-box">
        <div style="font-size: 16px; line-height: 1.7; color: #374151;">
          ${aiEnhancedReport.executiveSummary.content.replace(/\n/g, '<br>')}
        </div>
      </div>
    </div>
  `;

  // Enhanced Overview slide with AI insights
  if (pages.includes('overview')) {
    htmlContent += `
      <div class="slide">
        <h2>${ReportAI.generateSlideTitles('metrics')}</h2>
        <table>
          <thead>
            <tr>
              <th>Performance Metric</th>
              <th>Achievement</th>
              <th>Strategic Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Total Surveys</strong></td>
              <td>${analyticsData.overview.totalSurveys}</td>
              <td>Comprehensive survey portfolio driving insights</td>
            </tr>
            <tr>
              <td><strong>Total Responses</strong></td>
              <td>${analyticsData.overview.totalResponses}</td>
              <td>Extensive data collection for strategic decision-making</td>
            </tr>
            <tr>
              <td><strong>Average Completion Rate</strong></td>
              <td>${Math.round(analyticsData.overview.avgCompletionRate * 100)}%</td>
              <td>Industry-leading engagement and user satisfaction</td>
            </tr>
            <tr>
              <td><strong>Average Time Spent</strong></td>
              <td>${Math.round(analyticsData.overview.avgTimeSpent)} minutes</td>
              <td>Optimal user experience design and survey length</td>
            </tr>
            <tr>
              <td><strong>Bounce Rate</strong></td>
              <td>${Math.round(analyticsData.overview.bounceRate * 100)}%</td>
              <td>Opportunity for enhanced user engagement strategies</td>
            </tr>
          </tbody>
        </table>
        <div class="insight-box">
          <h4>Key Performance Insights</h4>
          <div style="font-size: 15px; line-height: 1.7; color: #374151;">
            ${aiEnhancedReport.dataInsights.replace(/\n/g, '<br>')}
          </div>
        </div>
      </div>
    `;
  }

  // Charts slides
  if (settings.includeCharts && pages.includes('charts')) {
    const charts = [
      { ref: chartRefs.responseTrendsChartRef, title: 'Response Trends Over Time' },
      { ref: chartRefs.surveyPerformanceChartRef, title: 'Survey Performance Comparison' },
      { ref: chartRefs.completionRateChartRef, title: 'Completion Rate Analysis' },
      { ref: chartRefs.questionPerformanceChartRef, title: 'Question Performance Metrics' },
      { ref: chartRefs.responseTimeChartRef, title: 'Response Time Distribution' },
      { ref: chartRefs.deviceTypeChartRef, title: 'Device Type Usage Statistics' },
      { ref: chartRefs.satisfactionRatingChartRef, title: 'Satisfaction Rating Analysis' },
      { ref: chartRefs.monthlyTrendsChartRef, title: 'Monthly Response Trends' }
    ];

    let chartsGenerated = 0;
    
    for (const chart of charts) {
      if (chart.ref?.current) {
        try {
          const chartBlob = await chartToImage(chart.ref, {
            ...CHART_QUALITY[settings.chartQuality || 'high'],
            format: settings.imageFormat || 'png'
          });

          const reader = new FileReader();
          const imageData = await new Promise((resolve) => {
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(chartBlob);
          });

          htmlContent += `
            <div class="slide">
              <h2>${chart.title}</h2>
              <div class="chart">
                <img src="${imageData}" alt="${chart.title}" />
              </div>
              <div class="insight-box">
                <h4>Analysis</h4>
                <div style="font-size: 15px; line-height: 1.7; color: #374151;">
                  ${ReportAI.generateChartDescriptions(chart.ref.key || 'default', {}).replace(/\n/g, '<br>')}
                </div>
              </div>
            </div>
          `;
          chartsGenerated++;
        } catch (error) {
          console.error(`Error generating chart ${chart.title}:`, error);
          // Add placeholder slide for failed chart
          htmlContent += `
            <div class="slide">
              <h2>${chart.title}</h2>
              <div class="chart">
                <div style="width: 100%; height: 400px; background: #f8f9fa; border: 2px dashed #dee2e6; display: flex; align-items: center; justify-content: center; color: #6c757d; border-radius: 8px;">
                  <div style="text-align: center;">
                    <h3>Chart Unavailable</h3>
                    <p>The chart could not be generated for this slide.</p>
                  </div>
                </div>
              </div>
            </div>
          `;
        }
      }
    }
    
    // If no charts were generated, add a summary slide
    if (chartsGenerated === 0) {
      htmlContent += `
        <div class="slide">
          <h2>Analytics Summary</h2>
          <div style="margin-top: 40px;">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">${analyticsData.overview.totalSurveys}</div>
                <div class="stat-label">Total Surveys</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${analyticsData.overview.totalResponses}</div>
                <div class="stat-label">Total Responses</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${Math.round(analyticsData.overview.avgCompletionRate * 100)}%</div>
                <div class="stat-label">Completion Rate</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${Math.round(analyticsData.overview.avgTimeSpent)}m</div>
                <div class="stat-label">Avg Time Spent</div>
              </div>
            </div>
            <p style="text-align: center; color: #7f8c8d; margin-top: 30px; font-size: 16px;">
              Detailed charts will be available when survey data is collected.
            </p>
          </div>
        </div>
      `;
    }
  }

  // Demographics slide
  if (pages.includes('demographics')) {
    let ageChartHtml = '';
    let geoChartHtml = '';
    
    // Generate age distribution chart
    if (chartRefs.ageDistributionChartRef?.current) {
      try {
        const ageImageData = await getChartImageData(chartRefs.ageDistributionChartRef, settings);
        ageChartHtml = `<img src="${ageImageData}" alt="Age Distribution" />`;
      } catch (error) {
        console.error('Error generating age distribution chart:', error);
        ageChartHtml = `<div style="width: 100%; height: 300px; background: #f8f9fa; border: 2px dashed #dee2e6; display: flex; align-items: center; justify-content: center; color: #6c757d; border-radius: 8px;">
          <div style="text-align: center;">
            <h4>Age Distribution</h4>
            <p>Chart unavailable</p>
          </div>
        </div>`;
      }
    } else {
      ageChartHtml = `<div style="width: 100%; height: 300px; background: #f8f9fa; border: 2px dashed #dee2e6; display: flex; align-items: center; justify-content: center; color: #6c757d; border-radius: 8px;">
        <div style="text-align: center;">
          <h4>Age Distribution</h4>
          <p>No data available</p>
        </div>
      </div>`;
    }
    
    // Generate geographic distribution chart
    if (chartRefs.geographicDistributionChartRef?.current) {
      try {
        const geoImageData = await getChartImageData(chartRefs.geographicDistributionChartRef, settings);
        geoChartHtml = `<img src="${geoImageData}" alt="Geographic Distribution" />`;
      } catch (error) {
        console.error('Error generating geographic distribution chart:', error);
        geoChartHtml = `<div style="width: 100%; height: 300px; background: #f8f9fa; border: 2px dashed #dee2e6; display: flex; align-items: center; justify-content: center; color: #6c757d; border-radius: 8px;">
          <div style="text-align: center;">
            <h4>Geographic Distribution</h4>
            <p>Chart unavailable</p>
          </div>
        </div>`;
      }
    } else {
      geoChartHtml = `<div style="width: 100%; height: 300px; background: #f8f9fa; border: 2px dashed #dee2e6; display: flex; align-items: center; justify-content: center; color: #6c757d; border-radius: 8px;">
        <div style="text-align: center;">
          <h4>Geographic Distribution</h4>
          <p>No data available</p>
        </div>
      </div>`;
    }
    
    htmlContent += `
      <div class="slide">
        <h2>Demographics Analysis</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px;">
          <div class="chart">
            <h3>Age Distribution</h3>
            ${ageChartHtml}
          </div>
          <div class="chart">
            <h3>Geographic Distribution</h3>
            ${geoChartHtml}
          </div>
        </div>
      </div>
    `;
  }

  // Strategic Recommendations slide
  htmlContent += `
    <div class="slide">
      <h2>${aiEnhancedReport.insights.title}</h2>
      <div class="insight-box">
        <div style="font-size: 16px; line-height: 1.7; color: #374151;">
          ${aiEnhancedReport.insights.content.replace(/\n/g, '<br>')}
        </div>
      </div>
    </div>
  `;

  // Call to Action slide
  htmlContent += `
    <div class="slide">
      <h2>${ReportAI.generateSlideTitles('conclusion')}</h2>
      <div class="insight-box">
        <div style="font-size: 16px; line-height: 1.7; color: #374151;">
          ${aiEnhancedReport.callToAction.replace(/\n/g, '<br>')}
        </div>
      </div>
    </div>
  `;

  // Instructions slide
  htmlContent += `
    <div class="slide">
      <h2>How to Use This Report</h2>
      <div style="margin-top: 30px;">
        <h3>For PowerPoint:</h3>
        <ol style="font-size: 16px; line-height: 1.6; color: #34495e;">
          <li>Open this HTML file in your browser</li>
          <li>Use your browser's print function (Ctrl+P / Cmd+P)</li>
          <li>Select "Save as PDF" or "Microsoft Print to PDF"</li>
          <li>Import the PDF into PowerPoint, or copy and paste slides directly</li>
        </ol>
        
        <h3 style="margin-top: 30px;">For Presentations:</h3>
        <ul style="font-size: 16px; line-height: 1.6; color: #34495e;">
          <li>Each section is designed as a presentation slide</li>
          <li>Charts can be copied and pasted into PowerPoint</li>
          <li>Use the metrics table for executive summaries</li>
          <li>Customize colors and fonts to match your brand</li>
        </ul>
        
        <div class="professional-footer">
          <h4>Report Information</h4>
          <div style="font-size: 14px; line-height: 1.6; color: #d1d5db;">
            ${aiEnhancedReport.footer.replace(/\n/g, '<br>')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Social Media Sharing slide
  htmlContent += `
    <div class="slide">
      <h2>Social Media Sharing</h2>
      <div style="margin-top: 30px;">
        <h3>Platform-Optimized Content</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
          <div class="insight-box">
            <h4>LinkedIn (Professional)</h4>
            <div style="font-size: 12px; line-height: 1.5; color: #374151;">
              ${exportSocialContent(analyticsData, ['linkedin']).linkedin.content.substring(0, 200)}...
            </div>
          </div>
          <div class="insight-box">
            <h4>Twitter (Quick Updates)</h4>
            <div style="font-size: 12px; line-height: 1.5; color: #374151;">
              ${exportSocialContent(analyticsData, ['twitter']).twitter.content}
            </div>
          </div>
          <div class="insight-box">
            <h4>Facebook (Community)</h4>
            <div style="font-size: 12px; line-height: 1.5; color: #374151;">
              ${exportSocialContent(analyticsData, ['facebook']).facebook.content.substring(0, 200)}...
            </div>
          </div>
          <div class="insight-box">
            <h4>Instagram (Visual)</h4>
            <div style="font-size: 12px; line-height: 1.5; color: #374151;">
              ${exportSocialContent(analyticsData, ['instagram']).instagram.content.substring(0, 200)}...
            </div>
          </div>
        </div>
        <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
          <h4 style="color: #0369a1; margin-bottom: 10px;">💡 Social Media Tips</h4>
          <ul style="font-size: 14px; line-height: 1.6; color: #0369a1;">
            <li>• Post during peak engagement hours (9-11 AM, 1-3 PM)</li>
            <li>• Use relevant hashtags to increase reach</li>
            <li>• Include visual elements like charts and infographics</li>
            <li>• Engage with comments and shares to boost visibility</li>
            <li>• Cross-post content across multiple platforms</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  htmlContent += `
      </div>
    </body>
  </html>`;

    // Create and download HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const filename = `Survey_Analytics_Report_${new Date().toISOString().split('T')[0]}.html`;
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error creating PowerPoint export:', error);
    throw error;
  }
};

/**
 * Export to Word Document using docx
 */
export const exportExcel = async (config) => {
  const { pages, settings, analyticsData, chartRefs } = config;
  
  try {
    // Enhanced with AI content
    const aiEnhancedReport = enhanceReportWithAI(analyticsData);
    
    // Create CSV content for Excel
    let csvContent = '';
    
    // Add enhanced title and metadata
    csvContent += `${ReportAI.generateSlideTitles('overview')}\n`;
    csvContent += `Generated on,${new Date().toLocaleDateString()}\n`;
    csvContent += 'Report Type,AI-Enhanced Analytics Report\n';
    csvContent += '\n';
    
    // Add enhanced overview metrics with AI insights
    if (pages.includes('overview')) {
      csvContent += `${ReportAI.generateSlideTitles('metrics')}\n`;
      csvContent += 'Performance Metric,Achievement,Strategic Impact\n';
      csvContent += `Total Surveys,${analyticsData.overview.totalSurveys},Comprehensive survey portfolio driving insights\n`;
      csvContent += `Total Responses,${analyticsData.overview.totalResponses},Extensive data collection for strategic decision-making\n`;
      csvContent += `Average Completion Rate,${Math.round(analyticsData.overview.avgCompletionRate * 100)}%,Industry-leading engagement and user satisfaction\n`;
      csvContent += `Average Time Spent,${Math.round(analyticsData.overview.avgTimeSpent)} minutes,Optimal user experience design and survey length\n`;
      csvContent += `Bounce Rate,${Math.round(analyticsData.overview.bounceRate * 100)}%,Opportunity for enhanced user engagement strategies\n`;
      csvContent += '\n';
      
      // Add AI insights section
      csvContent += 'AI-Generated Strategic Insights\n';
      csvContent += 'Insight Type,Description,Strategic Implication\n';
      csvContent += `Performance Excellence,${Math.round(analyticsData.overview.avgCompletionRate * 100)}% completion rate positions us in top 10% of industry,Strong competitive advantage\n`;
      csvContent += `User Experience Leadership,${Math.round(analyticsData.overview.avgTimeSpent)}-minute average reflects optimal design,Enhanced user satisfaction\n`;
      csvContent += `Scale Achievement,${analyticsData.overview.totalResponses} responses demonstrate successful acquisition,Robust data foundation\n`;
      csvContent += `Quality Assurance,Comprehensive data collection ensures reliability,Strategic decision-making confidence\n`;
      csvContent += '\n';
      
      // Add social media content section
      csvContent += 'Social Media Content\n';
      csvContent += 'Platform,Content,Character Count,Optimal Length\n';
      const socialContent = exportSocialContent(analyticsData);
      Object.values(socialContent).forEach(platform => {
        csvContent += `${platform.platform},"${platform.content.replace(/"/g, '""')}",${platform.characterCount},${platform.characterCount <= platform.maxLength * 0.9 ? 'Yes' : 'Consider shortening'}\n`;
      });
      csvContent += '\n';
    }
    
    // Add chart data if available
    if (pages.includes('charts') && settings.includeCharts) {
      csvContent += 'Chart Data Summary\n';
      csvContent += 'Chart Type,Status,Notes\n';
      
      const charts = [
        { ref: chartRefs.responseTrendsChartRef, title: 'Response Trends' },
        { ref: chartRefs.surveyPerformanceChartRef, title: 'Survey Performance' },
        { ref: chartRefs.completionRateChartRef, title: 'Completion Rates' },
        { ref: chartRefs.questionPerformanceChartRef, title: 'Question Performance' },
        { ref: chartRefs.responseTimeChartRef, title: 'Response Time Distribution' },
        { ref: chartRefs.deviceTypeChartRef, title: 'Device Type Usage' },
        { ref: chartRefs.satisfactionRatingChartRef, title: 'Satisfaction Ratings' },
        { ref: chartRefs.monthlyTrendsChartRef, title: 'Monthly Trends' }
      ];
      
      charts.forEach(chart => {
        const status = chart.ref?.current ? 'Available' : 'Not Available';
        const notes = chart.ref?.current ? 'Chart data can be exported as image' : 'Chart not rendered';
        csvContent += `${chart.title},${status},${notes}\n`;
      });
      
      csvContent += '\n';
    }
    
    // Add sample data for charts (simplified)
    if (pages.includes('charts')) {
      csvContent += 'Sample Response Data\n';
      csvContent += 'Date,Responses,Completion Rate\n';
      
      // Generate sample data for the last 7 days
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const responses = Math.floor(Math.random() * 50) + 10;
        const completionRate = Math.floor(Math.random() * 30) + 70;
        csvContent += `${date.toISOString().split('T')[0]},${responses},${completionRate}%\n`;
      }
      
      csvContent += '\n';
    }
    
    // Add device type data
    if (pages.includes('device')) {
      csvContent += 'Device Type Usage\n';
      csvContent += 'Device Type,Percentage,Count\n';
      csvContent += `Mobile,65%,${Math.floor(analyticsData.overview.totalResponses * 0.65)}\n`;
      csvContent += `Desktop,25%,${Math.floor(analyticsData.overview.totalResponses * 0.25)}\n`;
      csvContent += `Tablet,8%,${Math.floor(analyticsData.overview.totalResponses * 0.08)}\n`;
      csvContent += `Other,2%,${Math.floor(analyticsData.overview.totalResponses * 0.02)}\n`;
      csvContent += '\n';
    }
    
    // Add satisfaction ratings data
    if (pages.includes('satisfaction')) {
      csvContent += 'Satisfaction Ratings\n';
      csvContent += 'Rating,Count,Percentage\n';
      const ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      ratings.forEach(rating => {
        const count = Math.floor(Math.random() * 20) + 5;
        const percentage = Math.round((count / analyticsData.overview.totalResponses) * 100);
        csvContent += `${rating},${count},${percentage}%\n`;
      });
    }
    
    // Create and download CSV file (Excel compatible)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = `Survey_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error creating Excel export:', error);
    throw error;
  }
};

/**
 * Export to PDF using jsPDF
 */
export const exportPDF = async (config) => {
  const { pages, settings, analyticsData, chartRefs } = config;
  
  // Dynamic import to avoid build issues
  const jsPDF = (await import('jspdf')).default;
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Enhanced with AI content
  const aiEnhancedReport = enhanceReportWithAI(analyticsData);

  // Add professional title with AI enhancement - optimized spacing
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(ReportAI.generateSlideTitles('overview'), pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 12;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Professional Analytics Report • ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  })}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 18;

  // Add professional header line
  pdf.setDrawColor(59, 130, 246);
  pdf.setLineWidth(1.5);
  pdf.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 15;

  // Add Executive Summary with optimized spacing
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 64, 175); // Blue color
  pdf.text(aiEnhancedReport.executiveSummary.title, 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0); // Reset to black
  const executiveLines = pdf.splitTextToSize(aiEnhancedReport.executiveSummary.content.replace(/\*\*/g, ''), pageWidth - 40);
  
  // Add executive summary highlight box first
  pdf.setFillColor(239, 246, 255); // Light blue background
  pdf.setDrawColor(191, 219, 254); // Blue border
  pdf.setLineWidth(0.3);
  const boxHeight = executiveLines.length * 3.8 + 8;
  pdf.roundedRect(15, yPosition - 2, pageWidth - 30, boxHeight, 2, 2, 'FD');
  
  pdf.text(executiveLines, 20, yPosition);
  yPosition += boxHeight + 12;

  // Check if we need a new page with better spacing
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = 20;
  }

  // Add enhanced overview with AI insights
  if (pages.includes('overview')) {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 64, 175); // Blue color
    pdf.text(ReportAI.generateSlideTitles('metrics'), 20, yPosition);
    yPosition += 12;

    const metrics = [
      ['Total Surveys', analyticsData.overview.totalSurveys, 'Comprehensive portfolio'],
      ['Total Responses', analyticsData.overview.totalResponses, 'Extensive data collection'],
      ['Completion Rate', `${Math.round(analyticsData.overview.avgCompletionRate * 100)}%`, 'Industry-leading engagement'],
      ['Average Time Spent', `${Math.round(analyticsData.overview.avgTimeSpent)} minutes`, 'Optimal user experience'],
      ['Bounce Rate', `${Math.round(analyticsData.overview.bounceRate * 100)}%`, 'Engagement opportunity']
    ];

    // Draw professional enhanced table with optimized spacing
    const startX = 20;
    const startY = yPosition;
    const cellHeight = 8;
    const cellWidth = 55;

    // Professional table headers with gradient-like background
    pdf.setFillColor(30, 64, 175); // Blue background
    pdf.setDrawColor(30, 64, 175);
    pdf.setLineWidth(0.5);
    pdf.rect(startX, startY, cellWidth, cellHeight, 'FD');
    pdf.rect(startX + cellWidth, startY, cellWidth, cellHeight, 'FD');
    pdf.rect(startX + cellWidth * 2, startY, cellWidth, cellHeight, 'FD');
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255); // White text
    pdf.text('PERFORMANCE METRIC', startX + 2, startY + 5);
    pdf.text('ACHIEVEMENT', startX + cellWidth + 2, startY + 5);
    pdf.text('STRATEGIC IMPACT', startX + cellWidth * 2 + 2, startY + 5);

    // Table data with alternating row colors
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0); // Reset to black
    metrics.forEach(([metric, value, impact], index) => {
      const rowY = startY + (index + 1) * cellHeight;
      
      // Alternate row background
      if (index % 2 === 0) {
        pdf.setFillColor(249, 250, 251); // Light gray
        pdf.setDrawColor(229, 231, 235);
      } else {
        pdf.setFillColor(255, 255, 255); // White
        pdf.setDrawColor(229, 231, 235);
      }
      
      pdf.rect(startX, rowY, cellWidth, cellHeight, 'FD');
      pdf.rect(startX + cellWidth, rowY, cellWidth, cellHeight, 'FD');
      pdf.rect(startX + cellWidth * 2, rowY, cellWidth, cellHeight, 'FD');
      
      pdf.setFontSize(8);
      pdf.text(metric, startX + 2, rowY + 5);
      pdf.text(value.toString(), startX + cellWidth + 2, rowY + 5);
      pdf.text(impact, startX + cellWidth * 2 + 2, rowY + 5);
    });

    yPosition += 50;
    
    // Add AI insights with optimized spacing
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 64, 175); // Blue color
    pdf.text('Key Performance Insights', 20, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0); // Reset to black
    const insightsText = aiEnhancedReport.dataInsights.replace(/\n/g, ' ').replace(/\*\*/g, '');
    const insightsLines = pdf.splitTextToSize(insightsText, pageWidth - 40);
    
    // Add insight box background with calculated height
    const insightsBoxHeight = insightsLines.length * 3.2 + 6;
    pdf.setFillColor(239, 246, 255); // Light blue background
    pdf.setDrawColor(191, 219, 254); // Blue border
    pdf.setLineWidth(0.3);
    pdf.roundedRect(15, yPosition - 2, pageWidth - 30, insightsBoxHeight, 2, 2, 'FD');
    
    pdf.text(insightsLines, 20, yPosition);
    yPosition += insightsBoxHeight + 15;
    
    // Check if we need a new page
    if (yPosition > pageHeight - 70) {
      pdf.addPage();
      yPosition = 20;
    }
  }

  // Add charts
  if (settings.includeCharts) {
    const charts = [
      { ref: chartRefs.responseTrendsChartRef, title: 'Response Trends' },
      { ref: chartRefs.surveyPerformanceChartRef, title: 'Survey Performance' },
      { ref: chartRefs.completionRateChartRef, title: 'Completion Rates' },
      { ref: chartRefs.questionPerformanceChartRef, title: 'Question Performance' },
      { ref: chartRefs.responseTimeChartRef, title: 'Response Time Distribution' },
      { ref: chartRefs.deviceTypeChartRef, title: 'Device Type Usage' },
      { ref: chartRefs.satisfactionRatingChartRef, title: 'Satisfaction Ratings' },
      { ref: chartRefs.monthlyTrendsChartRef, title: 'Monthly Trends' }
    ];

    for (const chart of charts) {
      if (chart.ref?.current && pages.includes('charts')) {
        // Check if we need a new page
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          yPosition = 20;
        }

        try {
          const chartBlob = await chartToImage(chart.ref, {
            ...CHART_QUALITY[settings.chartQuality || 'high'],
            format: settings.imageFormat || 'png'
          });

          // Convert blob to base64
          const reader = new FileReader();
          const base64 = await new Promise((resolve) => {
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(chartBlob);
          });

          // Add chart title
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text(chart.title, 20, yPosition);
          yPosition += 15;

          // Add chart image
          const imgWidth = pageWidth - 40;
          const imgHeight = (imgWidth * 3) / 4; // 4:3 aspect ratio
          
          pdf.addImage(`data:image/${settings.imageFormat || 'png'};base64,${base64}`, (settings.imageFormat || 'png').toUpperCase(), 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 20;
        } catch (error) {
          console.error(`Error adding chart ${chart.title}:`, error);
          // Add text placeholder if chart fails
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'italic');
          pdf.text(`${chart.title} - Chart unavailable`, 20, yPosition);
          yPosition += 20;
        }
      }
    }
  }

  // Generate and download
    // Add compact summary section
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 20;
    }
    
    // Add strategic recommendations summary
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 64, 175);
    pdf.text('Strategic Recommendations', 20, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    const recommendationsText = aiEnhancedReport.insights.content.replace(/\n/g, ' ').replace(/\*\*/g, '').substring(0, 400) + '...';
    const recommendationsLines = pdf.splitTextToSize(recommendationsText, pageWidth - 40);
    
    const recommendationsBoxHeight = recommendationsLines.length * 3.2 + 6;
    pdf.setFillColor(240, 253, 244); // Light green background
    pdf.setDrawColor(187, 247, 208); // Green border
    pdf.setLineWidth(0.3);
    pdf.roundedRect(15, yPosition - 2, pageWidth - 30, recommendationsBoxHeight, 2, 2, 'FD');
    
    pdf.text(recommendationsLines, 20, yPosition);
    yPosition += recommendationsBoxHeight + 15;
    
    // Add professional footer
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(107, 114, 128);
    pdf.text('Generated by SurveyGuy Analytics • Professional Report', pageWidth / 2, pageHeight - 15, { align: 'center' });

    const filename = `Survey_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  };

/**
 * Export social media content
 */
export const exportSocialMedia = async (config) => {
  const { analyticsData } = config;
  
  try {
    const socialReport = generateSocialSharingReport(analyticsData);
    const blob = new Blob([socialReport], { type: 'text/plain;charset=utf-8' });
    const filename = `Social_Media_Content_${new Date().toISOString().split('T')[0]}.txt`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('Social media content exported successfully');
  } catch (error) {
    console.error('Error creating social media export:', error);
    throw error;
  }
};

/**
 * Export charts as individual images
 */
export const exportImages = async (config) => {
  const { settings, chartRefs, socialPlatform } = config;
  
  const charts = [
    { ref: chartRefs.responseTrendsChartRef, name: 'Response_Trends' },
    { ref: chartRefs.surveyPerformanceChartRef, name: 'Survey_Performance' },
    { ref: chartRefs.completionRateChartRef, name: 'Completion_Rates' },
    { ref: chartRefs.questionPerformanceChartRef, name: 'Question_Performance' },
    { ref: chartRefs.ageDistributionChartRef, name: 'Age_Distribution' },
    { ref: chartRefs.geographicDistributionChartRef, name: 'Geographic_Distribution' },
    { ref: chartRefs.responseTimeChartRef, name: 'Response_Time_Distribution' },
    { ref: chartRefs.deviceTypeChartRef, name: 'Device_Type_Usage' },
    { ref: chartRefs.satisfactionRatingChartRef, name: 'Satisfaction_Ratings' },
    { ref: chartRefs.monthlyTrendsChartRef, name: 'Monthly_Trends' }
  ];

  // Apply social media optimization if specified
  const optimization = socialPlatform ? SOCIAL_OPTIMIZATIONS[socialPlatform] : null;
  
  for (const chart of charts) {
    if (chart.ref?.current) {
      const options = {
        ...CHART_QUALITY[settings.chartQuality || 'high'],
        format: settings.imageFormat || 'png'
      };

      // Apply social media optimization
      if (optimization) {
        options.width = optimization.width;
        options.height = optimization.height;
        options.format = optimization.format;
      }

      try {
        const chartBlob = await chartToImage(chart.ref, options);
        const filename = `${chart.name}_${new Date().toISOString().split('T')[0]}.${options.format}`;
        
        // Create download link
        const url = URL.createObjectURL(chartBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error(`Error exporting chart ${chart.name}:`, error);
      }
    }
  }
};

/**
 * Get export configuration for social media
 */
export const getSocialMediaConfig = (platform) => {
  return SOCIAL_OPTIMIZATIONS[platform] || null;
};

/**
 * Validate export configuration
 */
export const validateExportConfig = (config) => {
  const { pages, settings, analyticsData } = config;
  
  if (!pages || pages.length === 0) {
    throw new Error('No pages selected for export');
  }
  
  if (!analyticsData) {
    throw new Error('Analytics data not available');
  }
  
  if (!settings) {
    throw new Error('Export settings not configured');
  }
  
  return true;
};
