/**
 * Social Media Sharing Utilities for Reports
 */

import { 
  FaLinkedin, 
  FaTwitter, 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp 
} from 'react-icons/fa';

// Social media platform configurations
export const SOCIAL_PLATFORMS = {
  linkedin: {
    name: 'LinkedIn',
    icon: FaLinkedin,
    color: '#0077B5',
    url: 'https://www.linkedin.com/sharing/share-offsite/',
    maxLength: 1300,
    hashtags: ['#SurveyAnalytics', '#DataInsights', '#BusinessIntelligence', '#SurveyGuy'],
    optimalImageSize: { width: 1200, height: 627 }
  },
  twitter: {
    name: 'Twitter',
    icon: FaTwitter,
    color: '#1DA1F2',
    url: 'https://twitter.com/intent/tweet',
    maxLength: 280,
    hashtags: ['#SurveyAnalytics', '#DataInsights', '#SurveyGuy'],
    optimalImageSize: { width: 1200, height: 675 }
  },
  facebook: {
    name: 'Facebook',
    icon: FaFacebook,
    color: '#4267B2',
    url: 'https://www.facebook.com/sharer/sharer.php',
    maxLength: 63206,
    hashtags: ['#SurveyAnalytics', '#DataInsights', '#SurveyGuy'],
    optimalImageSize: { width: 1200, height: 630 }
  },
  instagram: {
    name: 'Instagram',
    icon: FaInstagram,
    color: '#E4405F',
    url: 'https://www.instagram.com/',
    maxLength: 2200,
    hashtags: ['#SurveyAnalytics', '#DataInsights', '#BusinessIntelligence', '#SurveyGuy', '#Analytics'],
    optimalImageSize: { width: 1080, height: 1080 }
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: FaWhatsapp,
    color: '#25D366',
    url: 'https://wa.me/',
    maxLength: 4096,
    hashtags: ['#SurveyAnalytics', '#DataInsights', '#SurveyGuy'],
    optimalImageSize: { width: 800, height: 800 }
  }
};

// Generate platform-specific content
export const generateSocialContent = (analyticsData, platform, options = {}) => {
  const { overview } = analyticsData;
  const platformConfig = SOCIAL_PLATFORMS[platform];
  
  if (!platformConfig) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  const completionRate = Math.round(overview.avgCompletionRate * 100);
  const totalResponses = overview.totalResponses;
  const totalSurveys = overview.totalSurveys;
  
  const baseContent = {
    linkedin: `📊 Survey Analytics Excellence: Our latest report shows ${completionRate}% completion rates across ${totalSurveys} surveys!

Key insights:
✅ ${totalResponses} valuable responses collected
✅ ${Math.round(overview.avgTimeSpent)}-minute optimal completion time
✅ Industry-leading user engagement metrics

Data-driven insights are transforming how we understand user behavior and optimize experiences. ${platformConfig.hashtags.join(' ')}`,
    
    twitter: `📊 Survey Analytics Update: ${completionRate}% completion rate achieved!

${totalResponses} responses across ${totalSurveys} surveys
${Math.round(overview.avgTimeSpent)}min avg completion time

${platformConfig.hashtags.join(' ')}`,
    
    facebook: `📈 Exciting Survey Analytics Results!

We're proud to share our latest performance metrics:
• ${completionRate}% completion rate
• ${totalResponses} total responses
• ${totalSurveys} active surveys

These results demonstrate our commitment to creating engaging, valuable user experiences. Thank you to all participants who helped us gather these insights! ${platformConfig.hashtags.join(' ')}`,
    
    instagram: `📊 Survey Analytics Excellence! 

Our latest performance metrics:
✨ ${completionRate}% completion rate
✨ ${totalResponses} responses collected
✨ ${totalSurveys} active surveys

Data-driven insights powering better user experiences! 

${platformConfig.hashtags.join(' ')}`,
    
    whatsapp: `📊 Survey Analytics Report Update:

🎯 ${completionRate}% completion rate
📈 ${totalResponses} responses across ${totalSurveys} surveys
⏱️ ${Math.round(overview.avgTimeSpent)}-minute average completion time

These metrics show excellent user engagement and survey effectiveness!

${platformConfig.hashtags.join(' ')}`
  };

  return baseContent[platform] || baseContent.linkedin;
};

