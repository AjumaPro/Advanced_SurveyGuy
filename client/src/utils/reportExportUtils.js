import PptxGenJS from 'pptxgenjs';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export utilities for generating reports in multiple formats
 */

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
 * Export to PowerPoint
 */
export const exportPowerPoint = async (config) => {
  const { pages, settings, analyticsData, filteredSurveys, chartRefs, socialPlatform } = config;
  
  const pptx = new PptxGenJS();
  
  // Set presentation properties
  pptx.author = 'SurveyGuy Analytics';
  pptx.company = 'SurveyGuy';
  pptx.title = 'Survey Analytics Report';
  pptx.subject = 'Comprehensive survey performance analysis';

  // Add title slide
  const titleSlide = pptx.addSlide();
  titleSlide.addText('Survey Analytics Report', {
    x: 1,
    y: 1,
    w: 8,
    h: 1,
    fontSize: 32,
    bold: true,
    color: '363636',
    align: 'center'
  });
  
  titleSlide.addText(`Generated on ${new Date().toLocaleDateString()}`, {
    x: 1,
    y: 2,
    w: 8,
    h: 0.5,
    fontSize: 16,
    color: '666666',
    align: 'center'
  });

  // Add overview slide if selected
  if (pages.includes('overview')) {
    const overviewSlide = pptx.addSlide();
    overviewSlide.addText('Key Metrics Overview', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: '363636'
    });

    // Add key metrics table
    const metricsData = [
      ['Metric', 'Value'],
      ['Total Surveys', analyticsData.overview.totalSurveys.toString()],
      ['Total Responses', analyticsData.overview.totalResponses.toString()],
      ['Average Completion Rate', `${Math.round(analyticsData.overview.avgCompletionRate * 100)}%`],
      ['Average Time Spent', `${Math.round(analyticsData.overview.avgTimeSpent)} minutes`],
      ['Bounce Rate', `${Math.round(analyticsData.overview.bounceRate * 100)}%`]
    ];

    overviewSlide.addTable(metricsData, {
      x: 1,
      y: 1.5,
      w: 8,
      h: 3,
      fontSize: 14,
      border: { type: 'solid', color: 'CCCCCC', pt: 1 },
      fill: { color: 'F8F9FA' }
    });
  }

  // Add chart slides
  if (pages.includes('charts') && settings.includeCharts) {
    const chartSlides = await addChartSlides(pptx, chartRefs, settings);
  }

  // Add demographics slide
  if (pages.includes('demographics')) {
    const demoSlide = pptx.addSlide();
    demoSlide.addText('Demographics Analysis', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: '363636'
    });

    // Add age distribution if available
    if (chartRefs.ageDistributionChartRef?.current) {
      const ageChartBlob = await chartToImage(chartRefs.ageDistributionChartRef, {
        ...CHART_QUALITY[settings.chartQuality],
        format: settings.imageFormat
      });
      
      demoSlide.addImage({
        data: ageChartBlob,
        x: 0.5,
        y: 1.5,
        w: 4,
        h: 3
      });
    }

    // Add geographic distribution if available
    if (chartRefs.geographicDistributionChartRef?.current) {
      const geoChartBlob = await chartToImage(chartRefs.geographicDistributionChartRef, {
        ...CHART_QUALITY[settings.chartQuality],
        format: settings.imageFormat
      });
      
      demoSlide.addImage({
        data: geoChartBlob,
        x: 5,
        y: 1.5,
        w: 4,
        h: 3
      });
    }
  }

  // Add performance metrics slide
  if (pages.includes('performance')) {
    const perfSlide = pptx.addSlide();
    perfSlide.addText('Performance Metrics', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: '363636'
    });

    // Add response time chart
    if (chartRefs.responseTimeChartRef?.current) {
      const timeChartBlob = await chartToImage(chartRefs.responseTimeChartRef, {
        ...CHART_QUALITY[settings.chartQuality],
        format: settings.imageFormat
      });
      
      perfSlide.addImage({
        data: timeChartBlob,
        x: 0.5,
        y: 1.5,
        w: 4,
        h: 3
      });
    }

    // Add satisfaction ratings chart
    if (chartRefs.satisfactionRatingChartRef?.current) {
      const satChartBlob = await chartToImage(chartRefs.satisfactionRatingChartRef, {
        ...CHART_QUALITY[settings.chartQuality],
        format: settings.imageFormat
      });
      
      perfSlide.addImage({
        data: satChartBlob,
        x: 5,
        y: 1.5,
        w: 4,
        h: 3
      });
    }
  }

  // Add trends slide
  if (pages.includes('trends')) {
    const trendsSlide = pptx.addSlide();
    trendsSlide.addText('Trend Analysis', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: '363636'
    });

    // Add monthly trends chart
    if (chartRefs.monthlyTrendsChartRef?.current) {
      const trendsChartBlob = await chartToImage(chartRefs.monthlyTrendsChartRef, {
        ...CHART_QUALITY[settings.chartQuality],
        format: settings.imageFormat
      });
      
      trendsSlide.addImage({
        data: trendsChartBlob,
        x: 0.5,
        y: 1.5,
        w: 8,
        h: 4
      });
    }
  }

  // Add device analytics slide
  if (pages.includes('device')) {
    const deviceSlide = pptx.addSlide();
    deviceSlide.addText('Device Analytics', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: '363636'
    });

    // Add device type chart
    if (chartRefs.deviceTypeChartRef?.current) {
      const deviceChartBlob = await chartToImage(chartRefs.deviceTypeChartRef, {
        ...CHART_QUALITY[settings.chartQuality],
        format: settings.imageFormat
      });
      
      deviceSlide.addImage({
        data: deviceChartBlob,
        x: 2,
        y: 1.5,
        w: 6,
        h: 4
      });
    }
  }

  // Generate and download
  const filename = `Survey_Analytics_Report_${new Date().toISOString().split('T')[0]}.pptx`;
  await pptx.writeFile({ fileName: filename });
};

/**
 * Add chart slides to PowerPoint
 */
const addChartSlides = async (pptx, chartRefs, settings) => {
  const charts = [
    { ref: chartRefs.responseTrendsChartRef, title: 'Response Trends' },
    { ref: chartRefs.surveyPerformanceChartRef, title: 'Survey Performance' },
    { ref: chartRefs.completionRateChartRef, title: 'Completion Rates' },
    { ref: chartRefs.questionPerformanceChartRef, title: 'Question Performance' }
  ];

  for (const chart of charts) {
    if (chart.ref?.current) {
      const chartSlide = pptx.addSlide();
      chartSlide.addText(chart.title, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 0.5,
        fontSize: 24,
        bold: true,
        color: '363636'
      });

      const chartBlob = await chartToImage(chart.ref, {
        ...CHART_QUALITY[settings.chartQuality],
        format: settings.imageFormat
      });

      chartSlide.addImage({
        data: chartBlob,
        x: 0.5,
        y: 1.5,
        w: 8,
        h: 4
      });
    }
  }
};

/**
 * Export to Word Document (HTML-based)
 */
export const exportWord = async (config) => {
  const { pages, settings, analyticsData, filteredSurveys, chartRefs } = config;
  
  // Create HTML content for Word export
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Survey Analytics Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; text-align: center; }
        h2 { color: #666; border-bottom: 2px solid #ddd; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .chart { margin: 20px 0; text-align: center; }
        img { max-width: 100%; height: auto; }
      </style>
    </head>
    <body>
      <h1>Survey Analytics Report</h1>
      <p style="text-align: center; color: #666;">Generated on ${new Date().toLocaleDateString()}</p>
  `;

  // Add overview section
  if (pages.includes('overview')) {
    htmlContent += `
      <h2>Key Metrics Overview</h2>
      <table>
        <tr><th>Metric</th><th>Value</th></tr>
        <tr><td>Total Surveys</td><td>${analyticsData.overview.totalSurveys}</td></tr>
        <tr><td>Total Responses</td><td>${analyticsData.overview.totalResponses}</td></tr>
        <tr><td>Average Completion Rate</td><td>${Math.round(analyticsData.overview.avgCompletionRate * 100)}%</td></tr>
        <tr><td>Average Time Spent</td><td>${Math.round(analyticsData.overview.avgTimeSpent)} minutes</td></tr>
        <tr><td>Bounce Rate</td><td>${Math.round(analyticsData.overview.bounceRate * 100)}%</td></tr>
      </table>
    `;
  }

  // Add charts as images
  if (settings.includeCharts) {
    await addChartsToHTML(htmlContent, chartRefs, settings);
  }

  htmlContent += `
    </body>
    </html>
  `;

  // Create and download HTML file
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const filename = `Survey_Analytics_Report_${new Date().toISOString().split('T')[0]}.html`;
  saveAs(blob, filename);
};

/**
 * Add charts to HTML content
 */
const addChartsToHTML = async (htmlContent, chartRefs, settings) => {
  const charts = [
    { ref: chartRefs.responseTrendsChartRef, title: 'Response Trends' },
    { ref: chartRefs.surveyPerformanceChartRef, title: 'Survey Performance' },
    { ref: chartRefs.completionRateChartRef, title: 'Completion Rates' }
  ];

  for (const chart of charts) {
    if (chart.ref?.current) {
      const chartBlob = await chartToImage(chart.ref, {
        ...CHART_QUALITY[settings.chartQuality],
        format: settings.imageFormat
      });

      const reader = new FileReader();
      reader.onload = () => {
        htmlContent += `
          <div class="chart">
            <h3>${chart.title}</h3>
            <img src="${reader.result}" alt="${chart.title}" />
          </div>
        `;
      };
      reader.readAsDataURL(chartBlob);
    }
  }
};

/**
 * Export to PDF
 */
export const exportPDF = async (config) => {
  const { pages, settings, analyticsData, filteredSurveys, chartRefs, socialPlatform } = config;
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Add title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Survey Analytics Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Add overview
  if (pages.includes('overview')) {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Key Metrics Overview', 20, yPosition);
    yPosition += 10;

    const metrics = [
      ['Total Surveys', analyticsData.overview.totalSurveys],
      ['Total Responses', analyticsData.overview.totalResponses],
      ['Average Completion Rate', `${Math.round(analyticsData.overview.avgCompletionRate * 100)}%`],
      ['Average Time Spent', `${Math.round(analyticsData.overview.avgTimeSpent)} minutes`]
    ];

    metrics.forEach(([metric, value]) => {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${metric}: ${value}`, 30, yPosition);
      yPosition += 7;
    });
    yPosition += 10;
  }

  // Add charts
  if (settings.includeCharts) {
    await addChartsToPDF(pdf, chartRefs, settings, pageWidth, pageHeight);
  }

  // Generate and download
  const filename = `Survey_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
};

/**
 * Add charts to PDF
 */
const addChartsToPDF = async (pdf, chartRefs, settings, pageWidth, pageHeight) => {
  const charts = [
    { ref: chartRefs.responseTrendsChartRef, title: 'Response Trends' },
    { ref: chartRefs.surveyPerformanceChartRef, title: 'Survey Performance' },
    { ref: chartRefs.completionRateChartRef, title: 'Completion Rates' }
  ];

  for (const chart of charts) {
    if (chart.ref?.current) {
      // Check if we need a new page
      if (pdf.internal.getCurrentPageInfo().pageNumber > 1) {
        pdf.addPage();
      }

      const chartBlob = await chartToImage(chart.ref, {
        ...CHART_QUALITY[settings.chartQuality],
        format: settings.imageFormat
      });

      const url = URL.createObjectURL(chartBlob);
      const img = new Image();
      
      await new Promise((resolve) => {
        img.onload = () => {
          const imgWidth = 170; // mm
          const imgHeight = (img.height * imgWidth) / img.width;
          
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text(chart.title, 20, 30);
          
          pdf.addImage(url, 'PNG', 20, 40, imgWidth, imgHeight);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.src = url;
      });
    }
  }
};

/**
 * Export charts as individual images
 */
export const exportImages = async (config) => {
  const { pages, settings, chartRefs, socialPlatform } = config;
  
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
        ...CHART_QUALITY[settings.chartQuality],
        format: settings.imageFormat
      };

      // Apply social media optimization
      if (optimization) {
        options.width = optimization.width;
        options.height = optimization.height;
        options.format = optimization.format;
      }

      const chartBlob = await chartToImage(chart.ref, options);
      const filename = `${chart.name}_${new Date().toISOString().split('T')[0]}.${options.format}`;
      saveAs(chartBlob, filename);
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
