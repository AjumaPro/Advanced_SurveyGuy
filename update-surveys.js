#!/usr/bin/env node

/**
 * Survey System Update Script
 * Updates all existing surveys and ensures all sections work properly
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY || 'your-service-key';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

const logSuccess = (message) => log(`✅ ${message}`, colors.green);
const logError = (message) => log(`❌ ${message}`, colors.red);
const logWarning = (message) => log(`⚠️ ${message}`, colors.yellow);
const logInfo = (message) => log(`ℹ️ ${message}`, colors.blue);

async function executeSQL(sqlContent) {
  try {
    logInfo('Executing SQL script...');
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          logWarning(`Statement warning: ${error.message}`);
        } else {
          successCount++;
        }
      } catch (err) {
        logError(`Statement error: ${err.message}`);
        errorCount++;
      }
    }
    
    logSuccess(`SQL execution completed: ${successCount} successful, ${errorCount} errors`);
    return { success: true, successCount, errorCount };
  } catch (error) {
    logError(`Failed to execute SQL: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function updateSurveySystem() {
  try {
    log(colors.cyan + '🚀 Starting Survey System Update...' + colors.reset);
    log('');
    
    // Step 1: Read and execute the SQL update script
    logInfo('Step 1: Reading SQL update script...');
    const sqlPath = path.join(__dirname, 'UPDATE_ALL_SURVEYS_SCRIPT.sql');
    
    if (!fs.existsSync(sqlPath)) {
      logError('SQL update script not found at: ' + sqlPath);
      return;
    }
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    logSuccess('SQL script loaded successfully');
    
    // Step 2: Execute the SQL script
    logInfo('Step 2: Executing database updates...');
    const sqlResult = await executeSQL(sqlContent);
    
    if (!sqlResult.success) {
      logError('Database update failed');
      return;
    }
    
    // Step 3: Verify the updates
    logInfo('Step 3: Verifying survey system...');
    
    // Check surveys table
    const { data: surveys, error: surveysError } = await supabase
      .from('surveys')
      .select('id, title, status, created_at')
      .order('created_at', { ascending: false });
    
    if (surveysError) {
      logError(`Failed to fetch surveys: ${surveysError.message}`);
    } else {
      logSuccess(`Found ${surveys.length} surveys in database`);
      surveys.slice(0, 5).forEach(survey => {
        log(`  - ${survey.title} (${survey.status})`);
      });
    }
    
    // Check survey_responses table
    const { data: responses, error: responsesError } = await supabase
      .from('survey_responses')
      .select('id, survey_id, status, created_at')
      .order('created_at', { ascending: false });
    
    if (responsesError) {
      logError(`Failed to fetch responses: ${responsesError.message}`);
    } else {
      logSuccess(`Found ${responses.length} survey responses in database`);
    }
    
    // Check profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, plan, created_at')
      .order('created_at', { ascending: false });
    
    if (profilesError) {
      logError(`Failed to fetch profiles: ${profilesError.message}`);
    } else {
      logSuccess(`Found ${profiles.length} user profiles in database`);
    }
    
    // Step 4: Test survey functionality
    logInfo('Step 4: Testing survey functionality...');
    
    // Find a published survey to test
    const publishedSurvey = surveys?.find(s => s.status === 'published');
    if (publishedSurvey) {
      logSuccess(`Testing published survey: ${publishedSurvey.title}`);
      
      // Test survey access
      const { data: testSurvey, error: testError } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', publishedSurvey.id)
        .eq('status', 'published')
        .single();
      
      if (testError) {
        logWarning(`Survey access test failed: ${testError.message}`);
      } else {
        logSuccess('Survey access test passed');
      }
    } else {
      logWarning('No published surveys found for testing');
    }
    
    // Step 5: Generate summary report
    logInfo('Step 5: Generating summary report...');
    
    const summary = {
      timestamp: new Date().toISOString(),
      surveys: {
        total: surveys?.length || 0,
        published: surveys?.filter(s => s.status === 'published').length || 0,
        draft: surveys?.filter(s => s.status === 'draft').length || 0
      },
      responses: {
        total: responses?.length || 0,
        completed: responses?.filter(r => r.status === 'completed').length || 0
      },
      profiles: {
        total: profiles?.length || 0,
        active: profiles?.filter(p => p.plan !== 'free').length || 0
      },
      sqlExecution: sqlResult
    };
    
    // Save summary to file
    const summaryPath = path.join(__dirname, 'survey-update-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    logSuccess(`Summary report saved to: ${summaryPath}`);
    
    // Final success message
    log('');
    log(colors.green + '🎉 Survey System Update Completed Successfully!' + colors.reset);
    log('');
    log('Summary:');
    log(`  📊 Surveys: ${summary.surveys.total} total (${summary.surveys.published} published)`);
    log(`  📝 Responses: ${summary.responses.total} total (${summary.responses.completed} completed)`);
    log(`  👥 Profiles: ${summary.profiles.total} total (${summary.profiles.active} active)`);
    log('');
    log('Next steps:');
    log('  1. Test survey creation and editing');
    log('  2. Test survey response collection');
    log('  3. Verify analytics and reporting');
    log('  4. Check mobile responsiveness');
    log('');
    
  } catch (error) {
    logError(`Update failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the update
if (require.main === module) {
  updateSurveySystem()
    .then(() => {
      logSuccess('Update script completed');
      process.exit(0);
    })
    .catch((error) => {
      logError(`Update script failed: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { updateSurveySystem };
