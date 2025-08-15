import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Plus,
  Save,
  Eye,
  Trash2,
  Copy,
  GripVertical,
  Smile,
  List,
  Type,
  BarChart3,
  Upload,
  CheckSquare,
  ChevronDown,
  Star,
  Calendar,
  Clock,
  Phone,
  Mail,
  Globe,
  Hash,
  PenTool,
  Grid,
  Table,
  FileText,
  ArrowLeftRight,
  ArrowUpDown,
  MessageSquare,
  Image,
  Volume2,
  Video,
  Sliders,
  TrendingUp,
  Cloud,
  Move,
  Target,
  Settings,
  Loader2,
  Search,
  Brain,
  Sparkles,
  Lightbulb,
  X,
  Users,
  Target as TargetIcon,
  MessageCircle,
  FileCheck,
  Clock as ClockIcon,
  Star as StarIcon
} from 'lucide-react';
import QuestionUpload from '../components/QuestionUpload';
import EmojiScale, { emojiScaleTemplates } from '../components/EmojiScale';

const SurveyBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState({
    title: '',
    description: '',
    status: 'draft'
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [questionViewMode, setQuestionViewMode] = useState('categorized'); // 'categorized' or 'grid'
  const [questionSearch, setQuestionSearch] = useState('');
  
  // AI Features State
  const [showAIFeatures, setShowAIFeatures] = useState(false);
  const [showAIQuestionGenerator, setShowAIQuestionGenerator] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showAIOptimization, setShowAIOptimization] = useState(false);
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiOptimizations, setAiOptimizations] = useState([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [surveyTopic, setSurveyTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [surveyPurpose, setSurveyPurpose] = useState('');

  // Question types definition
  const questionTypes = [
    // Most Common & Basic Types (First)
    { type: 'short_answer', label: 'Short Answer', icon: Type, color: 'text-blue-600', category: 'basic' },
    { type: 'paragraph', label: 'Paragraph', icon: FileText, color: 'text-green-600', category: 'basic' },
    { type: 'multiple_choice', label: 'Multiple Choice', icon: List, color: 'text-purple-600', category: 'basic' },
    { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare, color: 'text-orange-600', category: 'basic' },
    { type: 'dropdown', label: 'Dropdown', icon: ChevronDown, color: 'text-indigo-600', category: 'basic' },
    
    // Rating & Scale Types (Second)
    { type: 'rating', label: 'Rating', icon: Star, color: 'text-pink-600', category: 'scales' },
    { type: 'linear_scale', label: 'Linear Scale', icon: BarChart3, color: 'text-red-600', category: 'scales' },
    { type: 'emoji_scale', label: 'Emoji Scale', icon: Smile, color: 'text-yellow-600', category: 'scales' },
    { type: 'likert_scale', label: 'Likert Scale', icon: BarChart3, color: 'text-teal-600', category: 'scales' },
    { type: 'slider', label: 'Slider', icon: Sliders, color: 'text-orange-800', category: 'scales' },
    
    // Quiz & Assessment Types (Third)
    { type: 'true_false', label: 'True/False', icon: CheckSquare, color: 'text-green-700', category: 'quiz' },
    { type: 'multiple_choice_quiz', label: 'Multiple Choice Quiz', icon: List, color: 'text-red-700', category: 'quiz' },
    { type: 'short_answer_quiz', label: 'Short Answer Quiz', icon: MessageSquare, color: 'text-orange-700', category: 'quiz' },
    { type: 'essay', label: 'Essay', icon: FileText, color: 'text-indigo-700', category: 'quiz' },
    { type: 'fill_blank', label: 'Fill in the Blank', icon: Type, color: 'text-blue-700', category: 'quiz' },
    { type: 'matching', label: 'Matching', icon: ArrowLeftRight, color: 'text-purple-700', category: 'quiz' },
    { type: 'ordering', label: 'Ordering', icon: ArrowUpDown, color: 'text-teal-700', category: 'quiz' },
    { type: 'ranking', label: 'Ranking', icon: TrendingUp, color: 'text-green-800', category: 'quiz' },
    { type: 'numeric', label: 'Numeric Answer', icon: Hash, color: 'text-gray-700', category: 'quiz' },
    { type: 'drag_drop', label: 'Drag & Drop', icon: Move, color: 'text-cyan-700', category: 'quiz' },
    { type: 'hotspot', label: 'Hotspot', icon: Target, color: 'text-pink-700', category: 'quiz' },
    { type: 'word_cloud', label: 'Word Cloud', icon: Cloud, color: 'text-blue-800', category: 'quiz' },
    { type: 'matrix', label: 'Matrix', icon: Table, color: 'text-purple-800', category: 'quiz' },
    { type: 'image_choice', label: 'Image Choice', icon: Image, color: 'text-indigo-800', category: 'quiz' },
    { type: 'audio_question', label: 'Audio Question', icon: Volume2, color: 'text-teal-800', category: 'quiz' },
    { type: 'video_question', label: 'Video Question', icon: Video, color: 'text-red-800', category: 'quiz' },
    
    // Input & Data Collection Types (Fourth)
    { type: 'number', label: 'Number', icon: Hash, color: 'text-gray-600', category: 'input' },
    { type: 'date', label: 'Date', icon: Calendar, color: 'text-teal-600', category: 'datetime' },
    { type: 'time', label: 'Time', icon: Clock, color: 'text-cyan-600', category: 'datetime' },
    { type: 'phone', label: 'Phone', icon: Phone, color: 'text-emerald-600', category: 'contact' },
    { type: 'email', label: 'Email', icon: Mail, color: 'text-blue-500', category: 'contact' },
    { type: 'url', label: 'Website', icon: Globe, color: 'text-violet-600', category: 'contact' },
    
    // File & Media Types (Fifth)
    { type: 'file_upload', label: 'File Upload', icon: Upload, color: 'text-amber-600', category: 'files' },
    { type: 'signature', label: 'Signature', icon: PenTool, color: 'text-rose-600', category: 'files' },
    
    // Grid & Complex Types (Last)
    { type: 'checkbox_grid', label: 'Checkbox Grid', icon: Grid, color: 'text-lime-600', category: 'grids' },
    { type: 'multiple_choice_grid', label: 'Multiple Choice Grid', icon: Table, color: 'text-slate-600', category: 'grids' }
  ];
  
  // Filter question types based on search
  const filteredTypes = questionTypes.filter(type =>
    type.label.toLowerCase().includes(questionSearch.toLowerCase())
  );

  const fetchSurvey = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/surveys/${id}`);
      console.log('Survey fetched:', response.data);
      console.log('Questions loaded:', response.data.questions?.length || 0);
      setSurvey(response.data);
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Error fetching survey:', error);
      toast.error('Failed to load survey');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchSurvey();
    }
  }, [id, fetchSurvey]);

  // Debug effect to log questions changes
  useEffect(() => {
    console.log('Questions updated:', questions.length, 'questions');
    if (questions.length > 0) {
      console.log('First question:', questions[0]);
    }
  }, [questions]);

  const saveSurvey = async () => {
    try {
      setLoading(true);
      const surveyData = {
        ...survey,
        questions: questions.map((q, index) => ({ ...q, order_index: index }))
      };

      if (id) {
        await axios.put(`/api/surveys/${id}`, surveyData);
        toast.success('Survey updated successfully');
      } else {
        const response = await axios.post('/api/surveys', surveyData);
        toast.success('Survey created successfully');
        navigate(`/app/builder/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error saving survey:', error);
      toast.error('Failed to save survey');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQuestions(items);
  };

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type,
      title: '',
      description: '',
      required: false,
      options: type === 'emoji_scale' ? emojiScaleTemplates.satisfaction : [],
      settings: {}
    };

    setQuestions([...questions, newQuestion]);
    setShowQuestionModal(false);
  };

  const updateQuestion = (questionId, updates) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ));
  };

  const deleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const duplicateQuestion = (question) => {
    const duplicated = {
      ...question,
      id: Date.now(),
      title: `${question.title} (Copy)`
    };
    setQuestions([...questions, duplicated]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // AI Question Templates
  const aiQuestionTemplates = {
    customer_satisfaction: {
      name: 'Customer Satisfaction',
      description: 'Measure customer satisfaction and loyalty',
      icon: StarIcon,
      questions: [
        'How satisfied are you with our overall service?',
        'How likely are you to recommend us to others?',
        'What aspects of our service could be improved?',
        'How would you rate our customer support?',
        'What is your primary reason for choosing our service?'
      ],
      category: 'Business'
    },
    employee_engagement: {
      name: 'Employee Engagement',
      description: 'Assess employee satisfaction and engagement',
      icon: Users,
      questions: [
        'How satisfied are you with your current role?',
        'Do you feel valued and recognized at work?',
        'How would you rate your work-life balance?',
        'Do you see opportunities for growth in this company?',
        'How would you rate the company culture?'
      ],
      category: 'HR'
    },
    market_research: {
      name: 'Market Research',
      description: 'Gather market insights and consumer preferences',
      icon: TargetIcon,
      questions: [
        'What factors influence your purchasing decisions?',
        'How do you prefer to discover new products?',
        'What is your preferred price range for this type of product?',
        'Which features are most important to you?',
        'How do you compare us to our competitors?'
      ],
      category: 'Marketing'
    },
    product_feedback: {
      name: 'Product Feedback',
      description: 'Collect detailed product feedback and suggestions',
      icon: FileCheck,
      questions: [
        'How would you rate the overall product quality?',
        'Which features do you use most frequently?',
        'What additional features would you like to see?',
        'How intuitive is the user interface?',
        'What problems have you encountered while using the product?'
      ],
      category: 'Product'
    },
    academic_research: {
      name: 'Academic Research',
      description: 'Research-focused surveys with statistical analysis',
      icon: MessageCircle,
      questions: [
        'What is your current level of education?',
        'How much time do you spend studying daily?',
        'What study methods do you find most effective?',
        'How would you rate the quality of your education?',
        'What challenges do you face in your academic journey?'
      ],
      category: 'Education'
    }
  };

  // AI Functions
  const generateAIQuestions = async (template, topic, audience, purpose) => {
    setIsGeneratingAI(true);
    try {
      // Simulate AI question generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const baseQuestions = template ? aiQuestionTemplates[template].questions : [
        `How satisfied are you with ${topic || 'our service'}?`,
        `What aspects of ${topic || 'our service'} could be improved?`,
        `How would you rate your experience with ${topic || 'our service'}?`,
        `What would make ${topic || 'our service'} better for ${audience || 'users'}?`,
        `How likely are you to recommend ${topic || 'our service'} to others?`
      ];

      const contextualQuestions = baseQuestions.map(q => ({
        text: q,
        type: 'multiple_choice',
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
        required: true
      }));

      setAiGeneratedQuestions(contextualQuestions);
      toast.success('AI questions generated successfully!');
    } catch (error) {
      console.error('Error generating AI questions:', error);
      toast.error('Failed to generate AI questions');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const getAISuggestions = async () => {
    try {
      // Simulate AI suggestions
      const suggestions = [
        'Consider adding demographic questions for better segmentation',
        'Include a mix of closed and open-ended questions',
        'Add a progress indicator to improve completion rates',
        'Use rating scales for quantitative analysis',
        'Consider mobile-optimized question formats',
        'Add follow-up questions for deeper insights',
        'Include a "Not Applicable" option for relevant questions',
        'Use clear, simple language to avoid confusion',
        'Consider the survey length to prevent drop-offs',
        'Add a thank you message at the end'
      ];
      
      setAiSuggestions(suggestions);
      toast.success('AI suggestions generated!');
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast.error('Failed to get AI suggestions');
    }
  };

  const getAIOptimizations = async () => {
    try {
      // Simulate AI optimizations
      const optimizations = [
        {
          type: 'question_flow',
          title: 'Question Flow Optimization',
          description: 'Reorder questions for better user experience',
          action: 'Reorder questions from general to specific',
          impact: 'High'
        },
        {
          type: 'mobile_optimization',
          title: 'Mobile Optimization',
          description: 'Improve mobile survey experience',
          action: 'Use larger touch targets and simplified layouts',
          impact: 'Medium'
        },
        {
          type: 'completion_rate',
          title: 'Completion Rate Improvement',
          description: 'Increase survey completion rates',
          action: 'Add progress bar and estimated completion time',
          impact: 'High'
        },
        {
          type: 'question_clarity',
          title: 'Question Clarity',
          description: 'Improve question clarity and understanding',
          action: 'Simplify complex questions and add examples',
          impact: 'Medium'
        }
      ];
      
      setAiOptimizations(optimizations);
      toast.success('AI optimizations generated!');
    } catch (error) {
      console.error('Error getting AI optimizations:', error);
      toast.error('Failed to get AI optimizations');
    }
  };

  const applyAITemplate = (templateKey) => {
    const template = aiQuestionTemplates[templateKey];
    if (template) {
      const templateQuestions = template.questions.map((question, index) => ({
        id: `ai_${Date.now()}_${index}`,
        text: question,
        type: 'multiple_choice',
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
        required: true,
        order: questions.length + index
      }));
      
      setQuestions([...questions, ...templateQuestions]);
      toast.success(`${template.name} template applied!`);
    }
  };

  const addAIGeneratedQuestion = (question) => {
    const newQuestion = {
      id: `ai_${Date.now()}`,
      text: question.text,
      type: question.type,
      options: question.options || [],
      required: question.required || false,
      order: questions.length
    };
    
    setQuestions([...questions, newQuestion]);
    toast.success('AI question added to survey!');
  };

  // Close AI dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAIFeatures && !event.target.closest('.ai-features-dropdown')) {
        setShowAIFeatures(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAIFeatures]);

  const handleQuestionsUploaded = (uploadedQuestions) => {
    const questionsWithIds = uploadedQuestions.map((q, index) => ({
      ...q,
      id: Date.now() + index,
      order_index: questions.length + index
    }));
    setQuestions([...questions, ...questionsWithIds]);
  };

  const renderQuestionEditor = (question) => {
    switch (question.type) {
      case 'short_answer':
      case 'paragraph':
      case 'text':
      case 'essay':
      case 'short_answer_quiz':
        return <TextEditor question={question} updateQuestion={updateQuestion} />;
      case 'multiple_choice':
      case 'checkbox':
      case 'multiple_choice_quiz':
        return <MultipleChoiceEditor question={question} updateQuestion={updateQuestion} />;
      case 'dropdown':
        return <DropdownEditor question={question} updateQuestion={updateQuestion} />;
      case 'linear_scale':
        return <LinearScaleEditor question={question} updateQuestion={updateQuestion} />;
      case 'emoji_scale':
        return <EmojiScaleEditor question={question} updateQuestion={updateQuestion} />;
      case 'rating':
        return <RatingEditor question={question} updateQuestion={updateQuestion} />;
      case 'date':
      case 'time':
      case 'phone':
      case 'email':
      case 'url':
      case 'number':
      case 'numeric':
        return <BasicEditor question={question} updateQuestion={updateQuestion} />;
      case 'file_upload':
        return <FileUploadEditor question={question} updateQuestion={updateQuestion} />;
      case 'signature':
        return <SignatureEditor question={question} updateQuestion={updateQuestion} />;
      case 'checkbox_grid':
      case 'multiple_choice_grid':
      case 'matrix':
        return <GridEditor question={question} updateQuestion={updateQuestion} />;
      case 'likert_scale':
        return <LikertScaleEditor question={question} updateQuestion={updateQuestion} />;
      case 'true_false':
        return <TrueFalseEditor question={question} updateQuestion={updateQuestion} />;
      case 'matching':
        return <MatchingEditor question={question} updateQuestion={updateQuestion} />;
      case 'fill_blank':
        return <FillBlankEditor question={question} updateQuestion={updateQuestion} />;
      case 'ordering':
        return <OrderingEditor question={question} updateQuestion={updateQuestion} />;
      case 'hotspot':
        return <HotspotEditor question={question} updateQuestion={updateQuestion} />;
      case 'drag_drop':
        return <DragDropEditor question={question} updateQuestion={updateQuestion} />;
      case 'word_cloud':
        return <WordCloudEditor question={question} updateQuestion={updateQuestion} />;
      case 'ranking':
        return <RankingEditor question={question} updateQuestion={updateQuestion} />;
      case 'slider':
        return <SliderEditor question={question} updateQuestion={updateQuestion} />;
      case 'image_choice':
        return <ImageChoiceEditor question={question} updateQuestion={updateQuestion} />;
      case 'audio_question':
        return <AudioQuestionEditor question={question} updateQuestion={updateQuestion} />;
      case 'video_question':
        return <VideoQuestionEditor question={question} updateQuestion={updateQuestion} />;
      default:
        return <div>Question type not supported</div>;
    }
  };

  const renderQuestionPreview = (question) => {
    switch (question.type) {
      case 'emoji_scale':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <EmojiScale options={question.options} />
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      case 'multiple_choice':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <label key={index} className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <input type="radio" name={`preview-${question.id}`} className="mr-3" disabled />
                  <span className="text-gray-700">{typeof option === 'object' ? option.label || option.value : option}</span>
                </label>
              ))}
            </div>
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      case 'checkbox':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <label key={index} className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" className="mr-3" disabled />
                  <span className="text-gray-700">{typeof option === 'object' ? option.label || option.value : option}</span>
                </label>
              ))}
            </div>
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      case 'dropdown':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <select className="w-full p-2 border rounded bg-gray-50" disabled>
              <option>Select an option...</option>
              {question.options?.map((option, index) => (
                <option key={index} value={index}>
                  {typeof option === 'object' ? option.label || option.value : option}
                </option>
              ))}
            </select>
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      case 'linear_scale':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{question.settings?.min_label || '1'}</span>
              <div className="flex space-x-2">
                {Array.from({ length: (question.settings?.max || 5) - (question.settings?.min || 1) + 1 }, (_, i) => (
                  <label key={i} className="flex flex-col items-center">
                    <input type="radio" name={`scale-${question.id}`} className="mb-1" disabled />
                    <span className="text-xs text-gray-600">{i + (question.settings?.min || 1)}</span>
                  </label>
                ))}
              </div>
              <span className="text-sm text-gray-600">{question.settings?.max_label || '5'}</span>
            </div>
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      case 'rating':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <div className="flex items-center space-x-2">
              {Array.from({ length: question.settings?.max_rating || 5 }, (_, i) => (
                <button key={i} className="text-2xl text-gray-300 hover:text-yellow-400" disabled>
                  ★
                </button>
              ))}
            </div>
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      case 'short_answer':
      case 'paragraph':
      case 'text':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            {question.type === 'short_answer' ? (
              <input 
                type="text" 
                className="w-full p-2 border rounded bg-gray-50" 
                placeholder="Your answer..." 
                disabled 
              />
            ) : (
              <textarea 
                className="w-full p-2 border rounded bg-gray-50" 
                rows="3" 
                placeholder="Your answer..." 
                disabled 
              />
            )}
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      case 'date':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <input 
              type="date" 
              className="w-full p-2 border rounded bg-gray-50" 
              disabled 
            />
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      case 'time':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <input 
              type="time" 
              className="w-full p-2 border rounded bg-gray-50" 
              disabled 
            />
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      case 'phone':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <input 
              type="tel" 
              className="w-full p-2 border rounded bg-gray-50" 
              placeholder="Enter phone number..." 
              disabled 
            />
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      case 'email':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <input 
              type="email" 
              className="w-full p-2 border rounded bg-gray-50" 
              placeholder="Enter email address..." 
              disabled 
            />
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      case 'url':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <input 
              type="url" 
              className="w-full p-2 border rounded bg-gray-50" 
              placeholder="Enter website URL..." 
              disabled 
            />
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      case 'number':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <input 
              type="number" 
              className="w-full p-2 border rounded bg-gray-50" 
              placeholder="Enter number..." 
              disabled 
            />
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      case 'file_upload':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">
                {question.settings?.allowed_types || 'All file types'} • 
                Max {question.settings?.max_size || '10MB'}
              </p>
            </div>
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      case 'signature':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
              <PenTool className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Click to sign</p>
            </div>
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      case 'checkbox_grid':
      case 'multiple_choice_grid':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-50"></th>
                    {question.settings?.columns?.map((col, index) => (
                      <th key={index} className="border p-2 bg-gray-50 text-sm">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {question.settings?.rows?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="border p-2 bg-gray-50 text-sm font-medium">{row}</td>
                      {question.settings?.columns?.map((col, colIndex) => (
                        <td key={colIndex} className="border p-2 text-center">
                          <input 
                            type={question.type === 'checkbox_grid' ? 'checkbox' : 'radio'} 
                            name={`grid-${question.id}-${rowIndex}`}
                            disabled 
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      case 'likert_scale':
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{option}</span>
                  <div className="flex space-x-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <label key={i} className="flex flex-col items-center">
                        <input type="radio" name={`likert-${question.id}-${index}`} className="mb-1" disabled />
                        <span className="text-xs text-gray-600">{i + 1}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
      default:
        return (
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3 text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
            )}
            <p className="text-gray-500 text-sm">Preview not available for this question type</p>
            {question.required && (
              <p className="text-red-600 text-xs mt-2">* Required</p>
            )}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/app/surveys')}
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeftRight className="h-5 w-5 mr-2" />
                <span className="font-medium">Back to Surveys</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-2xl font-bold text-gray-900">
                {id ? 'Edit Survey' : 'Create New Survey'}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
                Preview
          </button>
          <button
            onClick={saveSurvey}
            disabled={loading}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
            <Save className="h-4 w-4 mr-2" />
                    Save Survey
                  </>
                )}
          </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Survey Settings & Questions Section */}
          <div className="xl:col-span-3 space-y-8">
            {/* Survey Settings Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Settings className="h-5 w-5 mr-3" />
                  Survey Settings
                </h2>
        </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Survey Title *
                    </label>
            <input
              type="text"
              value={survey.title}
              onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
                      placeholder="Enter survey title..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={survey.category}
                      onChange={(e) => setSurvey({ ...survey, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select category...</option>
                      <option value="general">General</option>
                      <option value="education">Education</option>
                      <option value="business">Business</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="research">Research</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
            <textarea
              value={survey.description}
              onChange={(e) => setSurvey({ ...survey, description: e.target.value })}
                    placeholder="Enter survey description..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
            />
          </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={survey.isPublic}
                      onChange={(e) => setSurvey({ ...survey, isPublic: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 text-sm font-medium text-gray-700">
                      Public Survey
                    </label>
          </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowAnonymous"
                      checked={survey.allowAnonymous}
                      onChange={(e) => setSurvey({ ...survey, allowAnonymous: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allowAnonymous" className="ml-2 text-sm font-medium text-gray-700">
                      Allow Anonymous
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireLogin"
                      checked={survey.requireLogin}
                      onChange={(e) => setSurvey({ ...survey, requireLogin: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="requireLogin" className="ml-2 text-sm font-medium text-gray-700">
                      Require Login
                    </label>
                  </div>
                </div>
        </div>
      </div>

      {/* Questions Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <List className="h-5 w-5 mr-3" />
                    Survey Questions ({questions.length})
                  </h2>
          <div className="flex items-center space-x-2">
                    <span className="text-white/80 text-sm">
                      {questions.filter(q => q.required).length} required
                    </span>
                    <span className="text-white/60 text-xs">•</span>
                    <span className="text-white/80 text-sm">
                      {questions.filter(q => !q.required).length} optional
                    </span>
          </div>
        </div>
              </div>
              <div className="p-6">
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No questions yet</h3>
                    <p className="text-gray-500 mb-6">Add your first question to get started</p>
              <button
                      onClick={() => addQuestion('short_answer')}
                      className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Question
              </button>
            </div>
          ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                          className="space-y-6"
                  >
                    {questions.map((question, index) => (
                            <Draggable key={question.id} draggableId={question.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                                  className={`bg-gray-50 rounded-lg border-2 transition-all ${
                                    snapshot.isDragging
                                      ? 'border-primary-300 shadow-lg rotate-2'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                        <div
                                          {...provided.dragHandleProps}
                                          className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full cursor-move hover:bg-gray-300 transition-colors"
                                        >
                                          <GripVertical className="h-4 w-4 text-gray-600" />
                                </div>
                                <div className="flex items-center space-x-2">
                                          <span className="text-sm font-semibold text-gray-500">
                                            Q{index + 1}
                                  </span>
                                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                            {question.type.replace('_', ' ')}
                                          </span>
                                          {question.required && (
                                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                              Required
                                            </span>
                                          )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                          onClick={() => duplicateQuestion(index)}
                                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                          title="Duplicate question"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                                <button
                                          onClick={() => removeQuestion(index)}
                                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                          title="Delete question"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                                    {renderQuestionEditor(question, index)}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
              </div>
        </div>
      </div>

          {/* Question Types Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-8 relative">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Sidebar Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white flex items-center">
                      <Plus className="h-5 w-5 mr-2" />
                      Add Questions
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowAIFeatures(!showAIFeatures)}
                        className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                        title="AI Features"
                      >
                        <Brain className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={() => setQuestionViewMode(questionViewMode === 'categorized' ? 'grid' : 'categorized')}
                        className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                        title={`Switch to ${questionViewMode === 'categorized' ? 'grid' : 'categorized'} view`}
                      >
                        {questionViewMode === 'categorized' ? (
                          <Grid className="h-4 w-4 text-white" />
                        ) : (
                          <List className="h-4 w-4 text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search question types..."
                      value={questionSearch}
                      onChange={(e) => setQuestionSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/90 backdrop-blur-sm border-0 rounded-lg text-sm placeholder-gray-500 focus:ring-2 focus:ring-white/50 focus:bg-white transition-all"
                    />
                  </div>
                  
                  {/* Stats */}
                  <div className="mt-2 text-white/80 text-xs">
                    {questionSearch ? (
                      <span>{filteredTypes.length} of {questionTypes.length} types found</span>
                    ) : (
                      <span>{questionTypes.length} types available</span>
                    )}
                  </div>
                </div>

                {/* Sidebar Body */}
                <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {filteredTypes.length === 0 ? (
                    <div className="text-center py-8">
                      <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No question types found</p>
                      <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                    </div>
                  ) : (
                    <div>
                      {questionViewMode === 'categorized' ? (
                        <div className="space-y-6">
                          {/* Basic Questions */}
                          {filteredTypes.filter(t => t.category === 'basic').length > 0 && (
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <div className="flex items-center mb-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                <h4 className="text-sm font-bold text-blue-900">Basic Questions</h4>
                                <span className="ml-auto text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                                  {filteredTypes.filter(t => t.category === 'basic').length}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                {filteredTypes.filter(t => t.category === 'basic').map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.type}
                    onClick={() => addQuestion(type.type)}
                                      className="w-full flex items-center p-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left group shadow-sm"
                  >
                                      <Icon className={`h-4 w-4 mr-3 ${type.color} group-hover:scale-110 transition-transform`} />
                                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
                  </button>
                );
              })}
            </div>
                            </div>
                          )}

                          {/* Scales & Ratings */}
                          {filteredTypes.filter(t => t.category === 'scales').length > 0 && (
                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                              <div className="flex items-center mb-3">
                                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                <h4 className="text-sm font-bold text-purple-900">Scales & Ratings</h4>
                                <span className="ml-auto text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                                  {filteredTypes.filter(t => t.category === 'scales').length}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                {filteredTypes.filter(t => t.category === 'scales').map((type) => {
                                  const Icon = type.icon;
                                  return (
              <button
                                      key={type.type}
                                      onClick={() => addQuestion(type.type)}
                                      className="w-full flex items-center p-3 bg-white border border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-left group shadow-sm"
              >
                                      <Icon className={`h-4 w-4 mr-3 ${type.color} group-hover:scale-110 transition-transform`} />
                                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
              </button>
                                  );
                                })}
            </div>
                            </div>
                          )}

                          {/* Quiz & Assessment */}
                          {filteredTypes.filter(t => t.category === 'quiz').length > 0 && (
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                              <div className="flex items-center mb-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                <h4 className="text-sm font-bold text-green-900">Quiz & Assessment</h4>
                                <span className="ml-auto text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                                  {filteredTypes.filter(t => t.category === 'quiz').length}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                {filteredTypes.filter(t => t.category === 'quiz').map((type) => {
                                  const Icon = type.icon;
                                  return (
                                    <button
                                      key={type.type}
                                      onClick={() => addQuestion(type.type)}
                                      className="w-full flex items-center p-3 bg-white border border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-left group shadow-sm"
                                    >
                                      <Icon className={`h-4 w-4 mr-3 ${type.color} group-hover:scale-110 transition-transform`} />
                                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
                                    </button>
                                  );
                                })}
          </div>
        </div>
      )}

                          {/* Data Collection */}
                          {(filteredTypes.filter(t => t.category === 'input').length > 0 || 
                            filteredTypes.filter(t => t.category === 'datetime').length > 0 ||
                            filteredTypes.filter(t => t.category === 'contact').length > 0) && (
                            <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                              <div className="flex items-center mb-3">
                                <div className="w-3 h-3 bg-teal-500 rounded-full mr-2"></div>
                                <h4 className="text-sm font-bold text-teal-900">Data Collection</h4>
                                <span className="ml-auto text-xs bg-teal-200 text-teal-800 px-2 py-1 rounded-full">
                                  {filteredTypes.filter(t => t.category === 'input' || t.category === 'datetime' || t.category === 'contact').length}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                {filteredTypes.filter(t => t.category === 'input' || t.category === 'datetime' || t.category === 'contact').map((type) => {
                                  const Icon = type.icon;
                                  return (
                                    <button
                                      key={type.type}
                                      onClick={() => addQuestion(type.type)}
                                      className="w-full flex items-center p-3 bg-white border border-teal-200 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all text-left group shadow-sm"
                                    >
                                      <Icon className={`h-4 w-4 mr-3 ${type.color} group-hover:scale-110 transition-transform`} />
                                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Files & Media */}
                          {filteredTypes.filter(t => t.category === 'files').length > 0 && (
                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                              <div className="flex items-center mb-3">
                                <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                                <h4 className="text-sm font-bold text-amber-900">Files & Media</h4>
                                <span className="ml-auto text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
                                  {filteredTypes.filter(t => t.category === 'files').length}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                {filteredTypes.filter(t => t.category === 'files').map((type) => {
                                  const Icon = type.icon;
                                  return (
                                    <button
                                      key={type.type}
                                      onClick={() => addQuestion(type.type)}
                                      className="w-full flex items-center p-3 bg-white border border-amber-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-all text-left group shadow-sm"
                                    >
                                      <Icon className={`h-4 w-4 mr-3 ${type.color} group-hover:scale-110 transition-transform`} />
                                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Grids & Tables */}
                          {filteredTypes.filter(t => t.category === 'grids').length > 0 && (
                            <div className="bg-lime-50 rounded-lg p-4 border border-lime-200">
                              <div className="flex items-center mb-3">
                                <div className="w-3 h-3 bg-lime-500 rounded-full mr-2"></div>
                                <h4 className="text-sm font-bold text-lime-900">Grids & Tables</h4>
                                <span className="ml-auto text-xs bg-lime-200 text-lime-800 px-2 py-1 rounded-full">
                                  {filteredTypes.filter(t => t.category === 'grids').length}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                {filteredTypes.filter(t => t.category === 'grids').map((type) => {
                                  const Icon = type.icon;
                                  return (
                                    <button
                                      key={type.type}
                                      onClick={() => addQuestion(type.type)}
                                      className="w-full flex items-center p-3 bg-white border border-lime-200 rounded-lg hover:border-lime-400 hover:bg-lime-50 transition-all text-left group shadow-sm"
                                    >
                                      <Icon className={`h-4 w-4 mr-3 ${type.color} group-hover:scale-110 transition-transform`} />
                                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {filteredTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                              <button
                                key={type.type}
                                onClick={() => addQuestion(type.type)}
                                className="flex flex-col items-center p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all group"
                              >
                                <Icon className={`h-6 w-6 mb-2 ${type.color} group-hover:scale-110 transition-transform`} />
                                <span className="text-xs font-medium text-gray-700 text-center leading-tight">{type.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sidebar Footer */}
                <div className="bg-gray-50 px-4 py-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Questions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Features Dropdown */}
      {showAIFeatures && (
        <div className="ai-features-dropdown absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-600" />
              AI-Powered Features
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowAIQuestionGenerator(true);
                  setShowAIFeatures(false);
                }}
                className="w-full flex items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all"
              >
                <Sparkles className="w-5 h-5 mr-3 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">AI Question Generation</div>
                  <div className="text-sm text-gray-600">Generate smart survey questions</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowAISuggestions(true);
                  setShowAIFeatures(false);
                }}
                className="w-full flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg hover:from-yellow-100 hover:to-orange-100 transition-all"
              >
                <Lightbulb className="w-5 h-5 mr-3 text-yellow-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">AI Survey Suggestions</div>
                  <div className="text-sm text-gray-600">Get optimization recommendations</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowAIOptimization(true);
                  setShowAIFeatures(false);
                }}
                className="w-full flex items-center p-3 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg hover:from-green-100 hover:to-teal-100 transition-all"
              >
                <TrendingUp className="w-5 h-5 mr-3 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">AI Optimization</div>
                  <div className="text-sm text-gray-600">Optimize survey performance</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Questions Modal */}
      {showUploadModal && (
        <QuestionUpload
          onQuestionsUploaded={handleQuestionsUploaded}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      {/* AI Question Generation Modal */}
      {showAIQuestionGenerator && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                AI Question Generation
              </h3>
              <button
                onClick={() => setShowAIQuestionGenerator(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">AI Question Templates</h4>
                <div className="space-y-3">
                  {Object.entries(aiQuestionTemplates).map(([key, template]) => {
                    const Icon = template.icon;
                    return (
                      <div key={key} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <Icon className="w-4 h-4 mr-2 text-blue-600" />
                            <h5 className="font-medium text-gray-900">{template.name}</h5>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{template.category}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <button
                          onClick={() => applyAITemplate(key)}
                          className="w-full text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Use Template
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Custom Question Generation</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Survey Topic</label>
                    <input
                      type="text"
                      value={surveyTopic}
                      onChange={(e) => setSurveyTopic(e.target.value)}
                      placeholder="e.g., Customer Service, Product Quality"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g., Enterprise Customers, Students"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Survey Purpose</label>
                    <input
                      type="text"
                      value={surveyPurpose}
                      onChange={(e) => setSurveyPurpose(e.target.value)}
                      placeholder="e.g., Improve customer satisfaction, Gather feedback"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => generateAIQuestions(null, surveyTopic, targetAudience, surveyPurpose)}
                    disabled={isGeneratingAI}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center justify-center disabled:opacity-50"
                  >
                    {isGeneratingAI ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Generate AI Questions
                      </>
                    )}
                  </button>
                </div>
                {aiGeneratedQuestions.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Generated Questions:</h5>
                    <div className="space-y-2">
                      {aiGeneratedQuestions.map((question, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                          <p className="text-sm text-gray-700 mb-2">{question.text}</p>
                          <button
                            onClick={() => addAIGeneratedQuestion(question)}
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                          >
                            Add to Survey
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Survey Suggestions Modal */}
      {showAISuggestions && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                AI Survey Suggestions
              </h3>
              <button
                onClick={() => setShowAISuggestions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Smart Recommendations</h4>
                {aiSuggestions.length > 0 ? (
                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                        <p className="text-sm text-gray-700">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Click "Get Suggestions" to generate AI-powered recommendations</p>
                    <button
                      onClick={getAISuggestions}
                      className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                    >
                      Generate Suggestions
                    </button>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Survey Analysis</h4>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Current Survey Stats</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Questions:</span>
                        <span className="ml-2 font-medium">{questions.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Required Questions:</span>
                        <span className="ml-2 font-medium">{questions.filter(q => q.required).length}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Question Types:</span>
                        <span className="ml-2 font-medium">{new Set(questions.map(q => q.type)).size}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Estimated Time:</span>
                        <span className="ml-2 font-medium">{Math.ceil(questions.length * 0.5)} min</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={getAISuggestions}
                    className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center justify-center"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Get AI Suggestions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Optimization Modal */}
      {showAIOptimization && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                AI Survey Optimization
              </h3>
              <button
                onClick={() => setShowAIOptimization(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Optimization Recommendations</h4>
                {aiOptimizations.length > 0 ? (
                  <div className="space-y-3">
                    {aiOptimizations.map((optimization, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">{optimization.title}</h5>
                          <span className={`text-xs px-2 py-1 rounded ${
                            optimization.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {optimization.impact} Impact
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{optimization.description}</p>
                        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">{optimization.action}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Click "Analyze Survey" to get optimization recommendations</p>
                    <button
                      onClick={getAIOptimizations}
                      className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Analyze Survey
                    </button>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Performance Metrics</h4>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Survey Health Score</h5>
                    <div className="flex items-center mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">75%</span>
                    </div>
                    <p className="text-xs text-gray-600">Good survey structure and flow</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-600">{questions.length}</div>
                      <div className="text-xs text-gray-600">Questions</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-green-600">{Math.ceil(questions.length * 0.5)}</div>
                      <div className="text-xs text-gray-600">Est. Minutes</div>
                    </div>
                  </div>
                  <button
                    onClick={getAIOptimizations}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analyze Survey
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Question Editor Components
const EmojiScaleEditor = ({ question, updateQuestion }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('satisfaction');

  const handleTemplateChange = (templateName) => {
    setSelectedTemplate(templateName);
    updateQuestion(question.id, { options: emojiScaleTemplates[templateName] });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Template</label>
        <select
          value={selectedTemplate}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="input mt-1"
        >
          <option value="satisfaction">Satisfaction Scale</option>
          <option value="agreement">Agreement Scale</option>
          <option value="quality">Quality Rating</option>
          <option value="thumbs">Thumbs Up/Down</option>
        </select>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
        <EmojiScale options={question.options} />
      </div>
    </div>
  );
};

const MultipleChoiceEditor = ({ question, updateQuestion }) => {
  const [newOption, setNewOption] = useState('');

  const addOption = () => {
    if (newOption.trim()) {
      updateQuestion(question.id, {
        options: [...(question.options || []), newOption.trim()]
      });
      setNewOption('');
    }
  };

  const removeOption = (index) => {
    const newOptions = question.options.filter((_, i) => i !== index);
    updateQuestion(question.id, { options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Options</label>
        <div className="space-y-2">
          {(question.options || []).map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={typeof option === 'object' ? option.label || option.value || '' : option}
                onChange={(e) => {
                  const newOptions = [...question.options];
                  newOptions[index] = e.target.value;
                  updateQuestion(question.id, { options: newOptions });
                }}
                className="input flex-1"
              />
              <button
                onClick={() => removeOption(index)}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addOption()}
              className="input flex-1"
              placeholder="Add new option"
            />
            <button onClick={addOption} className="btn-primary px-3 py-1">
              Add
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

const TextEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

const LikertScaleEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Scale Range</label>
        <div className="flex items-center space-x-2 mt-1">
          <input
            type="number"
            value={question.settings.min || 1}
            onChange={(e) => updateQuestion(question.id, {
              settings: { ...question.settings, min: parseInt(e.target.value) }
            })}
            className="input w-20"
            min="1"
            max="10"
          />
          <span>to</span>
          <input
            type="number"
            value={question.settings.max || 10}
            onChange={(e) => updateQuestion(question.id, {
              settings: { ...question.settings, max: parseInt(e.target.value) }
            })}
            className="input w-20"
            min="1"
            max="10"
          />
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

// Basic Editor for simple question types
const BasicEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

// Dropdown Editor
const DropdownEditor = ({ question, updateQuestion }) => {
  const addOption = () => {
    const newOptions = [...(question.options || []), `Option ${(question.options || []).length + 1}`];
    updateQuestion(question.id, { options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = question.options.filter((_, i) => i !== index);
    updateQuestion(question.id, { options: newOptions });
  };

  const updateOption = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    updateQuestion(question.id, { options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
        <div className="space-y-2">
          {(question.options || []).map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="input flex-1"
                placeholder={`Option ${index + 1}`}
              />
              <button
                onClick={() => removeOption(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addOption}
            className="btn-secondary text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

// Linear Scale Editor
const LinearScaleEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Minimum Value</label>
          <input
            type="number"
            value={question.settings?.min || 1}
            onChange={(e) => updateQuestion(question.id, {
              settings: { ...question.settings, min: parseInt(e.target.value) }
            })}
            className="input mt-1"
            min="1"
            max="10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Maximum Value</label>
          <input
            type="number"
            value={question.settings?.max || 5}
            onChange={(e) => updateQuestion(question.id, {
              settings: { ...question.settings, max: parseInt(e.target.value) }
            })}
            className="input mt-1"
            min="1"
            max="10"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Min Label (Optional)</label>
          <input
            type="text"
            value={question.settings?.minLabel || ''}
            onChange={(e) => updateQuestion(question.id, {
              settings: { ...question.settings, minLabel: e.target.value }
            })}
            className="input mt-1"
            placeholder="e.g., Not satisfied"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Label (Optional)</label>
          <input
            type="text"
            value={question.settings?.maxLabel || ''}
            onChange={(e) => updateQuestion(question.id, {
              settings: { ...question.settings, maxLabel: e.target.value }
            })}
            className="input mt-1"
            placeholder="e.g., Very satisfied"
          />
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

// Rating Editor
const RatingEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Stars</label>
        <input
          type="number"
          value={question.settings?.max || 5}
          onChange={(e) => updateQuestion(question.id, {
            settings: { ...question.settings, max: parseInt(e.target.value) }
          })}
          className="input mt-1"
          min="1"
          max="10"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

// File Upload Editor
const FileUploadEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Accepted File Types</label>
        <input
          type="text"
          value={question.settings?.accept || ''}
          onChange={(e) => updateQuestion(question.id, {
            settings: { ...question.settings, accept: e.target.value }
          })}
          className="input mt-1"
          placeholder="e.g., .pdf,.doc,.jpg,.png"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`multiple-${question.id}`}
          checked={question.settings?.multiple || false}
          onChange={(e) => updateQuestion(question.id, {
            settings: { ...question.settings, multiple: e.target.checked }
          })}
          className="mr-2"
        />
        <label htmlFor={`multiple-${question.id}`} className="text-sm text-gray-700">
          Allow multiple files
        </label>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

// Signature Editor
const SignatureEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

// Grid Editor
const GridEditor = ({ question, updateQuestion }) => {
  const addRow = () => {
    const newRows = [...(question.settings?.rows || []), `Row ${(question.settings?.rows || []).length + 1}`];
    updateQuestion(question.id, {
      settings: { ...question.settings, rows: newRows }
    });
  };

  const addColumn = () => {
    const newColumns = [...(question.settings?.columns || []), `Column ${(question.settings?.columns || []).length + 1}`];
    updateQuestion(question.id, {
      settings: { ...question.settings, columns: newColumns }
    });
  };

  const removeRow = (index) => {
    const newRows = question.settings?.rows?.filter((_, i) => i !== index) || [];
    updateQuestion(question.id, {
      settings: { ...question.settings, rows: newRows }
    });
  };

  const removeColumn = (index) => {
    const newColumns = question.settings?.columns?.filter((_, i) => i !== index) || [];
    updateQuestion(question.id, {
      settings: { ...question.settings, columns: newColumns }
    });
  };

  const updateRow = (index, value) => {
    const newRows = [...(question.settings?.rows || [])];
    newRows[index] = value;
    updateQuestion(question.id, {
      settings: { ...question.settings, rows: newRows }
    });
  };

  const updateColumn = (index, value) => {
    const newColumns = [...(question.settings?.columns || [])];
    newColumns[index] = value;
    updateQuestion(question.id, {
      settings: { ...question.settings, columns: newColumns }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rows</label>
          <div className="space-y-2">
            {(question.settings?.rows || []).map((row, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={row}
                  onChange={(e) => updateRow(index, e.target.value)}
                  className="input flex-1"
                  placeholder={`Row ${index + 1}`}
                />
                <button
                  onClick={() => removeRow(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addRow}
              className="btn-secondary text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Columns</label>
          <div className="space-y-2">
            {(question.settings?.columns || []).map((column, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={column}
                  onChange={(e) => updateColumn(index, e.target.value)}
                  className="input flex-1"
                  placeholder={`Column ${index + 1}`}
                />
                <button
                  onClick={() => removeColumn(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addColumn}
              className="btn-secondary text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

// Quiz and Exam Question Editors
const TrueFalseEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter true/false question"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
        <select
          value={question.settings?.correct_answer || 'true'}
          onChange={(e) => updateQuestion(question.id, { 
            settings: { ...question.settings, correct_answer: e.target.value }
          })}
          className="input mt-1"
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

const MatchingEditor = ({ question, updateQuestion }) => {
  const addPair = () => {
    const pairs = question.settings?.pairs || [];
    updateQuestion(question.id, {
      settings: { ...question.settings, pairs: [...pairs, { left: '', right: '' }] }
    });
  };

  const removePair = (index) => {
    const pairs = question.settings?.pairs || [];
    const newPairs = pairs.filter((_, i) => i !== index);
    updateQuestion(question.id, {
      settings: { ...question.settings, pairs: newPairs }
    });
  };

  const updatePair = (index, field, value) => {
    const pairs = question.settings?.pairs || [];
    const newPairs = pairs.map((pair, i) => 
      i === index ? { ...pair, [field]: value } : pair
    );
    updateQuestion(question.id, {
      settings: { ...question.settings, pairs: newPairs }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter matching question"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Matching Pairs</label>
        <div className="space-y-2">
          {(question.settings?.pairs || []).map((pair, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={pair.left}
                onChange={(e) => updatePair(index, 'left', e.target.value)}
                className="input flex-1"
                placeholder="Left item"
              />
              <span className="text-gray-500">→</span>
              <input
                type="text"
                value={pair.right}
                onChange={(e) => updatePair(index, 'right', e.target.value)}
                className="input flex-1"
                placeholder="Right item"
              />
              <button
                onClick={() => removePair(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addPair}
            className="btn-secondary text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Pair
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

const FillBlankEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter fill in the blank question"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Text</label>
        <textarea
          value={question.settings?.question_text || ''}
          onChange={(e) => updateQuestion(question.id, { 
            settings: { ...question.settings, question_text: e.target.value }
          })}
          className="input mt-1"
          rows="3"
          placeholder="Enter question text with ___ for blanks"
        />
        <p className="text-xs text-gray-500 mt-1">Use ___ to indicate blank spaces</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Correct Answers</label>
        <div className="space-y-2">
          {(question.settings?.answers || []).map((answer, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={answer}
                onChange={(e) => {
                  const answers = question.settings?.answers || [];
                  const newAnswers = answers.map((a, i) => i === index ? e.target.value : a);
                  updateQuestion(question.id, {
                    settings: { ...question.settings, answers: newAnswers }
                  });
                }}
                className="input flex-1"
                placeholder={`Answer ${index + 1}`}
              />
              <button
                onClick={() => {
                  const answers = question.settings?.answers || [];
                  const newAnswers = answers.filter((_, i) => i !== index);
                  updateQuestion(question.id, {
                    settings: { ...question.settings, answers: newAnswers }
                  });
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const answers = question.settings?.answers || [];
              updateQuestion(question.id, {
                settings: { ...question.settings, answers: [...answers, ''] }
              });
            }}
            className="btn-secondary text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Answer
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

const OrderingEditor = ({ question, updateQuestion }) => {
  const addItem = () => {
    const items = question.settings?.items || [];
    updateQuestion(question.id, {
      settings: { ...question.settings, items: [...items, ''] }
    });
  };

  const removeItem = (index) => {
    const items = question.settings?.items || [];
    const newItems = items.filter((_, i) => i !== index);
    updateQuestion(question.id, {
      settings: { ...question.settings, items: newItems }
    });
  };

  const updateItem = (index, value) => {
    const items = question.settings?.items || [];
    const newItems = items.map((item, i) => i === index ? value : item);
    updateQuestion(question.id, {
      settings: { ...question.settings, items: newItems }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter ordering question"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Items to Order</label>
        <div className="space-y-2">
          {(question.settings?.items || []).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                className="input flex-1"
                placeholder={`Item ${index + 1}`}
              />
              <button
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addItem}
            className="btn-secondary text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

const HotspotEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter hotspot question"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          value={question.settings?.image_url || ''}
          onChange={(e) => updateQuestion(question.id, { 
            settings: { ...question.settings, image_url: e.target.value }
          })}
          className="input mt-1"
          placeholder="Enter image URL"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Hotspot Coordinates</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={question.settings?.hotspot_x || ''}
            onChange={(e) => updateQuestion(question.id, { 
              settings: { ...question.settings, hotspot_x: parseInt(e.target.value) }
            })}
            className="input"
            placeholder="X coordinate"
          />
          <input
            type="number"
            value={question.settings?.hotspot_y || ''}
            onChange={(e) => updateQuestion(question.id, { 
              settings: { ...question.settings, hotspot_y: parseInt(e.target.value) }
            })}
            className="input"
            placeholder="Y coordinate"
          />
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

const DragDropEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter drag & drop question"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Drag Items</label>
        <textarea
          value={question.settings?.drag_items || ''}
          onChange={(e) => updateQuestion(question.id, { 
            settings: { ...question.settings, drag_items: e.target.value }
          })}
          className="input mt-1"
          rows="3"
          placeholder="Enter drag items (one per line)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Drop Zones</label>
        <textarea
          value={question.settings?.drop_zones || ''}
          onChange={(e) => updateQuestion(question.id, { 
            settings: { ...question.settings, drop_zones: e.target.value }
          })}
          className="input mt-1"
          rows="3"
          placeholder="Enter drop zones (one per line)"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

const WordCloudEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter word cloud question"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Max Words</label>
        <input
          type="number"
          value={question.settings?.max_words || 10}
          onChange={(e) => updateQuestion(question.id, { 
            settings: { ...question.settings, max_words: parseInt(e.target.value) }
          })}
          className="input mt-1"
          min="1"
          max="50"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

const RankingEditor = ({ question, updateQuestion }) => {
  const addItem = () => {
    const items = question.settings?.items || [];
    updateQuestion(question.id, {
      settings: { ...question.settings, items: [...items, ''] }
    });
  };

  const removeItem = (index) => {
    const items = question.settings?.items || [];
    const newItems = items.filter((_, i) => i !== index);
    updateQuestion(question.id, {
      settings: { ...question.settings, items: newItems }
    });
  };

  const updateItem = (index, value) => {
    const items = question.settings?.items || [];
    const newItems = items.map((item, i) => i === index ? value : item);
    updateQuestion(question.id, {
      settings: { ...question.settings, items: newItems }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter ranking question"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Items to Rank</label>
        <div className="space-y-2">
          {(question.settings?.items || []).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                className="input flex-1"
                placeholder={`Item ${index + 1}`}
              />
              <button
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addItem}
            className="btn-secondary text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

const SliderEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter slider question"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Min Value</label>
          <input
            type="number"
            value={question.settings?.min || 0}
            onChange={(e) => updateQuestion(question.id, { 
              settings: { ...question.settings, min: parseInt(e.target.value) }
            })}
            className="input mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Value</label>
          <input
            type="number"
            value={question.settings?.max || 100}
            onChange={(e) => updateQuestion(question.id, { 
              settings: { ...question.settings, max: parseInt(e.target.value) }
            })}
            className="input mt-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Min Label</label>
          <input
            type="text"
            value={question.settings?.min_label || ''}
            onChange={(e) => updateQuestion(question.id, { 
              settings: { ...question.settings, min_label: e.target.value }
            })}
            className="input mt-1"
            placeholder="e.g., Not at all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Label</label>
          <input
            type="text"
            value={question.settings?.max_label || ''}
            onChange={(e) => updateQuestion(question.id, { 
              settings: { ...question.settings, max_label: e.target.value }
            })}
            className="input mt-1"
            placeholder="e.g., Very much"
          />
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

const ImageChoiceEditor = ({ question, updateQuestion }) => {
  const addImage = () => {
    const images = question.settings?.images || [];
    updateQuestion(question.id, {
      settings: { ...question.settings, images: [...images, { url: '', label: '' }] }
    });
  };

  const removeImage = (index) => {
    const images = question.settings?.images || [];
    const newImages = images.filter((_, i) => i !== index);
    updateQuestion(question.id, {
      settings: { ...question.settings, images: newImages }
    });
  };

  const updateImage = (index, field, value) => {
    const images = question.settings?.images || [];
    const newImages = images.map((image, i) => 
      i === index ? { ...image, [field]: value } : image
    );
    updateQuestion(question.id, {
      settings: { ...question.settings, images: newImages }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter image choice question"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Image Options</label>
        <div className="space-y-2">
          {(question.settings?.images || []).map((image, index) => (
            <div key={index} className="space-y-2 p-3 border rounded">
              <input
                type="url"
                value={image.url}
                onChange={(e) => updateImage(index, 'url', e.target.value)}
                className="input"
                placeholder="Image URL"
              />
              <input
                type="text"
                value={image.label}
                onChange={(e) => updateImage(index, 'label', e.target.value)}
                className="input"
                placeholder="Image label"
              />
              <button
                onClick={() => removeImage(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove Image
              </button>
            </div>
          ))}
          <button
            onClick={addImage}
            className="btn-secondary text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

const AudioQuestionEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter audio question"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Audio URL</label>
        <input
          type="url"
          value={question.settings?.audio_url || ''}
          onChange={(e) => updateQuestion(question.id, { 
            settings: { ...question.settings, audio_url: e.target.value }
          })}
          className="input mt-1"
          placeholder="Enter audio file URL"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Question After Audio</label>
        <textarea
          value={question.settings?.question_text || ''}
          onChange={(e) => updateQuestion(question.id, { 
            settings: { ...question.settings, question_text: e.target.value }
          })}
          className="input mt-1"
          rows="3"
          placeholder="Enter the question to ask after playing the audio"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

const VideoQuestionEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter video question"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Video URL</label>
        <input
          type="url"
          value={question.settings?.video_url || ''}
          onChange={(e) => updateQuestion(question.id, { 
            settings: { ...question.settings, video_url: e.target.value }
          })}
          className="input mt-1"
          placeholder="Enter video URL (YouTube, Vimeo, etc.)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Question After Video</label>
        <textarea
          value={question.settings?.question_text || ''}
          onChange={(e) => updateQuestion(question.id, { 
            settings: { ...question.settings, question_text: e.target.value }
          })}
          className="input mt-1"
          rows="3"
          placeholder="Enter the question to ask after watching the video"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

export default SurveyBuilder; 