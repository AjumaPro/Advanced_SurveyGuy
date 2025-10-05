/**
 * AI Service for SurveyGuy - Real AI Integration
 */

import OpenAI from 'openai';
import sentiment from 'sentiment';
import nlp from 'compromise';
import { AIConfig, isAIAvailable, getAIStatus } from '../utils/aiConfig';

// Initialize AI services conditionally
let openai = null;
let sentimentAnalyzer = null;

// Initialize OpenAI if available
if (AIConfig.OPENAI.API_KEY) {
  openai = new OpenAI({
    apiKey: AIConfig.OPENAI.API_KEY,
    dangerouslyAllowBrowser: true // Required for client-side usage
  });
}

// Initialize sentiment analyzer
sentimentAnalyzer = new sentiment();

// AI Service Class
export class AIService {
  
  /**
   * Generate survey questions using OpenAI GPT
   */
  static async generateQuestions(prompt, options = {}) {
    // Check if AI is available
    if (!isAIAvailable() || !openai) {
      console.log('AI not available, using fallback questions');
      return {
        success: false,
        error: 'AI service not available',
        fallback: this.getFallbackQuestions(prompt, options)
      };
    }

    try {
      const {
        surveyType = 'general',
        targetAudience = 'general',
        questionCount = 5,
        complexity = 'medium',
        industry = 'general'
      } = options;

      const systemPrompt = `You are an expert survey designer. Generate ${questionCount} high-quality survey questions based on the user's request.

Context:
- Survey Type: ${surveyType}
- Target Audience: ${targetAudience}
- Complexity Level: ${complexity}
- Industry: ${industry}

Requirements:
- Questions should be clear, unbiased, and actionable
- Include a mix of question types (rating, multiple choice, text)
- Ensure questions are relevant and focused
- Provide options for multiple choice questions
- Make questions engaging and easy to understand

Return the response as a JSON array with this structure:
[
  {
    "title": "Question text",
    "type": "rating|multiple_choice|text|checkbox",
    "description": "Help text for the question",
    "options": ["Option 1", "Option 2", ...],
    "required": true,
    "category": "engagement|satisfaction|feedback|demographics"
  }
]`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const response = completion.choices[0].message.content;
      const questions = JSON.parse(response);
      
      return {
        success: true,
        questions: questions.map((q, index) => ({
          id: `ai_${Date.now()}_${index}`,
          ...q,
          aiGenerated: true,
          confidence: 0.85,
          source: 'OpenAI GPT-4'
        })),
        metadata: {
          model: 'gpt-4',
          tokens: completion.usage?.total_tokens,
          generatedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('AI Question Generation Error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackQuestions(prompt, options)
      };
    }
  }

  /**
   * Analyze sentiment of survey responses
   */
  static async analyzeSentiment(responses) {
    try {
      if (!responses || responses.length === 0) {
        return { success: false, error: 'No responses provided' };
      }

      // Extract text from responses
      const textResponses = responses
        .map(response => {
          if (typeof response === 'string') return response;
          if (response.answers) {
            return Object.values(response.answers)
              .filter(answer => typeof answer === 'string')
              .join(' ');
          }
          return '';
        })
        .filter(text => text.length > 0);

      if (textResponses.length === 0) {
        return { success: false, error: 'No text responses found' };
      }

      // Use browser-compatible sentiment analysis
      const sentimentData = textResponses.map(text => {
        const result = sentimentAnalyzer.analyze(text);
        
        // Convert sentiment score to category
        let sentiment;
        if (result.score > 2) sentiment = 'positive';
        else if (result.score < -2) sentiment = 'negative';
        else sentiment = 'neutral';

        return {
          text,
          sentiment,
          score: result.score,
          confidence: {
            positive: sentiment === 'positive' ? Math.abs(result.score) / 5 : 0,
            neutral: sentiment === 'neutral' ? 1 - Math.abs(result.score) / 5 : 0,
            negative: sentiment === 'negative' ? Math.abs(result.score) / 5 : 0
          }
        };
      });

      // Calculate overall sentiment
      const sentimentCounts = {
        positive: sentimentData.filter(item => item.sentiment === 'positive').length,
        neutral: sentimentData.filter(item => item.sentiment === 'neutral').length,
        negative: sentimentData.filter(item => item.sentiment === 'negative').length
      };

      const total = sentimentData.length;
      const overallSentiment = {
        positive: (sentimentCounts.positive / total) * 100,
        neutral: (sentimentCounts.neutral / total) * 100,
        negative: (sentimentCounts.negative / total) * 100
      };

      return {
        success: true,
        sentimentData,
        overallSentiment,
        summary: {
          totalResponses: total,
          positiveCount: sentimentCounts.positive,
          neutralCount: sentimentCounts.neutral,
          negativeCount: sentimentCounts.negative,
          dominantSentiment: Object.keys(sentimentCounts).reduce((a, b) => 
            sentimentCounts[a] > sentimentCounts[b] ? a : b
          )
        },
        source: 'Browser Sentiment Analysis'
      };

    } catch (error) {
      console.error('Sentiment Analysis Error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackSentiment(responses)
      };
    }
  }

  /**
   * Cluster responses using ML techniques
   */
  static async clusterResponses(responses, options = {}) {
    try {
      const { clusters = 3, method = 'simple' } = options;

      if (!responses || responses.length === 0) {
        return { success: false, error: 'No responses provided' };
      }

      // Extract and preprocess text using browser-compatible NLP
      const textData = responses.map(response => {
        if (typeof response === 'string') return response;
        if (response.answers) {
          return Object.values(response.answers)
            .filter(answer => typeof answer === 'string')
            .join(' ');
        }
        return '';
      }).filter(text => text.length > 5);

      if (textData.length < clusters) {
        return { success: false, error: 'Insufficient data for clustering' };
      }

      // Use compromise.js for text preprocessing
      const processedTexts = textData.map(text => {
        const doc = nlp(text.toLowerCase());
        // Extract keywords and normalize
        const terms = doc.terms().out('array');
        return terms.join(' ');
      });

      // Simple clustering based on text similarity
      const clusters_result = this.performSimpleClustering(textData, clusters);
      
      // Group responses by cluster
      const clusteredResponses = clusters_result.map((cluster, index) => ({
        clusterId: index,
        responses: cluster.map(idx => ({
          originalText: textData[idx],
          processedText: processedTexts[idx]
        })),
        size: cluster.length,
        name: this.generateClusterName(cluster.map(idx => textData[idx]))
      }));

      return {
        success: true,
        clusters: clusteredResponses,
        metadata: {
          totalResponses: textData.length,
          numberOfClusters: clusters,
          method: 'simple',
          algorithm: 'Browser-compatible clustering'
        },
        source: 'Browser Clustering'
      };

    } catch (error) {
      console.error('Response Clustering Error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackClustering(responses)
      };
    }
  }

  /**
   * Optimize survey based on AI analysis
   */
  static async optimizeSurvey(surveyData, responseData) {
    // Check if AI is available
    if (!isAIAvailable() || !openai) {
      console.log('AI not available, using fallback optimization');
      return {
        success: false,
        error: 'AI service not available',
        fallback: this.getFallbackOptimization(surveyData)
      };
    }

    try {
      const optimizationPrompt = `Analyze this survey and its response data to provide optimization recommendations.

Survey Data:
${JSON.stringify(surveyData, null, 2)}

Response Data:
${JSON.stringify(responseData, null, 2)}

Provide optimization recommendations in this JSON format:
{
  "recommendations": [
    {
      "type": "question_order|question_wording|question_type|survey_length",
      "priority": "high|medium|low",
      "title": "Recommendation title",
      "description": "Detailed description",
      "impact": "Expected improvement",
      "implementation": "How to implement"
    }
  ],
  "insights": {
    "completionRate": "Analysis of completion rate",
    "responseQuality": "Analysis of response quality",
    "userExperience": "UX analysis",
    "engagement": "Engagement analysis"
  },
  "score": {
    "current": 75,
    "potential": 90,
    "improvement": 15
  }
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert survey optimization specialist." },
          { role: "user", content: optimizationPrompt }
        ],
        temperature: 0.5,
        max_tokens: 2000
      });

      const response = JSON.parse(completion.choices[0].message.content);
      
      return {
        success: true,
        optimization: response,
        metadata: {
          model: 'gpt-4',
          tokens: completion.usage?.total_tokens,
          generatedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Survey Optimization Error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackOptimization(surveyData)
      };
    }
  }

  /**
   * Generate AI insights from survey data
   */
  static async generateInsights(surveyData, responseData, analyticsData) {
    // Check if AI is available
    if (!isAIAvailable() || !openai) {
      console.log('AI not available, using fallback insights');
      return {
        success: false,
        error: 'AI service not available',
        fallback: this.getFallbackInsights(analyticsData)
      };
    }

    try {
      const insightsPrompt = `Analyze this survey data and provide comprehensive AI insights.

Survey: ${surveyData.title}
Description: ${surveyData.description || 'N/A'}

Analytics Data:
${JSON.stringify(analyticsData, null, 2)}

Response Sample:
${JSON.stringify(responseData.slice(0, 5), null, 2)}

Provide insights in this JSON format:
{
  "executiveSummary": {
    "title": "Executive Summary",
    "content": "Key findings and insights"
  },
  "keyFindings": [
    {
      "title": "Finding title",
      "description": "Detailed finding",
      "impact": "high|medium|low",
      "category": "engagement|satisfaction|demographics|trends"
    }
  ],
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "What to do",
      "priority": "high|medium|low",
      "timeline": "immediate|short-term|long-term"
    }
  ],
  "trends": {
    "direction": "positive|negative|stable",
    "confidence": 0.85,
    "description": "Trend analysis"
  },
  "nextSteps": [
    "Action item 1",
    "Action item 2"
  ]
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert data analyst specializing in survey insights." },
          { role: "user", content: insightsPrompt }
        ],
        temperature: 0.6,
        max_tokens: 2500
      });

