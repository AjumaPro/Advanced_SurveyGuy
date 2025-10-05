/**
 * Browser-compatible PowerPoint export
 * Creates HTML-based presentations that can be converted to PowerPoint
 */

import { enhanceReportWithAI, ReportAI } from './reportAI';
import { generateSocialContent } from './socialMediaShare';

/**
 * Convert chart canvas to base64 image
 */
const chartToBase64 = async (chartRef, options = {}) => {
  if (!chartRef || !chartRef.current) {
    return null;
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

  return newCanvas.toDataURL(`image/${format}`, quality);
};

/**
 * Create professional PowerPoint-ready HTML presentation
 */
export const exportPowerPointBrowser = async (config) => {
  const { pages = ['overview'], settings = {}, analyticsData = {}, chartRefs = {} } = config;
  
  try {
    // Generate chart images
    const chartImages = {};
    for (const [chartName, chartRef] of Object.entries(chartRefs)) {
      try {
        const imageData = await chartToBase64(chartRef, { 
          scale: 2, 
          quality: 1.0, 
          format: 'png' 
        });
        if (imageData) {
          chartImages[chartName] = imageData;
        }
      } catch (error) {
        console.warn(`Failed to generate image for chart ${chartName}:`, error);
      }
    }

    // Create HTML presentation
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Survey Analytics Report - PowerPoint Ready</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f8fafc;
            color: #0f172a;
            line-height: 1.6;
        }
        
        .presentation {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .slide {
            background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
            margin: 40px 0;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 
                0 20px 40px rgba(0,0,0,0.1),
                0 8px 16px rgba(0,0,0,0.06);
            border: 1px solid rgba(226, 232, 240, 0.8);
            page-break-after: always;
            min-height: 750px;
            position: relative;
        }
        
        .slide:last-child {
            page-break-after: avoid;
        }
        
        .slide::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 25%, #7c3aed 50%, #ec4899 75%, #f59e0b 100%);
            border-radius: 20px 20px 0 0;
        }
        
        h1 {
            font-family: 'Playfair Display', serif;
            color: #0f172a;
            text-align: center;
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
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
        
        .chart-container {
            margin: 40px 0;
            text-align: center;
            background: white;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.06);
            border: 1px solid #e5e7eb;
        }
        
        .chart-image {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 24px;
            margin: 40px 0;
        }
        
        .metric-card {
            background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
            padding: 40px 28px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 12px 24px rgba(0,0,0,0.08);
            border: 1px solid rgba(226, 232, 240, 0.6);
        }
        
        .metric-value {
            font-size: 36px;
            font-weight: 700;
            color: #3b82f6;
            margin-bottom: 8px;
        }
        
        .metric-label {
            font-size: 16px;
            color: #64748b;
            font-weight: 500;
        }
        
        .content-text {
            font-size: 16px;
            line-height: 1.8;
            color: #374151;
            margin-bottom: 24px;
        }
        
        .logo-placeholder {
            width: 200px;
            height: 80px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            border-radius: 12px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 18px;
        }
        
        .social-content {
            background: #f8fafc;
            padding: 24px;
            border-radius: 12px;
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
        }
        
        .social-platform {
            font-weight: 600;
            color: #3b82f6;
            margin-bottom: 12px;
        }
        
        .social-text {
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
        }
        
        @media print {
            body {
                background: white;
            }
            
            .slide {
                margin: 0;
                box-shadow: none;
                border: 1px solid #e5e7eb;
            }
        }
    </style>
</head>
<body>
    <div class="presentation">
        <!-- Title Slide -->
        <div class="slide">
            <div class="logo-placeholder">SurveyGuy</div>
            <h1>Survey Analytics Report</h1>
            <div style="text-align: center; margin-top: 60px;">
                <p style="font-size: 24px; color: #1d4ed8; margin-bottom: 20px;">
                    ${new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </p>
                <p style="font-size: 18px; color: #3b82f6; font-style: italic;">
                    Powered by SurveyGuy Analytics Platform
                </p>
            </div>
        </div>

        ${pages.includes('overview') ? `
        <!-- Executive Summary Slide -->
        <div class="slide">
            <h2>Executive Summary</h2>
            <div class="content-text">
                ${ReportAI.generateExecutiveSummary(analyticsData)}
            </div>
            
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${analyticsData.totalResponses || 0}</div>
                    <div class="metric-label">Total Responses</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${analyticsData.completionRate || 0}%</div>
                    <div class="metric-label">Completion Rate</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${analyticsData.avgTime || 0} min</div>
                    <div class="metric-label">Average Time</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${analyticsData.satisfaction || 0}/5</div>
                    <div class="metric-label">Satisfaction Score</div>
                </div>
            </div>
        </div>
        ` : ''}

        ${Object.keys(chartImages).map(chartName => `
        <!-- ${chartName} Chart Slide -->
        <div class="slide">
            <h2>${chartName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}</h2>
            <div class="chart-container">
                <img src="${chartImages[chartName]}" alt="${chartName}" class="chart-image" />
            </div>
            <div class="content-text">
                ${ReportAI.generateChartDescriptions([chartName], analyticsData)[chartName] || 
                  `This chart shows ${chartName.toLowerCase().replace(/([A-Z])/g, ' $1')} data from your survey responses.`}
            </div>
        </div>
        `).join('')}

        ${pages.includes('demographics') ? `
        <!-- Demographics Slide -->
        <div class="slide">
            <h2>Demographics Overview</h2>
            <div class="content-text">
                Here's a breakdown of the demographic data collected from your survey responses:
            </div>
            ${Object.entries(analyticsData.demographics || {}).map(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    return `
                    <h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                    <div class="metrics-grid">
                        ${Object.entries(value).map(([subKey, count]) => {
                            const percentage = analyticsData.totalResponses ? 
                                ((count / analyticsData.totalResponses) * 100).toFixed(1) : '0.0';
                            return `
                            <div class="metric-card">
                                <div class="metric-value">${count}</div>
                                <div class="metric-label">${subKey} (${percentage}%)</div>
                            </div>
                            `;
                        }).join('')}
                    </div>
                    `;
                }
                return '';
            }).join('')}
        </div>
        ` : ''}

        ${pages.includes('insights') ? `
        <!-- Insights and Recommendations Slide -->
        <div class="slide">
            <h2>Key Insights & Recommendations</h2>
            <div class="content-text">
                ${ReportAI.generateInsightsAndRecommendations(analyticsData)}
            </div>
        </div>
        ` : ''}

        ${pages.includes('social') ? `
        <!-- Social Media Content Slide -->
        <div class="slide">
            <h2>Social Media Sharing Content</h2>
            <div class="content-text">
                Here's optimized content for sharing your survey results on social media platforms:
            </div>
            
            ${(() => {
                const socialContent = generateSocialContent(analyticsData);
                return `
                <div class="social-content">
                    <div class="social-platform">LinkedIn Post:</div>
                    <div class="social-text">${socialContent.linkedin.post}</div>
                </div>
                
                <div class="social-content">
                    <div class="social-platform">Twitter Post:</div>
                    <div class="social-text">${socialContent.twitter.post}</div>
                </div>
                
                <div class="social-content">
                    <div class="social-platform">Facebook Post:</div>
                    <div class="social-text">${socialContent.facebook.post}</div>
                </div>
                `;
            })()}
        </div>
        ` : ''}

        <!-- Thank You Slide -->
        <div class="slide">
            <h1 style="margin-top: 200px;">Thank You</h1>
            <h2 style="text-align: center; margin-top: 60px; border: none;">For Your Attention</h2>
            <p style="text-align: center; font-size: 18px; color: #3b82f6; font-style: italic; margin-top: 40px;">
                SurveyGuy Analytics Platform
            </p>
        </div>
    </div>
</body>
</html>`;

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Survey_Analytics_Report_${timestamp}.html`;

    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return {
      success: true,
      filename,
      message: 'PowerPoint-ready HTML presentation exported successfully! You can open this in PowerPoint or any presentation software.'
    };

  } catch (error) {
    console.error('Browser PowerPoint export error:', error);
    throw new Error(`PowerPoint export failed: ${error.message}`);
  }
};

/**
 * Enhanced browser PowerPoint export with AI content
 */
export const exportPowerPointBrowserEnhanced = async (config) => {
  try {
    // Enhance analytics data with AI
    const enhancedData = await enhanceReportWithAI(config.analyticsData);
    
    // Export with enhanced data
    return await exportPowerPointBrowser({
      ...config,
      analyticsData: enhancedData
    });
  } catch (error) {
    console.error('Enhanced browser PowerPoint export error:', error);
    // Fallback to basic export
    return await exportPowerPointBrowser(config);
  }
};