// Generate share URLs for different platforms
export const generateShareUrl = (platform, content, url = '', options = {}) => {
  const platformConfig = SOCIAL_PLATFORMS[platform];
  const encodedContent = encodeURIComponent(content);
  const encodedUrl = encodeURIComponent(url);
  
  switch (platform) {
    case 'linkedin':
      return `${platformConfig.url}?url=${encodedUrl}&summary=${encodedContent}`;
    
    case 'twitter':
      return `${platformConfig.url}?text=${encodedContent}${url ? `&url=${encodedUrl}` : ''}`;
    
    case 'facebook':
      return `${platformConfig.url}?u=${encodedUrl}&quote=${encodedContent}`;
    
    case 'instagram':
      // Instagram doesn't support direct URL sharing, return content for manual posting
      return {
        content: content,
        note: 'Copy this content to your Instagram post',
        url: 'https://www.instagram.com/'
      };
    
    case 'whatsapp':
      return `${platformConfig.url}?text=${encodedContent}${url ? ` ${encodedUrl}` : ''}`;
    
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
};

// Generate chart images for social media
export const generateSocialMediaImage = async (chartRef, platform, analyticsData) => {
  try {
    const platformConfig = SOCIAL_PLATFORMS[platform];
    const { width, height } = platformConfig.optimalImageSize;
    
    // Convert chart to high-quality image
    const canvas = chartRef.current;
    if (!canvas) {
      throw new Error('Chart canvas not found');
    }
    
    // Create a new canvas with social media dimensions
    const socialCanvas = document.createElement('canvas');
    socialCanvas.width = width;
    socialCanvas.height = height;
    const ctx = socialCanvas.getContext('2d');
    
    // Add background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add branding
    ctx.fillStyle = platformConfig.color;
    ctx.font = 'bold 32px Inter, sans-serif';
    ctx.fillText('SurveyGuy Analytics', 40, 60);
    
    // Add chart title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 48px Inter, sans-serif';
    ctx.fillText('Survey Performance Report', 40, 120);
    
    // Add key metrics
    const { overview } = analyticsData;
    ctx.fillStyle = '#374151';
    ctx.font = '24px Inter, sans-serif';
    ctx.fillText(`Completion Rate: ${Math.round(overview.avgCompletionRate * 100)}%`, 40, 180);
    ctx.fillText(`Total Responses: ${overview.totalResponses}`, 40, 220);
    ctx.fillText(`Average Time: ${Math.round(overview.avgTimeSpent)} minutes`, 40, 260);
    
    // Add chart image (resized)
    const chartImage = new Image();
    const chartDataUrl = canvas.toDataURL('image/png', 1.0);
    
    return new Promise((resolve) => {
      chartImage.onload = () => {
        // Calculate chart position and size
        const chartWidth = width - 80;
        const chartHeight = height - 350;
        const chartX = 40;
        const chartY = 300;
        
        // Draw chart with rounded corners
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(chartX, chartY, chartWidth, chartHeight, 16);
        ctx.clip();
        ctx.drawImage(chartImage, chartX, chartY, chartWidth, chartHeight);
        ctx.restore();
        
        // Add footer
        ctx.fillStyle = '#6b7280';
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText('Generated by SurveyGuy • Professional Analytics', 40, height - 40);
        
        resolve(socialCanvas.toDataURL('image/png', 0.9));
      };
      chartImage.src = chartDataUrl;
    });
    
  } catch (error) {
    console.error('Error generating social media image:', error);
    return null;
  }
};

// Share to social media platforms
export const shareToSocialMedia = async (platform, analyticsData, options = {}) => {
  try {
    const content = generateSocialContent(analyticsData, platform, options);
    const shareUrl = generateShareUrl(platform, content, options.url, options);
    
    if (platform === 'instagram') {
      // For Instagram, show modal with content to copy
      return {
        type: 'modal',
        content: shareUrl.content,
        note: shareUrl.note,
        url: shareUrl.url
      };
    } else {
      // Open sharing window for other platforms
      const windowFeatures = 'width=600,height=400,scrollbars=yes,resizable=yes';
      window.open(shareUrl, '_blank', windowFeatures);
      
      return {
        type: 'opened',
        platform: platform,
        success: true
      };
    }
    
  } catch (error) {
    console.error(`Error sharing to ${platform}:`, error);
    return {
      type: 'error',
      platform: platform,
      error: error.message
    };
  }
};

// Generate social media preview cards
export const generateSocialPreview = (analyticsData, platform) => {
  const platformConfig = SOCIAL_PLATFORMS[platform];
  const content = generateSocialContent(analyticsData, platform);
  
  return {
    platform: platformConfig.name,
    icon: platformConfig.icon,
    color: platformConfig.color,
    content: content,
    characterCount: content.length,
    maxLength: platformConfig.maxLength,
    isOptimal: content.length <= platformConfig.maxLength * 0.9
  };
};

// Bulk share to multiple platforms
export const shareToMultiplePlatforms = async (platforms, analyticsData, options = {}) => {
  const results = [];
  
  for (const platform of platforms) {
    try {
      const result = await shareToSocialMedia(platform, analyticsData, options);
      results.push({
        platform,
        ...result
      });
    } catch (error) {
      results.push({
        platform,
        type: 'error',
        error: error.message
      });
    }
  }
  
  return results;
};

// Export social media content for manual sharing
export const exportSocialContent = (analyticsData, platforms = ['linkedin', 'twitter', 'facebook', 'instagram', 'whatsapp']) => {
  const content = {};
  
  platforms.forEach(platform => {
    try {
      content[platform] = {
        platform: SOCIAL_PLATFORMS[platform].name,
        content: generateSocialContent(analyticsData, platform),
        hashtags: SOCIAL_PLATFORMS[platform].hashtags,
        maxLength: SOCIAL_PLATFORMS[platform].maxLength,
        characterCount: generateSocialContent(analyticsData, platform).length
      };
    } catch (error) {
      console.error(`Error generating content for ${platform}:`, error);
    }
  });
  
  return content;
};

// Generate social media sharing report
export const generateSocialSharingReport = (analyticsData) => {
  const platforms = Object.keys(SOCIAL_PLATFORMS);
  const content = exportSocialContent(analyticsData, platforms);
  
  let report = `# Social Media Sharing Report\n\n`;
  report += `Generated: ${new Date().toLocaleDateString()}\n\n`;
  report += `## Platform-Specific Content\n\n`;
  
  platforms.forEach(platform => {
    const platformData = content[platform];
    if (platformData) {
      report += `### ${platformData.platform}\n\n`;
      report += `**Content:**\n${platformData.content}\n\n`;
      report += `**Character Count:** ${platformData.characterCount}/${platformData.maxLength}\n`;
      report += `**Optimal Length:** ${platformData.characterCount <= platformData.maxLength * 0.9 ? '✅ Yes' : '⚠️ Consider shortening'}\n\n`;
      report += `**Hashtags:** ${platformData.hashtags.join(' ')}\n\n`;
      report += `---\n\n`;
    }
  });
  
  return report;
};
