const { query } = require('./connection');

const createTables = async () => {
  try {
    console.log('🗄️ Setting up database tables...');

    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Surveys table
    await query(`
      CREATE TABLE IF NOT EXISTS surveys (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'draft',
        theme JSONB DEFAULT '{}',
        settings JSONB DEFAULT '{}',
        completion_rate DECIMAL(5,2) DEFAULT 0,
        total_responses INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create questions table with enhanced question types
    await query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        survey_id INTEGER REFERENCES surveys(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        required BOOLEAN DEFAULT false,
        options JSONB DEFAULT '[]',
        settings JSONB DEFAULT '{}',
        validation JSONB DEFAULT '{}',
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Responses table
    await query(`
      CREATE TABLE IF NOT EXISTS responses (
        id SERIAL PRIMARY KEY,
        survey_id INTEGER REFERENCES surveys(id) ON DELETE CASCADE,
        question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
        answer JSONB NOT NULL,
        respondent_id VARCHAR(255),
        session_id VARCHAR(255),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Images table for custom assets
    await query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        size INTEGER NOT NULL,
        url VARCHAR(500) NOT NULL,
        firebase_path VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Survey templates table
    await query(`
      CREATE TABLE IF NOT EXISTS survey_templates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        subcategory VARCHAR(100),
        template_data JSONB NOT NULL,
        is_public BOOLEAN DEFAULT false,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Survey categories table
    await query(`
      CREATE TABLE IF NOT EXISTS survey_categories (
        id SERIAL PRIMARY KEY,
        category_key VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(10),
        color VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Survey subcategories table
    await query(`
      CREATE TABLE IF NOT EXISTS survey_subcategories (
        id SERIAL PRIMARY KEY,
        category_key VARCHAR(100) REFERENCES survey_categories(category_key),
        subcategory_key VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(10),
        template_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(category_key, subcategory_key)
      )
    `);

    // Create subscriptions table
    await query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        survey_id INTEGER REFERENCES surveys(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        plan_id VARCHAR(50) DEFAULT 'free',
        status VARCHAR(50) DEFAULT 'active',
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create subscription_preferences table
    await query(`
      CREATE TABLE IF NOT EXISTS subscription_preferences (
        id SERIAL PRIMARY KEY,
        subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE CASCADE,
        email_notifications BOOLEAN DEFAULT true,
        survey_updates BOOLEAN DEFAULT true,
        new_surveys BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create subscriptions table for payments
    await query(`
      CREATE TABLE IF NOT EXISTS payment_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        plan_id VARCHAR(50) NOT NULL,
        plan_name VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'GHS',
        interval VARCHAR(20) DEFAULT 'monthly',
        status VARCHAR(50) DEFAULT 'active',
        payment_transaction_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        cancelled_at TIMESTAMP
      )
    `);

    // Create payment_intents table for Paystack
    await query(`
      CREATE TABLE IF NOT EXISTS payment_intents (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        plan_id VARCHAR(50) NOT NULL,
        plan_name VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'GHS',
        reference VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_transaction_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create pending_payments table for incomplete payments
    await query(`
      CREATE TABLE IF NOT EXISTS pending_payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        payment_intent_id INTEGER REFERENCES payment_intents(id) ON DELETE CASCADE,
        plan_id VARCHAR(50) NOT NULL,
        plan_name VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'GHS',
        reference VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add subscription fields to users table
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(50) DEFAULT 'free',
      ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'active'
    `);

    // Add currency field to existing payment_subscriptions table if it doesn't exist
    await query(`
      ALTER TABLE payment_subscriptions 
      ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'GHS'
    `);

    // Add payment_transaction_id field to existing payment_intents table if it doesn't exist
    await query(`
      ALTER TABLE payment_intents 
      ADD COLUMN IF NOT EXISTS payment_transaction_id VARCHAR(255)
    `);

    // Add admin-specific fields to users table
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS approved_by INTEGER REFERENCES users(id),
      ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS admin_notes TEXT
    `);

    // Create admin_audit_log table for tracking admin actions
    await query(`
      CREATE TABLE IF NOT EXISTS admin_audit_log (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        target_type VARCHAR(50) NOT NULL,
        target_id INTEGER,
        details JSONB DEFAULT '{}',
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create subscription_packages table for admin-managed packages
    await query(`
      CREATE TABLE IF NOT EXISTS subscription_packages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'GHS',
        interval VARCHAR(20) DEFAULT 'monthly',
        features JSONB DEFAULT '[]',
        max_surveys INTEGER DEFAULT 3,
        max_responses_per_survey INTEGER DEFAULT 50,
        is_active BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create payment_approvals table for admin payment approval
    await query(`
      CREATE TABLE IF NOT EXISTS payment_approvals (
        id SERIAL PRIMARY KEY,
        payment_intent_id INTEGER REFERENCES payment_intents(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'GHS',
        status VARCHAR(50) DEFAULT 'pending',
        admin_id INTEGER REFERENCES users(id),
        approved_at TIMESTAMP,
        rejection_reason TEXT,
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create account_approvals table for admin account approval
    await query(`
      CREATE TABLE IF NOT EXISTS account_approvals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        admin_id INTEGER REFERENCES users(id),
        approved_at TIMESTAMP,
        rejection_reason TEXT,
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin_management table for super admin to manage admin accounts
    await query(`
      CREATE TABLE IF NOT EXISTS admin_management (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        super_admin_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(50) NOT NULL,
        permissions JSONB DEFAULT '[]',
        department VARCHAR(100),
        status VARCHAR(50) DEFAULT 'active',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add super_admin role support to users table
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS super_admin BOOLEAN DEFAULT false
    `);

    // Create analytics tables
    await query(`
      CREATE TABLE IF NOT EXISTS survey_analytics (
        id SERIAL PRIMARY KEY,
        survey_id INTEGER REFERENCES surveys(id) ON DELETE CASCADE,
        total_views INTEGER DEFAULT 0,
        total_responses INTEGER DEFAULT 0,
        completion_rate DECIMAL(5,2) DEFAULT 0,
        average_completion_time INTEGER DEFAULT 0,
        bounce_rate DECIMAL(5,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(survey_id)
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS question_analytics (
        id SERIAL PRIMARY KEY,
        question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
        total_responses INTEGER DEFAULT 0,
        skip_rate DECIMAL(5,2) DEFAULT 0,
        average_time_spent INTEGER DEFAULT 0,
        response_distribution JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(question_id)
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS user_activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        activity_type VARCHAR(50) NOT NULL,
        description TEXT,
        metadata JSONB DEFAULT '{}',
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS survey_sessions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        survey_id INTEGER REFERENCES surveys(id) ON DELETE CASCADE,
        respondent_id VARCHAR(255),
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        is_completed BOOLEAN DEFAULT false,
        time_spent INTEGER DEFAULT 0,
        ip_address VARCHAR(45),
        user_agent TEXT
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS response_analytics (
        id SERIAL PRIMARY KEY,
        response_id INTEGER REFERENCES responses(id) ON DELETE CASCADE,
        time_spent INTEGER DEFAULT 0,
        is_complete BOOLEAN DEFAULT true,
        quality_score DECIMAL(3,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(response_id)
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS dashboard_metrics (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total_surveys INTEGER DEFAULT 0,
        total_responses INTEGER DEFAULT 0,
        total_revenue DECIMAL(10,2) DEFAULT 0,
        active_subscriptions INTEGER DEFAULT 0,
        monthly_growth DECIMAL(5,2) DEFAULT 0,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, date)
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS export_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        export_type VARCHAR(50) NOT NULL,
        format VARCHAR(10) NOT NULL,
        file_path VARCHAR(500),
        file_size INTEGER DEFAULT 0,
        filters JSONB DEFAULT '{}',
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);

    // Create events tables
    await query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date TIMESTAMP NOT NULL,
        location VARCHAR(255),
        max_attendees INTEGER,
        registration_required BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'upcoming',
        settings JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        organization VARCHAR(255),
        status VARCHAR(50) DEFAULT 'registered',
        survey_responses JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Update existing payment_subscriptions records to have GHS currency if currency is NULL
    await query(`
      UPDATE payment_subscriptions 
      SET currency = 'GHS' 
      WHERE currency IS NULL
    `);

    // Create indexes for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_surveys_user_id ON surveys(user_id);
      CREATE INDEX IF NOT EXISTS idx_questions_survey_id ON questions(survey_id);
      CREATE INDEX IF NOT EXISTS idx_responses_survey_id ON responses(survey_id);
      CREATE INDEX IF NOT EXISTS idx_responses_question_id ON responses(question_id);
      CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
      CREATE INDEX IF NOT EXISTS idx_survey_sessions_survey_id ON survey_sessions(survey_id);
      CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
      CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
    `);

    console.log('✅ Database tables created successfully!');

    // Insert default survey template
    await query(`
      INSERT INTO survey_templates (name, description, category, template_data, is_public)
      VALUES (
        'Customer Satisfaction Survey',
        'A basic customer satisfaction survey with emoji rating scales',
        'Customer Feedback',
        '{"title": "Customer Satisfaction Survey", "description": "Help us improve by sharing your experience", "questions": [{"type": "emoji_scale", "title": "How satisfied are you with our service?", "options": [{"value": 1, "label": "Very Dissatisfied", "emoji": "😞"}, {"value": 2, "label": "Dissatisfied", "emoji": "😐"}, {"value": 3, "label": "Neutral", "emoji": "😐"}, {"value": 4, "label": "Satisfied", "emoji": "🙂"}, {"value": 5, "label": "Very Satisfied", "emoji": "😊"}]}, {"type": "text", "title": "What could we improve?", "required": false}, {"type": "multiple_choice", "title": "How did you hear about us?", "options": ["Social Media", "Friend Recommendation", "Advertisement", "Search Engine", "Other"]}]}',
        true
      )
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ Default survey template created!');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

const dropTables = async () => {
  try {
    console.log('🗑️ Dropping all tables...');
    
    // Drop analytics tables first
    await query('DROP TABLE IF EXISTS export_logs CASCADE');
    await query('DROP TABLE IF EXISTS dashboard_metrics CASCADE');
    await query('DROP TABLE IF EXISTS response_analytics CASCADE');
    await query('DROP TABLE IF EXISTS survey_sessions CASCADE');
    await query('DROP TABLE IF EXISTS user_activities CASCADE');
    await query('DROP TABLE IF EXISTS question_analytics CASCADE');
    await query('DROP TABLE IF EXISTS survey_analytics CASCADE');
    
    // Drop events tables
    await query('DROP TABLE IF EXISTS event_registrations CASCADE');
    await query('DROP TABLE IF EXISTS events CASCADE');
    
    // Drop admin tables
    await query('DROP TABLE IF EXISTS admin_management CASCADE');
    await query('DROP TABLE IF EXISTS account_approvals CASCADE');
    await query('DROP TABLE IF EXISTS payment_approvals CASCADE');
    await query('DROP TABLE IF EXISTS subscription_packages CASCADE');
    await query('DROP TABLE IF EXISTS admin_audit_log CASCADE');
    
    // Drop payment and subscription tables
    await query('DROP TABLE IF EXISTS subscription_preferences CASCADE');
    await query('DROP TABLE IF EXISTS subscriptions CASCADE');
    await query('DROP TABLE IF EXISTS payment_subscriptions CASCADE');
    await query('DROP TABLE IF EXISTS payment_intents CASCADE');
    await query('DROP TABLE IF EXISTS pending_payments CASCADE');
    
    // Drop survey-related tables
    await query('DROP TABLE IF EXISTS responses CASCADE');
    await query('DROP TABLE IF EXISTS questions CASCADE');
    await query('DROP TABLE IF EXISTS survey_templates CASCADE');
    await query('DROP TABLE IF EXISTS survey_subcategories CASCADE');
    await query('DROP TABLE IF EXISTS survey_categories CASCADE');
    await query('DROP TABLE IF EXISTS images CASCADE');
    await query('DROP TABLE IF EXISTS surveys CASCADE');
    
    // Drop users table last
    await query('DROP TABLE IF EXISTS users CASCADE');
    
    console.log('✅ All tables dropped successfully!');
  } catch (error) {
    console.error('❌ Error dropping tables:', error);
    throw error;
  }
};

module.exports = { createTables, dropTables }; 