      const response = JSON.parse(completion.choices[0].message.content);
      
      return {
        success: true,
        insights: response,
        metadata: {
          model: 'gpt-4',
          tokens: completion.usage?.total_tokens,
          generatedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('AI Insights Generation Error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackInsights(analyticsData)
      };
    }
  }

  // Helper methods for fallback implementations
  static getFallbackQuestions(prompt, options) {
    const templates = [
      {
        title: "How would you rate your overall experience?",
        type: "rating",
        description: "Rate from 1-5 stars",
        options: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
        required: true,
        category: "satisfaction"
      },
      {
        title: "What is your primary concern or feedback?",
        type: "text",
        description: "Please provide detailed feedback",
        required: false,
        category: "feedback"
      },
      {
        title: "How likely are you to recommend us?",
        type: "multiple_choice",
        description: "Select your likelihood",
        options: ["Very Unlikely", "Unlikely", "Neutral", "Likely", "Very Likely"],
        required: true,
        category: "engagement"
      }
    ];

    return templates.map((q, index) => ({
      id: `fallback_${Date.now()}_${index}`,
      ...q,
      aiGenerated: false,
      confidence: 0.6,
      source: 'Fallback Template'
    }));
  }

  static getFallbackSentiment(responses) {
    const positiveWords = ['good', 'great', 'excellent', 'love', 'amazing', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'disappointed', 'poor'];
    
    let positive = 0, neutral = 0, negative = 0;
    
    responses.forEach(response => {
      const text = typeof response === 'string' ? response : 
        Object.values(response.answers || {}).join(' ').toLowerCase();
      
      const hasPositive = positiveWords.some(word => text.includes(word));
      const hasNegative = negativeWords.some(word => text.includes(word));
      
      if (hasPositive && !hasNegative) positive++;
      else if (hasNegative && !hasPositive) negative++;
      else neutral++;
    });

    const total = responses.length;
    return {
      success: true,
      overallSentiment: {
        positive: (positive / total) * 100,
        neutral: (neutral / total) * 100,
        negative: (negative / total) * 100
      },
      summary: {
        totalResponses: total,
        dominantSentiment: positive > negative ? 'positive' : negative > positive ? 'negative' : 'neutral'
      },
      source: 'Fallback Analysis'
    };
  }

