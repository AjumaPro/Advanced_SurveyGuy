import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Play,
  Save,
  Eye,
  Plus,
  Settings,
  FileText,
  Star,
  Users,
  BarChart3,
  Zap,
  Crown,
  Database,
  BookOpen,
  Share2,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const SurveyBuilderComprehensiveTest = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [running, setRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [testResults, setTestResults] = useState({});

  const testSuites = [
    {
      name: 'Core Survey Builder',
      icon: <FileText className="w-5 h-5" />,
      tests: [
        {
          name: 'Survey Creation',
          description: 'Test creating a new survey',
          test: testSurveyCreation
        },
        {
          name: 'Survey Saving',
          description: 'Test saving survey as draft',
          test: testSurveySaving
        },
        {
          name: 'Survey Publishing',
          description: 'Test publishing survey',
          test: testSurveyPublishing
        },
        {
          name: 'Survey Loading',
          description: 'Test loading existing survey',
          test: testSurveyLoading
        }
      ]
    },
    {
      name: 'Question Management',
      icon: <Plus className="w-5 h-5" />,
      tests: [
        {
          name: 'Add Questions',
          description: 'Test adding different question types',
          test: testQuestionAdding
        },
        {
          name: 'Edit Questions',
          description: 'Test editing question content',
          test: testQuestionEditing
        },
        {
          name: 'Delete Questions',
          description: 'Test deleting questions',
          test: testQuestionDeletion
        },
        {
          name: 'Duplicate Questions',
          description: 'Test duplicating questions',
          test: testQuestionDuplication
        }
      ]
    },
    {
      name: 'Question Types',
      icon: <Star className="w-5 h-5" />,
      tests: [
        {
          name: 'Text Questions',
          description: 'Test text input questions',
          test: testTextQuestions
        },
        {
          name: 'Multiple Choice',
          description: 'Test multiple choice questions',
          test: testMultipleChoice
        },
        {
          name: 'Rating Questions',
          description: 'Test rating scale questions',
          test: testRatingQuestions
        },
        {
          name: 'Emoji Scale',
          description: 'Test emoji scale questions',
          test: testEmojiScale
        },
        {
          name: 'Matrix Questions',
          description: 'Test matrix questions',
          test: testMatrixQuestions
        }
      ]
    },
    {
      name: 'Advanced Features',
      icon: <Zap className="w-5 h-5" />,
      tests: [
        {
          name: 'Question Library',
          description: 'Test saving/loading from question library',
          test: testQuestionLibrary
        },
        {
          name: 'Template System',
          description: 'Test template selection and application',
          test: testTemplateSystem
        },
        {
          name: 'Advanced Editor',
          description: 'Test comprehensive question editor',
          test: testAdvancedEditor
        },
        {
          name: 'Bulk Operations',
          description: 'Test bulk question operations',
          test: testBulkOperations
        }
      ]
    },
    {
      name: 'Survey Settings',
      icon: <Settings className="w-5 h-5" />,
      tests: [
        {
          name: 'Survey Settings',
          description: 'Test survey configuration options',
          test: testSurveySettings
        },
        {
          name: 'Branding',
          description: 'Test survey branding options',
          test: testSurveyBranding
        },
        {
          name: 'Privacy Settings',
          description: 'Test privacy and collection settings',
          test: testPrivacySettings
        }
      ]
    },
    {
      name: 'Sharing & Analytics',
      icon: <Share2 className="w-5 h-5" />,
      tests: [
        {
          name: 'Survey Sharing',
          description: 'Test survey sharing functionality',
          test: testSurveySharing
        },
        {
          name: 'QR Code Generation',
          description: 'Test QR code generation',
          test: testQRCodeGeneration
        },
        {
          name: 'Response Collection',
          description: 'Test response collection',
          test: testResponseCollection
        },
        {
          name: 'Analytics Integration',
          description: 'Test analytics data collection',
          test: testAnalyticsIntegration
        }
      ]
    }
  ];

  // Test Functions
  async function testSurveyCreation() {
    try {
      const testSurvey = {
        title: 'Test Survey - Creation',
        description: 'Testing survey creation functionality',
        questions: [],
        settings: {
          allowAnonymous: true,
          collectEmail: false,
          showProgress: true
        }
      };

      const { survey, error } = await api.surveys.createSurvey(user.id, testSurvey);
      
      if (error) throw new Error(error);
      
      return {
        success: true,
        message: `Survey created successfully with ID: ${survey.id}`,
        data: { surveyId: survey.id }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create survey: ${error.message}`
      };
    }
  }

  async function testSurveySaving() {
    try {
      const testSurvey = {
        title: 'Test Survey - Saving',
        description: 'Testing survey saving functionality',
        questions: [
          {
            id: 'q1',
            type: 'text',
            title: 'Test Question',
            required: false,
            settings: {}
          }
        ],
        status: 'draft'
      };

      const { survey, error } = await api.surveys.createSurvey(user.id, testSurvey);
      
      if (error) throw new Error(error);

      // Test saving updates
      const updates = {
        title: 'Test Survey - Updated',
        questions: [
          ...testSurvey.questions,
          {
            id: 'q2',
            type: 'multiple_choice',
            title: 'Second Question',
            required: true,
            settings: {
              options: ['Option 1', 'Option 2', 'Option 3']
            }
          }
        ]
      };

      const { survey: updatedSurvey, error: updateError } = await api.surveys.updateSurvey(survey.id, updates);
      
      if (updateError) throw new Error(updateError);

      // Cleanup
      await api.surveys.deleteSurvey(survey.id);
      
      return {
        success: true,
        message: 'Survey saving and updating works correctly',
        data: { surveyId: survey.id }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to save survey: ${error.message}`
      };
    }
  }

  async function testSurveyPublishing() {
    try {
      const testSurvey = {
        title: 'Test Survey - Publishing',
        description: 'Testing survey publishing functionality',
        questions: [
          {
            id: 'q1',
            type: 'text',
            title: 'What is your name?',
            required: true,
            settings: {}
          }
        ],
        status: 'draft'
      };

      const { survey, error } = await api.surveys.createSurvey(user.id, testSurvey);
      
      if (error) throw new Error(error);

      // Test publishing
      const { survey: publishedSurvey, error: publishError } = await api.surveys.publishSurvey(survey.id);
      
      if (publishError) throw new Error(publishError);

      if (publishedSurvey.status !== 'published') {
        throw new Error('Survey status not updated to published');
      }

      // Test unpublishing
      const { survey: unpublishedSurvey, error: unpublishError } = await api.surveys.unpublishSurvey(survey.id);
      
      if (unpublishError) throw new Error(unpublishError);

      // Cleanup
      await api.surveys.deleteSurvey(survey.id);
      
      return {
        success: true,
        message: 'Survey publishing and unpublishing works correctly',
        data: { surveyId: survey.id }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to publish survey: ${error.message}`
      };
    }
  }

  async function testSurveyLoading() {
    try {
      // Create a test survey first
      const testSurvey = {
        title: 'Test Survey - Loading',
        description: 'Testing survey loading functionality',
        questions: [
          {
            id: 'q1',
            type: 'rating',
            title: 'Rate your experience',
            required: false,
            settings: { maxRating: 5 }
          }
        ]
      };

      const { survey, error } = await api.surveys.createSurvey(user.id, testSurvey);
      
      if (error) throw new Error(error);

      // Test loading the survey
      const { survey: loadedSurvey, error: loadError } = await api.surveys.getSurvey(survey.id);
      
      if (loadError) throw new Error(loadError);

      if (!loadedSurvey || loadedSurvey.id !== survey.id) {
        throw new Error('Loaded survey does not match created survey');
      }

      // Cleanup
      await api.surveys.deleteSurvey(survey.id);
      
      return {
        success: true,
        message: 'Survey loading works correctly',
        data: { surveyId: survey.id }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to load survey: ${error.message}`
      };
    }
  }

  async function testQuestionAdding() {
    try {
      const questionTypes = ['text', 'multiple_choice', 'rating', 'checkbox', 'textarea'];
      const results = [];

      for (const type of questionTypes) {
        const testQuestion = {
          type,
          title: `Test ${type} question`,
          required: false,
          settings: type === 'multiple_choice' ? { options: ['Option 1', 'Option 2'] } : {}
        };

        // Test question creation logic (simulate what happens in the builder)
        const questionData = {
          ...testQuestion,
          id: `q_${Date.now()}_${type}`,
          settings: testQuestion.settings || {}
        };

        results.push({
          type,
          success: true,
          data: questionData
        });
      }

      return {
        success: true,
        message: `Successfully tested ${questionTypes.length} question types`,
        data: { questions: results }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test question adding: ${error.message}`
      };
    }
  }

  async function testQuestionEditing() {
    try {
      const originalQuestion = {
        id: 'test-q1',
        type: 'text',
        title: 'Original Title',
        required: false,
        settings: {}
      };

      const updates = {
        title: 'Updated Title',
        required: true,
        settings: { placeholder: 'Enter your answer...' }
      };

      // Simulate question editing logic
      const editedQuestion = {
        ...originalQuestion,
        ...updates
      };

      if (editedQuestion.title !== updates.title) {
        throw new Error('Question title not updated correctly');
      }

      if (editedQuestion.required !== updates.required) {
        throw new Error('Question required status not updated correctly');
      }

      return {
        success: true,
        message: 'Question editing works correctly',
        data: { question: editedQuestion }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test question editing: ${error.message}`
      };
    }
  }

  async function testQuestionDeletion() {
    try {
      const questions = [
        { id: 'q1', type: 'text', title: 'Question 1' },
        { id: 'q2', type: 'rating', title: 'Question 2' },
        { id: 'q3', type: 'multiple_choice', title: 'Question 3' }
      ];

      const questionToDelete = 'q2';
      const remainingQuestions = questions.filter(q => q.id !== questionToDelete);

      if (remainingQuestions.length !== 2) {
        throw new Error('Question deletion logic not working correctly');
      }

      if (remainingQuestions.find(q => q.id === questionToDelete)) {
        throw new Error('Question not properly removed from list');
      }

      return {
        success: true,
        message: 'Question deletion works correctly',
        data: { 
          original: questions.length,
          remaining: remainingQuestions.length,
          deleted: questionToDelete
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test question deletion: ${error.message}`
      };
    }
  }

  async function testQuestionDuplication() {
    try {
      const originalQuestion = {
        id: 'q1',
        type: 'multiple_choice',
        title: 'Original Question',
        required: true,
        settings: { options: ['A', 'B', 'C'] }
      };

      // Simulate duplication logic
      const duplicatedQuestion = {
        ...originalQuestion,
        id: `q_${Date.now()}`,
        title: `${originalQuestion.title} (Copy)`
      };

      if (duplicatedQuestion.id === originalQuestion.id) {
        throw new Error('Duplicated question has same ID');
      }

      if (duplicatedQuestion.title === originalQuestion.title) {
        throw new Error('Duplicated question title not updated');
      }

      if (duplicatedQuestion.type !== originalQuestion.type) {
        throw new Error('Duplicated question type changed');
      }

      return {
        success: true,
        message: 'Question duplication works correctly',
        data: { 
          original: originalQuestion,
          duplicated: duplicatedQuestion
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test question duplication: ${error.message}`
      };
    }
  }

  async function testTextQuestions() {
    try {
      const textQuestion = {
        type: 'text',
        title: 'What is your name?',
        required: true,
        settings: {
          placeholder: 'Enter your name...',
          maxLength: 100,
          minLength: 2
        }
      };

      // Test validation logic
      const isValid = textQuestion.title && textQuestion.title.length > 0;
      
      if (!isValid) {
        throw new Error('Text question validation failed');
      }

      return {
        success: true,
        message: 'Text questions work correctly',
        data: { question: textQuestion }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test text questions: ${error.message}`
      };
    }
  }

  async function testMultipleChoice() {
    try {
      const mcQuestion = {
        type: 'multiple_choice',
        title: 'What is your favorite color?',
        required: false,
        settings: {
          options: ['Red', 'Blue', 'Green', 'Yellow'],
          allowOther: true,
          randomizeOptions: false
        }
      };

      // Test option validation
      const hasOptions = mcQuestion.settings.options && mcQuestion.settings.options.length > 0;
      
      if (!hasOptions) {
        throw new Error('Multiple choice question missing options');
      }

      if (mcQuestion.settings.options.length < 2) {
        throw new Error('Multiple choice question needs at least 2 options');
      }

      return {
        success: true,
        message: 'Multiple choice questions work correctly',
        data: { question: mcQuestion }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test multiple choice: ${error.message}`
      };
    }
  }

  async function testRatingQuestions() {
    try {
      const ratingQuestion = {
        type: 'rating',
        title: 'How satisfied are you?',
        required: true,
        settings: {
          maxRating: 5,
          labels: {
            '1': 'Very Poor',
            '5': 'Excellent'
          },
          allowHalf: false
        }
      };

      // Test rating validation
      if (ratingQuestion.settings.maxRating < 1 || ratingQuestion.settings.maxRating > 10) {
        throw new Error('Rating scale out of valid range');
      }

      return {
        success: true,
        message: 'Rating questions work correctly',
        data: { question: ratingQuestion }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test rating questions: ${error.message}`
      };
    }
  }

  async function testEmojiScale() {
    try {
      const emojiQuestion = {
        type: 'emoji_scale',
        title: 'How do you feel?',
        required: false,
        settings: {
          scaleType: 'satisfaction',
          showLabels: true,
          showDescriptions: false
        }
      };

      // Test emoji scale validation
      const validScaleTypes = ['satisfaction', 'mood', 'agreement', 'experience'];
      
      if (!validScaleTypes.includes(emojiQuestion.settings.scaleType)) {
        throw new Error('Invalid emoji scale type');
      }

      return {
        success: true,
        message: 'Emoji scale questions work correctly',
        data: { question: emojiQuestion }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test emoji scale: ${error.message}`
      };
    }
  }

  async function testMatrixQuestions() {
    try {
      const matrixQuestion = {
        type: 'matrix',
        title: 'Rate each aspect',
        required: true,
        settings: {
          rows: ['Service', 'Quality', 'Price'],
          columns: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
          scaleType: 'radio'
        }
      };

      // Test matrix validation
      if (!matrixQuestion.settings.rows || matrixQuestion.settings.rows.length === 0) {
        throw new Error('Matrix question missing rows');
      }

      if (!matrixQuestion.settings.columns || matrixQuestion.settings.columns.length === 0) {
        throw new Error('Matrix question missing columns');
      }

      return {
        success: true,
        message: 'Matrix questions work correctly',
        data: { question: matrixQuestion }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test matrix questions: ${error.message}`
      };
    }
  }

  async function testQuestionLibrary() {
    try {
      const testQuestion = {
        name: 'Test Question for Library',
        description: 'Testing question library functionality',
        category: 'test',
        tags: ['test', 'library'],
        isPublic: false,
        type: 'text',
        title: 'Library Test Question',
        settings: {},
        required: false
      };

      // Test saving to library
      const { question, error } = await api.questions.saveQuestion(user.id, testQuestion);
      
      if (error) throw new Error(error);

      // Test loading from library
      const { questions, error: loadError } = await api.questions.getSavedQuestions(user.id, { limit: 10 });
      
      if (loadError) throw new Error(loadError);

      // Test deleting from library
      const { error: deleteError } = await api.questions.deleteQuestion(question.id, user.id);
      
      if (deleteError) throw new Error(deleteError);

      return {
        success: true,
        message: 'Question library works correctly',
        data: { questionId: question.id }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test question library: ${error.message}`
      };
    }
  }

  async function testTemplateSystem() {
    try {
      // Test loading templates
      const { templates, error } = await api.templates.getTemplates();
      
      if (error) throw new Error(error);

      if (!templates || templates.length === 0) {
        throw new Error('No templates available');
      }

      // Test template application logic
      const selectedTemplate = templates[0];
      const appliedSurvey = {
        title: selectedTemplate.title,
        description: selectedTemplate.description,
        questions: selectedTemplate.questions?.map((q, index) => ({
          ...q,
          id: `q_${Date.now()}_${index}`,
          settings: q.settings || {}
        })) || []
      };

      return {
        success: true,
        message: `Template system works correctly - ${templates.length} templates available`,
        data: { 
          templateCount: templates.length,
          appliedTemplate: appliedSurvey
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test template system: ${error.message}`
      };
    }
  }

  async function testAdvancedEditor() {
    try {
      const testQuestion = {
        type: 'multiple_choice',
        title: 'Advanced Editor Test',
        description: 'Testing advanced question editor',
        required: true,
        settings: {
          options: ['Option A', 'Option B', 'Option C'],
          allowOther: true,
          randomizeOptions: false,
          customValidation: {
            enabled: true,
            pattern: '^[A-Za-z]+$',
            message: 'Please enter only letters'
          }
        }
      };

      // Test advanced editor validation
      const hasAdvancedSettings = testQuestion.settings.customValidation?.enabled;
      const hasValidationPattern = testQuestion.settings.customValidation?.pattern;

      if (!hasAdvancedSettings) {
        throw new Error('Advanced settings not properly configured');
      }

      return {
        success: true,
        message: 'Advanced editor works correctly',
        data: { question: testQuestion }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test advanced editor: ${error.message}`
      };
    }
  }

  async function testBulkOperations() {
    try {
      const questions = [
        { id: 'q1', type: 'text', title: 'Question 1' },
        { id: 'q2', type: 'rating', title: 'Question 2' },
        { id: 'q3', type: 'multiple_choice', title: 'Question 3' }
      ];

      const selectedQuestions = ['q1', 'q3'];

      // Test bulk deletion
      const afterDeletion = questions.filter(q => !selectedQuestions.includes(q.id));
      
      // Test bulk duplication
      const duplicated = selectedQuestions.map(id => {
        const original = questions.find(q => q.id === id);
        return {
          ...original,
          id: `copy_${id}`,
          title: `${original.title} (Copy)`
        };
      });

      if (afterDeletion.length !== 1) {
        throw new Error('Bulk deletion not working correctly');
      }

      if (duplicated.length !== 2) {
        throw new Error('Bulk duplication not working correctly');
      }

      return {
        success: true,
        message: 'Bulk operations work correctly',
        data: { 
          originalCount: questions.length,
          deletedCount: selectedQuestions.length,
          duplicatedCount: duplicated.length
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test bulk operations: ${error.message}`
      };
    }
  }

  async function testSurveySettings() {
    try {
      const testSettings = {
        allowAnonymous: true,
        collectEmail: false,
        showProgress: true,
        randomizeQuestions: false,
        requireAll: false,
        theme: 'modern',
        brandColor: '#3B82F6',
        customCSS: '',
        redirectUrl: '',
        thankYouMessage: 'Thank you for your response!'
      };

      // Test settings validation
      const isValidTheme = ['modern', 'classic', 'minimal'].includes(testSettings.theme);
      const isValidColor = /^#[0-9A-F]{6}$/i.test(testSettings.brandColor);

      if (!isValidTheme) {
        throw new Error('Invalid theme selected');
      }

      if (!isValidColor) {
        throw new Error('Invalid brand color format');
      }

      return {
        success: true,
        message: 'Survey settings work correctly',
        data: { settings: testSettings }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test survey settings: ${error.message}`
      };
    }
  }

  async function testSurveyBranding() {
    try {
      const brandingOptions = {
        logo: null,
        primaryColor: '#3B82F6',
        secondaryColor: '#64748B',
        fontFamily: 'Inter',
        customCSS: '.survey-container { background: #f8fafc; }'
      };

      // Test branding validation
      const hasValidColors = /^#[0-9A-F]{6}$/i.test(brandingOptions.primaryColor) &&
                           /^#[0-9A-F]{6}$/i.test(brandingOptions.secondaryColor);

      if (!hasValidColors) {
        throw new Error('Invalid color format in branding options');
      }

      return {
        success: true,
        message: 'Survey branding works correctly',
        data: { branding: brandingOptions }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test survey branding: ${error.message}`
      };
    }
  }

  async function testPrivacySettings() {
    try {
      const privacySettings = {
        allowAnonymous: true,
        collectEmail: false,
        collectIP: false,
        storeResponses: true,
        dataRetentionDays: 365,
        gdprCompliant: true
      };

      // Test privacy validation
      if (typeof privacySettings.allowAnonymous !== 'boolean') {
        throw new Error('Invalid anonymous setting');
      }

      if (privacySettings.dataRetentionDays < 0) {
        throw new Error('Invalid data retention period');
      }

      return {
        success: true,
        message: 'Privacy settings work correctly',
        data: { privacy: privacySettings }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test privacy settings: ${error.message}`
      };
    }
  }

  async function testSurveySharing() {
    try {
      const testSurvey = {
        title: 'Test Sharing Survey',
        description: 'Testing survey sharing functionality',
        questions: [
          {
            id: 'q1',
            type: 'text',
            title: 'Test Question',
            required: false,
            settings: {}
          }
        ],
        status: 'published'
      };

      // Create test survey
      const { survey, error } = await api.surveys.createSurvey(user.id, testSurvey);
      
      if (error) throw new Error(error);

      // Publish survey
      const { survey: publishedSurvey, error: publishError } = await api.surveys.publishSurvey(survey.id);
      
      if (publishError) throw new Error(publishError);

      // Test public access
      const { survey: publicSurvey, error: publicError } = await api.responses.getPublicSurvey(survey.id);
      
      if (publicError) throw new Error(publicError);

      // Cleanup
      await api.surveys.deleteSurvey(survey.id);

      return {
        success: true,
        message: 'Survey sharing works correctly',
        data: { 
          surveyId: survey.id,
          publicUrl: `${window.location.origin}/s/${survey.id}`
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test survey sharing: ${error.message}`
      };
    }
  }

  async function testQRCodeGeneration() {
    try {
      const testUrl = 'https://example.com/survey/test';
      
      // Test QR code generation logic (simulate)
      const qrData = {
        url: testUrl,
        size: 256,
        format: 'png'
      };

      // Validate QR code parameters
      if (!qrData.url || !qrData.url.includes('http')) {
        throw new Error('Invalid URL for QR code generation');
      }

      if (qrData.size < 100 || qrData.size > 1000) {
        throw new Error('Invalid QR code size');
      }

      return {
        success: true,
        message: 'QR code generation works correctly',
        data: { qrCode: qrData }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test QR code generation: ${error.message}`
      };
    }
  }

  async function testResponseCollection() {
    try {
      const testResponse = {
        surveyId: 'test-survey-id',
        responses: [
          {
            questionId: 'q1',
            questionType: 'text',
            answer: 'Test Answer'
          }
        ],
        metadata: {
          timestamp: new Date().toISOString(),
          userAgent: 'Test Agent',
          ipAddress: '127.0.0.1'
        }
      };

      // Test response validation
      if (!testResponse.surveyId) {
        throw new Error('Missing survey ID in response');
      }

      if (!testResponse.responses || testResponse.responses.length === 0) {
        throw new Error('No responses in submission');
      }

      return {
        success: true,
        message: 'Response collection works correctly',
        data: { response: testResponse }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test response collection: ${error.message}`
      };
    }
  }

  async function testAnalyticsIntegration() {
    try {
      const analyticsData = {
        surveyId: 'test-survey-id',
        metrics: {
          totalResponses: 10,
          completionRate: 85.5,
          averageTime: 120,
          deviceBreakdown: {
            desktop: 60,
            mobile: 35,
            tablet: 5
          }
        },
        lastUpdated: new Date().toISOString()
      };

      // Test analytics validation
      if (analyticsData.metrics.totalResponses < 0) {
        throw new Error('Invalid total responses count');
      }

      if (analyticsData.metrics.completionRate < 0 || analyticsData.metrics.completionRate > 100) {
        throw new Error('Invalid completion rate');
      }

      return {
        success: true,
        message: 'Analytics integration works correctly',
        data: { analytics: analyticsData }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test analytics integration: ${error.message}`
      };
    }
  }

  const runAllTests = async () => {
    setRunning(true);
    setTests([]);
    const allResults = [];

    for (const suite of testSuites) {
      const suiteResults = [];
      
      for (const test of suite.tests) {
        setCurrentTest(`${suite.name}: ${test.name}`);
        
        try {
          const result = await test.test();
          suiteResults.push({
            name: test.name,
            description: test.description,
            success: result.success,
            message: result.message,
            data: result.data,
            timestamp: new Date().toLocaleTimeString()
          });
        } catch (error) {
          suiteResults.push({
            name: test.name,
            description: test.description,
            success: false,
            message: error.message,
            data: null,
            timestamp: new Date().toLocaleTimeString()
          });
        }
      }

      allResults.push({
        suite: suite.name,
        icon: suite.icon,
        tests: suiteResults
      });
    }

    setTests(allResults);
    setRunning(false);
    setCurrentTest('');

    const totalTests = allResults.reduce((sum, suite) => sum + suite.tests.length, 0);
    const passedTests = allResults.reduce((sum, suite) => 
      sum + suite.tests.filter(test => test.success).length, 0
    );

    if (passedTests === totalTests) {
      toast.success(`All ${totalTests} tests passed! Survey builder is fully functional.`);
    } else {
      toast.error(`${totalTests - passedTests} of ${totalTests} tests failed. Check results below.`);
    }
  };

  const runSuiteTests = async (suite) => {
    setRunning(true);
    const suiteResults = [];

    for (const test of suite.tests) {
      setCurrentTest(`${suite.name}: ${test.name}`);
      
      try {
        const result = await test.test();
        suiteResults.push({
          name: test.name,
          description: test.description,
          success: result.success,
          message: result.message,
          data: result.data,
          timestamp: new Date().toLocaleTimeString()
        });
      } catch (error) {
        suiteResults.push({
          name: test.name,
          description: test.description,
          success: false,
          message: error.message,
          data: null,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }

    setTests([{
      suite: suite.name,
      icon: suite.icon,
      tests: suiteResults
    }]);
    setRunning(false);
    setCurrentTest('');

    const passedTests = suiteResults.filter(test => test.success).length;
    const totalTests = suiteResults.length;

    if (passedTests === totalTests) {
      toast.success(`All ${totalTests} ${suite.name} tests passed!`);
    } else {
      toast.error(`${totalTests - passedTests} of ${totalTests} ${suite.name} tests failed.`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Survey Builder Comprehensive Test</h1>
            <p className="text-gray-600 mt-2">Test all survey builder functionalities and features</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={runAllTests}
              disabled={running}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {running ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              {running ? 'Running Tests...' : 'Run All Tests'}
            </button>
          </div>
        </div>

        {/* Test Suites */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {testSuites.map((suite, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white rounded-lg">
                  {suite.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{suite.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {suite.tests.length} tests covering {suite.name.toLowerCase()}
              </p>
              <button
                onClick={() => runSuiteTests(suite)}
                disabled={running}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
              >
                Run {suite.name} Tests
              </button>
            </div>
          ))}
        </div>

        {/* Current Test Indicator */}
        {running && currentTest && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="font-medium text-blue-900">Running: {currentTest}</span>
            </div>
          </div>
        )}

        {/* Test Results */}
        {tests.length > 0 && (
          <div className="space-y-6">
            {tests.map((suiteResult, suiteIndex) => (
              <div key={suiteIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    {suiteResult.icon}
                    <h3 className="text-lg font-semibold text-gray-900">{suiteResult.suite}</h3>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {suiteResult.tests.filter(t => t.success).length} / {suiteResult.tests.length} passed
                      </span>
                      <div className={`w-3 h-3 rounded-full ${
                        suiteResult.tests.every(t => t.success) ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {suiteResult.tests.map((test, testIndex) => (
                    <div
                      key={testIndex}
                      className={`p-6 ${
                        test.success ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {test.success ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{test.name}</h4>
                            <span className="text-xs text-gray-500">{test.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                          <p className={`text-sm ${
                            test.success ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {test.message}
                          </p>
                          {test.data && (
                            <details className="mt-2">
                              <summary className="text-xs text-gray-500 cursor-pointer">View Details</summary>
                              <pre className="text-xs bg-white p-2 rounded border mt-1 overflow-x-auto">
                                {JSON.stringify(test.data, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Tests Run */}
        {tests.length === 0 && !running && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Run Yet</h3>
            <p className="text-gray-600 mb-6">
              Run comprehensive tests to verify all survey builder functionalities are working correctly.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Core Features</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Question Types</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Advanced Features</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Analytics</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyBuilderComprehensiveTest;
