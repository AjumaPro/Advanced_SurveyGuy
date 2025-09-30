// Survey Utility Functions
export const surveyUtils = {
  // Generate unique IDs
  generateId: () => {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Validate survey data
  validateSurvey: (survey) => {
    const errors = [];
    
    if (!survey.title || survey.title.trim().length === 0) {
      errors.push('Survey title is required');
    }
    
    if (!survey.questions || survey.questions.length === 0) {
      errors.push('At least one question is required');
    }
    
    survey.questions?.forEach((question, index) => {
      if (!question.title || question.title.trim().length === 0) {
        errors.push(`Question ${index + 1} title is required`);
      }
      
      if (question.type === 'multiple_choice' && (!question.options || question.options.length < 2)) {
        errors.push(`Question ${index + 1} needs at least 2 options`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Calculate survey completion time
  calculateCompletionTime: (responses) => {
    if (!responses || responses.length === 0) return 0;
    
    const totalTime = responses.reduce((sum, response) => {
      if (response.startTime && response.endTime) {
        return sum + (new Date(response.endTime) - new Date(response.startTime));
      }
      return sum;
    }, 0);
    
    return Math.round(totalTime / responses.length / 1000 / 60); // minutes
  },

  // Generate survey statistics
  generateStats: (survey, responses) => {
    const stats = {
      totalResponses: responses?.length || 0,
      completionRate: 0,
      averageTime: 0,
      satisfactionScore: 0,
      questionStats: []
    };

    if (responses && responses.length > 0) {
      // Calculate completion rate
      const completedResponses = responses.filter(r => r.completed);
      stats.completionRate = Math.round((completedResponses.length / responses.length) * 100);
      
      // Calculate average time
      stats.averageTime = surveyUtils.calculateCompletionTime(responses);
      
      // Calculate satisfaction score (if rating questions exist)
      const ratingQuestions = survey.questions?.filter(q => q.type === 'rating' || q.type === 'emoji_scale');
      if (ratingQuestions.length > 0) {
        const ratingResponses = responses
          .map(r => r.answers)
          .flat()
          .filter(a => ratingQuestions.some(q => q.id === a.questionId))
          .map(a => parseInt(a.value) || 0);
        
        if (ratingResponses.length > 0) {
          stats.satisfactionScore = Math.round(
            (ratingResponses.reduce((sum, val) => sum + val, 0) / ratingResponses.length) * 10
          ) / 10;
        }
      }
      
      // Calculate question statistics
      stats.questionStats = survey.questions?.map(question => {
        const questionResponses = responses
          .map(r => r.answers)
          .flat()
          .filter(a => a.questionId === question.id);
        
        return {
          questionId: question.id,
          questionTitle: question.title,
          responseCount: questionResponses.length,
          completionRate: Math.round((questionResponses.length / responses.length) * 100),
          averageRating: question.type === 'rating' ? 
            Math.round((questionResponses.reduce((sum, r) => sum + (parseInt(r.value) || 0), 0) / questionResponses.length) * 10) / 10 : null
        };
      }) || [];
    }

    return stats;
  },

  // Export survey data
  exportSurveyData: (survey, responses, format = 'json') => {
    const data = {
      survey: {
        id: survey.id,
        title: survey.title,
        description: survey.description,
        questions: survey.questions,
        settings: survey.settings,
        createdAt: survey.createdAt,
        updatedAt: survey.updatedAt
      },
      responses: responses || [],
      exportedAt: new Date().toISOString(),
      totalResponses: responses?.length || 0
    };

    switch (format.toLowerCase()) {
      case 'csv':
        return surveyUtils.convertToCSV(data);
      case 'xlsx':
        return surveyUtils.convertToXLSX(data);
      default:
        return JSON.stringify(data, null, 2);
    }
  },

  // Convert to CSV format
  convertToCSV: (data) => {
    const headers = ['Response ID', 'Timestamp', 'Completed'];
    
    // Add question headers
    data.survey.questions.forEach(question => {
      headers.push(`Q${question.order + 1}: ${question.title}`);
    });
    
    const rows = [headers.join(',')];
    
    // Add response data
    data.responses.forEach(response => {
      const row = [
        response.id,
        response.timestamp,
        response.completed ? 'Yes' : 'No'
      ];
      
      data.survey.questions.forEach(question => {
        const answer = response.answers?.find(a => a.questionId === question.id);
        row.push(answer ? `"${answer.value}"` : '');
      });
      
      rows.push(row.join(','));
    });
    
    return rows.join('\n');
  },

  // Convert to XLSX format (simplified)
  convertToXLSX: (data) => {
    // This would typically use a library like xlsx
    // For now, return a simplified version
    return {
      survey: data.survey,
      responses: data.responses,
      format: 'xlsx',
      note: 'XLSX export requires xlsx library integration'
    };
  },

  // Generate survey URL
  generateSurveyURL: (surveyId, baseURL = window.location.origin) => {
    return `${baseURL}/survey/${surveyId}`;
  },

  // Generate short URL (simplified)
  generateShortURL: (surveyId, baseURL = window.location.origin) => {
    return `${baseURL}/s/${surveyId}`;
  },

  // Parse survey responses for analytics
  parseResponsesForAnalytics: (responses, questions) => {
    const analytics = {
      totalResponses: responses.length,
      completionRate: 0,
      averageTime: 0,
      questionAnalytics: {},
      sentimentAnalysis: null,
      trends: []
    };

    if (responses.length === 0) return analytics;

    // Calculate completion rate
    const completed = responses.filter(r => r.completed);
    analytics.completionRate = Math.round((completed.length / responses.length) * 100);

    // Calculate average time
    const times = responses
      .filter(r => r.startTime && r.endTime)
      .map(r => new Date(r.endTime) - new Date(r.startTime));
    
    if (times.length > 0) {
      analytics.averageTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length / 1000 / 60);
    }

    // Analyze each question
    questions.forEach(question => {
      const questionResponses = responses
        .map(r => r.answers)
        .flat()
        .filter(a => a.questionId === question.id);

      analytics.questionAnalytics[question.id] = {
        questionTitle: question.title,
        questionType: question.type,
        responseCount: questionResponses.length,
        completionRate: Math.round((questionResponses.length / responses.length) * 100),
        answers: questionResponses.map(r => r.value)
      };

      // Calculate specific analytics based on question type
      if (question.type === 'rating' || question.type === 'emoji_scale') {
        const ratings = questionResponses
          .map(r => parseInt(r.value))
          .filter(r => !isNaN(r));
        
        if (ratings.length > 0) {
          analytics.questionAnalytics[question.id].averageRating = 
            Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
          analytics.questionAnalytics[question.id].ratingDistribution = 
            surveyUtils.calculateRatingDistribution(ratings);
        }
      } else if (question.type === 'multiple_choice') {
        const choices = questionResponses.map(r => r.value);
        analytics.questionAnalytics[question.id].choiceDistribution = 
          surveyUtils.calculateChoiceDistribution(choices);
      }
    });

    return analytics;
  },

  // Calculate rating distribution
  calculateRatingDistribution: (ratings) => {
    const distribution = {};
    ratings.forEach(rating => {
      distribution[rating] = (distribution[rating] || 0) + 1;
    });
    return distribution;
  },

  // Calculate choice distribution
  calculateChoiceDistribution: (choices) => {
    const distribution = {};
    choices.forEach(choice => {
      distribution[choice] = (distribution[choice] || 0) + 1;
    });
    return distribution;
  },

  // Generate survey insights
  generateInsights: (analytics) => {
    const insights = [];

    // Completion rate insight
    if (analytics.completionRate > 80) {
      insights.push({
        type: 'positive',
        title: 'High Completion Rate',
        message: `${analytics.completionRate}% completion rate is excellent!`,
        icon: 'trending-up'
      });
    } else if (analytics.completionRate < 50) {
      insights.push({
        type: 'warning',
        title: 'Low Completion Rate',
        message: `${analytics.completionRate}% completion rate could be improved.`,
        icon: 'trending-down'
      });
    }

    // Response time insight
    if (analytics.averageTime > 10) {
      insights.push({
        type: 'warning',
        title: 'Long Response Time',
        message: `Average ${analytics.averageTime} minutes might be too long.`,
        icon: 'clock'
      });
    }

    // Question performance insights
    Object.values(analytics.questionAnalytics).forEach(question => {
      if (question.completionRate < 70) {
        insights.push({
          type: 'warning',
          title: 'Question Performance',
          message: `"${question.questionTitle}" has low completion rate.`,
          icon: 'alert-circle'
        });
      }
    });

    return insights;
  },

  // Format date for display
  formatDate: (date, format = 'short') => {
    const d = new Date(date);
    const options = {
      short: { month: 'short', day: 'numeric', year: 'numeric' },
      long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit' }
    };
    
    return d.toLocaleDateString('en-US', options[format] || options.short);
  },

  // Generate survey preview
  generatePreview: (survey) => {
    return {
      id: survey.id,
      title: survey.title,
      description: survey.description,
      questionCount: survey.questions?.length || 0,
      estimatedTime: Math.ceil((survey.questions?.length || 0) * 0.5), // 30 seconds per question
      lastModified: survey.updatedAt,
      status: survey.status || 'draft'
    };
  }
};

export default surveyUtils;

