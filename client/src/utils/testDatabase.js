/**
 * Database connection test utility
 * This helps diagnose database connectivity issues
 */

import { supabase } from '../lib/supabase';

export const testDatabaseConnection = async () => {
  console.log('🔍 Testing database connection...');
  
  try {
    // Test 1: Basic connection
    console.log('📡 Testing basic Supabase connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('surveys')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Database connection failed:', connectionError);
      return { success: false, error: connectionError.message };
    }
    
    console.log('✅ Database connection successful');
    
    // Test 2: Check surveys table
    console.log('📊 Checking surveys table...');
    const { data: surveys, error: surveysError } = await supabase
      .from('surveys')
      .select('id, title, status, created_at')
      .limit(5);
    
    if (surveysError) {
      console.error('❌ Surveys table query failed:', surveysError);
      return { success: false, error: surveysError.message };
    }
    
    console.log('✅ Surveys table accessible');
    console.log('📋 Found surveys:', surveys);
    
    // Test 3: Check specific survey ID
    const testSurveyId = '85ec5b20-5af6-4479-8bd8-34ae409e2d64';
    console.log(`🔍 Checking for survey ID: ${testSurveyId}`);
    
    const { data: specificSurvey, error: specificError } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', testSurveyId)
      .single();
    
    if (specificError) {
      console.error('❌ Specific survey query failed:', specificError);
      console.log('📝 This means the survey either doesn\'t exist or there\'s a query issue');
    } else {
      console.log('✅ Specific survey found:', specificSurvey);
    }
    
    // Test 4: Check published surveys
    console.log('📢 Checking published surveys...');
    const { data: publishedSurveys, error: publishedError } = await supabase
      .from('surveys')
      .select('id, title, status, created_at')
      .eq('status', 'published')
      .limit(10);
    
    if (publishedError) {
      console.error('❌ Published surveys query failed:', publishedError);
    } else {
      console.log('✅ Published surveys found:', publishedSurveys);
    }
    
    return { 
      success: true, 
      surveys: surveys,
      specificSurvey: specificSurvey,
      publishedSurveys: publishedSurveys
    };
    
  } catch (error) {
    console.error('💥 Database test failed:', error);
    return { success: false, error: error.message };
  }
};

export const testSurveyAccess = async (surveyId) => {
  console.log(`🔍 Testing access to survey: ${surveyId}`);
  
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', surveyId)
      .eq('status', 'published')
      .single();
    
    if (error) {
      console.error('❌ Survey access test failed:', error);
      return { success: false, error: error.message, survey: null };
    }
    
    console.log('✅ Survey access successful:', data);
    return { success: true, survey: data, error: null };
    
  } catch (error) {
    console.error('💥 Survey access test exception:', error);
    return { success: false, error: error.message, survey: null };
  }
};

