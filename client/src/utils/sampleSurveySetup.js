import { supabase } from '../lib/supabase';
import { sampleSurveys } from '../data/sampleSurveys';

// Function to create sample surveys in the database
export const createSampleSurveys = async () => {
  try {
    console.log('🔄 Creating sample surveys...');
    
    const surveyInserts = sampleSurveys.map(survey => ({
      id: `sample-${survey.id}`,
      title: survey.title,
      description: survey.description,
      questions: survey.questions,
      settings: {
        allowAnonymous: true,
        collectEmail: false,
        showProgress: true,
        randomizeQuestions: false,
        requireAll: false,
        theme: 'modern',
        brandColor: '#3B82F6'
      },
      is_public: true,
      is_template: true,
      template_category: survey.category,
      template_industry: survey.industry,
      estimated_time: survey.estimatedTime,
      user_id: '00000000-0000-0000-0000-000000000000', // System user
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('surveys')
      .upsert(surveyInserts, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('❌ Error creating sample surveys:', error);
      throw error;
    }

    console.log('✅ Sample surveys created successfully:', data);
    return { success: true, count: surveyInserts.length };
    
  } catch (error) {
    console.error('❌ Failed to create sample surveys:', error);
    return { success: false, error: error.message };
  }
};

// Function to check if sample surveys exist
export const checkSampleSurveysExist = async () => {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('id')
      .eq('is_template', true)
      .eq('is_public', true)
      .limit(1);

    if (error) throw error;
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking sample surveys:', error);
    return false;
  }
};

// Function to get template categories
export const getTemplateCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('template_category')
      .eq('is_template', true)
      .eq('is_public', true);

    if (error) throw error;
    
    const categories = [...new Set(data.map(item => item.template_category).filter(Boolean))];
    return categories;
  } catch (error) {
    console.error('Error getting template categories:', error);
    return [];
  }
};

// Function to get template industries
export const getTemplateIndustries = async () => {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('template_industry')
      .eq('is_template', true)
      .eq('is_public', true);

    if (error) throw error;
    
    const industries = [...new Set(data.map(item => item.template_industry).filter(Boolean))];
    return industries;
  } catch (error) {
    console.error('Error getting template industries:', error);
    return [];
  }
};

// Function to clone a template survey for a user
export const cloneTemplateSurvey = async (templateId, userId, newTitle = null) => {
  try {
    const { data, error } = await supabase.rpc('clone_template_survey', {
      template_id: templateId,
      user_id: userId,
      new_title: newTitle
    });

    if (error) throw error;
    
    return { success: true, surveyId: data };
  } catch (error) {
    console.error('Error cloning template survey:', error);
    return { success: false, error: error.message };
  }
};

export default {
  createSampleSurveys,
  checkSampleSurveysExist,
  getTemplateCategories,
  getTemplateIndustries,
  cloneTemplateSurvey
};