  static getFallbackClustering(responses) {
    // Simple clustering by response length
    const clusters = [
      { clusterId: 0, responses: [], size: 0, name: 'Short Responses' },
      { clusterId: 1, responses: [], size: 0, name: 'Medium Responses' },
      { clusterId: 2, responses: [], size: 0, name: 'Long Responses' }
    ];

    responses.forEach((response, index) => {
      const text = typeof response === 'string' ? response : 
        Object.values(response.answers || {}).join(' ');
      const length = text.length;
      
      if (length < 50) clusters[0].responses.push({ originalText: text });
      else if (length < 200) clusters[1].responses.push({ originalText: text });
      else clusters[2].responses.push({ originalText: text });
    });

    clusters.forEach(cluster => cluster.size = cluster.responses.length);

    return {
      success: true,
      clusters,
      source: 'Fallback Clustering'
    };
  }

  static getFallbackOptimization(surveyData) {
    return {
      success: true,
      optimization: {
        recommendations: [
          {
            type: "survey_length",
            priority: "medium",
            title: "Optimize Survey Length",
            description: "Consider reducing the number of questions to improve completion rates",
            impact: "Expected 15% improvement in completion rate",
            implementation: "Remove non-essential questions and focus on core objectives"
          }
        ],
        score: {
          current: 70,
          potential: 85,
          improvement: 15
        }
      },
      source: 'Fallback Optimization'
    };
  }

