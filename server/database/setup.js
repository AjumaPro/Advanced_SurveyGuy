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
        currency VARCHAR(10) DEFAULT 'NGN',
        reference VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
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

    // Create indexes for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_surveys_user_id ON surveys(user_id);
      CREATE INDEX IF NOT EXISTS idx_questions_survey_id ON questions(survey_id);
      CREATE INDEX IF NOT EXISTS idx_responses_survey_id ON responses(survey_id);
      CREATE INDEX IF NOT EXISTS idx_responses_question_id ON responses(question_id);
      CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);
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
    
    await query('DROP TABLE IF EXISTS subscription_preferences CASCADE');
    await query('DROP TABLE IF EXISTS subscriptions CASCADE');
    await query('DROP TABLE IF EXISTS payment_subscriptions CASCADE');
    await query('DROP TABLE IF EXISTS payment_intents CASCADE');
    await query('DROP TABLE IF EXISTS responses CASCADE');
    await query('DROP TABLE IF EXISTS questions CASCADE');
    await query('DROP TABLE IF EXISTS survey_templates CASCADE');
    await query('DROP TABLE IF EXISTS images CASCADE');
    await query('DROP TABLE IF EXISTS surveys CASCADE');
    await query('DROP TABLE IF EXISTS users CASCADE');
    
    console.log('✅ All tables dropped successfully!');
  } catch (error) {
    console.error('❌ Error dropping tables:', error);
    throw error;
  }
};

module.exports = { createTables, dropTables }; 