  static getFallbackInsights(analyticsData) {
    return {
      success: true,
      insights: {
        executiveSummary: {
          title: "Survey Performance Summary",
          content: `Your survey collected ${analyticsData.overview?.totalResponses || 0} responses with a ${Math.round((analyticsData.overview?.avgCompletionRate || 0) * 100)}% completion rate.`
        },
        keyFindings: [
          {
            title: "Response Collection",
            description: `Successfully gathered ${analyticsData.overview?.totalResponses || 0} responses`,
            impact: "medium",
            category: "engagement"
          }
        ],
        recommendations: [
          {
            title: "Improve Completion Rate",
            description: "Focus on survey length and question clarity",
            priority: "medium",
            timeline: "short-term"
          }
        ]
      },
      source: 'Fallback Insights'
    };
  }

  // Utility methods for browser-compatible clustering
  static performSimpleClustering(textData, k) {
    const clusters = Array(k).fill().map(() => []);
    const n = textData.length;
    
    // Simple clustering based on text length and word count
    textData.forEach((text, index) => {
      const length = text.length;
      const wordCount = text.split(' ').length;
      
      // Determine cluster based on text characteristics
      let clusterIndex;
      if (length < 50) clusterIndex = 0; // Short responses
      else if (length < 200) clusterIndex = 1; // Medium responses
      else clusterIndex = 2; // Long responses
      
      // Ensure cluster index is within bounds
      clusterIndex = Math.min(clusterIndex, k - 1);
      clusters[clusterIndex].push(index);
    });
    
    // If any cluster is empty, redistribute
    for (let i = 0; i < k; i++) {
      if (clusters[i].length === 0 && n > k) {
        // Find the largest cluster and move one item
        const largestCluster = clusters.reduce((max, cluster, idx) => 
          cluster.length > clusters[max].length ? idx : max, 0
        );
        
        if (clusters[largestCluster].length > 1) {
          const item = clusters[largestCluster].pop();
          clusters[i].push(item);
        }
      }
    }
    
    return clusters;
  }

  static generateClusterName(texts) {
    if (texts.length === 0) return 'Empty Cluster';
    
    // Use compromise.js to extract common terms
    const allText = texts.join(' ');
    const doc = nlp(allText.toLowerCase());
    
    // Get most common nouns and adjectives
    const nouns = doc.nouns().out('topk');
    const adjectives = doc.adjectives().out('topk');
    
    // Combine and create a name
    const terms = [...nouns.slice(0, 2), ...adjectives.slice(0, 1)];
    return terms.length > 0 ? terms.join(' ') : 'Mixed Responses';
  }
}

export default AIService;
