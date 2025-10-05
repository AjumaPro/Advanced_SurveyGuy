-- =============================================
-- BLOG SYSTEM FOR RESEARCH & SURVEY REPORTS
-- Comprehensive blog system with research aggregation
-- =============================================

-- =============================================
-- 1. BLOG CATEGORIES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50) DEFAULT 'file-text',
  
  -- SEO
  meta_title VARCHAR(200),
  meta_description TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT blog_categories_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT blog_categories_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- =============================================
-- 2. BLOG POSTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Information
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  
  -- Category and Tags
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  
  -- Media
  featured_image_url TEXT,
  featured_image_alt TEXT,
  gallery_images JSONB DEFAULT '[]',
  
  -- Author
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Content Type
  post_type VARCHAR(50) DEFAULT 'article' CHECK (post_type IN ('article', 'survey_report', 'research_news', 'industry_analysis', 'case_study')),
  content_source VARCHAR(50) DEFAULT 'original' CHECK (content_source IN ('original', 'aggregated', 'guest_post', 'press_release')),
  
  -- External Sources (for aggregated content)
  source_url TEXT,
  source_name VARCHAR(255),
  source_date DATE,
  
  -- Survey Integration
  related_survey_id UUID REFERENCES surveys(id) ON DELETE SET NULL,
  
  -- SEO
  meta_title VARCHAR(200),
  meta_description TEXT,
  meta_keywords TEXT[] DEFAULT '{}',
  
  -- Social Media
  social_image_url TEXT,
  social_title VARCHAR(255),
  social_description TEXT,
  
  -- Publishing
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'scheduled')),
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  
  -- Featured and Pinned
  is_featured BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT blog_posts_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT blog_posts_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT blog_posts_content_not_empty CHECK (length(trim(content)) > 0)
);

-- =============================================
-- 3. BLOG COMMENTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  
  -- Comment Details
  content TEXT NOT NULL,
  parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  
  -- Author
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255),
  author_website TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'rejected')),
  is_verified BOOLEAN DEFAULT false,
  
  -- IP and User Agent
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT blog_comments_content_not_empty CHECK (length(trim(content)) > 0),
  CONSTRAINT blog_comments_valid_email CHECK (author_email IS NULL OR author_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- =============================================
-- 4. BLOG SUBSCRIPTIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS blog_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  
  -- Subscription Preferences
  categories UUID[] DEFAULT '{}',
  frequency VARCHAR(50) DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  
  -- Analytics
  last_email_sent TIMESTAMP WITH TIME ZONE,
  total_emails_sent INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT blog_subscriptions_valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- =============================================
-- 5. BLOG ANALYTICS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS blog_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  
  -- Analytics Data
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('view', 'like', 'share', 'comment', 'click', 'download')),
  event_data JSONB DEFAULT '{}',
  
  -- User Information
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  
  -- Geographic Data
  country VARCHAR(2),
  city VARCHAR(100),
  region VARCHAR(100),
  
  -- Referrer
  referrer_url TEXT,
  referrer_domain VARCHAR(255),
  
  -- Device Information
  device_type VARCHAR(50),
  browser VARCHAR(100),
  os VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. RESEARCH SOURCES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS research_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Source Information
  name VARCHAR(255) NOT NULL,
  website TEXT,
  rss_feed_url TEXT,
  api_endpoint TEXT,
  
  -- Source Type
  source_type VARCHAR(50) DEFAULT 'website' CHECK (source_type IN ('website', 'rss', 'api', 'manual', 'social_media')),
  category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('financial', 'business', 'technology', 'market_research', 'academic', 'government', 'general')),
  
  -- Content Filtering
  keywords TEXT[] DEFAULT '{}',
  exclude_keywords TEXT[] DEFAULT '{}',
  language VARCHAR(10) DEFAULT 'en',
  
  -- Automation
  is_auto_fetch BOOLEAN DEFAULT false,
  fetch_frequency VARCHAR(50) DEFAULT 'daily' CHECK (fetch_frequency IN ('hourly', 'daily', 'weekly', 'monthly')),
  last_fetch TIMESTAMP WITH TIME ZONE,
  next_fetch TIMESTAMP WITH TIME ZONE,
  
  -- Quality Control
  is_verified BOOLEAN DEFAULT false,
  quality_score INTEGER DEFAULT 50 CHECK (quality_score >= 0 AND quality_score <= 100),
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. RESEARCH AGGREGATION LOG TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS research_aggregation_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES research_sources(id) ON DELETE CASCADE,
  
  -- Aggregation Details
  fetch_status VARCHAR(50) DEFAULT 'pending' CHECK (fetch_status IN ('pending', 'success', 'failed', 'partial')),
  items_found INTEGER DEFAULT 0,
  items_processed INTEGER DEFAULT 0,
  items_created INTEGER DEFAULT 0,
  
  -- Error Handling
  error_message TEXT,
  error_details JSONB DEFAULT '{}',
  
  -- Performance
  fetch_duration_ms INTEGER,
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- 8. BLOG NEWSLETTER TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS blog_newsletters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Newsletter Details
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  template VARCHAR(50) DEFAULT 'default',
  
  -- Targeting
  categories UUID[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  audience VARCHAR(50) DEFAULT 'all' CHECK (audience IN ('all', 'subscribers', 'premium', 'custom')),
  
  -- Scheduling
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Analytics
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_unsubscribed INTEGER DEFAULT 0,
  
  -- Author
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_aggregation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_newsletters ENABLE ROW LEVEL SECURITY;

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Blog categories policies
DROP POLICY IF EXISTS "Anyone can view active blog categories" ON blog_categories;
CREATE POLICY "Anyone can view active blog categories"
ON blog_categories FOR SELECT
TO authenticated, anon
USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can manage categories" ON blog_categories;
CREATE POLICY "Authenticated users can manage categories"
ON blog_categories FOR ALL
TO authenticated
USING (true);

-- Blog posts policies
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
CREATE POLICY "Anyone can view published blog posts"
ON blog_posts FOR SELECT
TO authenticated, anon
USING (status = 'published');

DROP POLICY IF EXISTS "Authors can view their own posts" ON blog_posts;
CREATE POLICY "Authors can view their own posts"
ON blog_posts FOR SELECT
TO authenticated
USING (author_id = auth.uid());

DROP POLICY IF EXISTS "Authors can manage their posts" ON blog_posts;
CREATE POLICY "Authors can manage their posts"
ON blog_posts FOR ALL
TO authenticated
USING (author_id = auth.uid());

-- Blog comments policies
DROP POLICY IF EXISTS "Anyone can view approved comments" ON blog_comments;
CREATE POLICY "Anyone can view approved comments"
ON blog_comments FOR SELECT
TO authenticated, anon
USING (status = 'approved');

DROP POLICY IF EXISTS "Anyone can create comments" ON blog_comments;
CREATE POLICY "Anyone can create comments"
ON blog_comments FOR INSERT
TO authenticated, anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Authors can update their comments" ON blog_comments;
CREATE POLICY "Authors can update their comments"
ON blog_comments FOR UPDATE
TO authenticated
USING (author_id = auth.uid());

-- Blog subscriptions policies
DROP POLICY IF EXISTS "Anyone can subscribe to blog" ON blog_subscriptions;
CREATE POLICY "Anyone can subscribe to blog"
ON blog_subscriptions FOR INSERT
TO authenticated, anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage their subscriptions" ON blog_subscriptions;
CREATE POLICY "Users can manage their subscriptions"
ON blog_subscriptions FOR ALL
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Blog analytics policies
DROP POLICY IF EXISTS "Anyone can create analytics events" ON blog_analytics;
CREATE POLICY "Anyone can create analytics events"
ON blog_analytics FOR INSERT
TO authenticated, anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Authors can view analytics for their posts" ON blog_analytics;
CREATE POLICY "Authors can view analytics for their posts"
ON blog_analytics FOR SELECT
TO authenticated
USING (
  post_id IN (
    SELECT id FROM blog_posts WHERE author_id = auth.uid()
  )
);

-- Research sources policies
DROP POLICY IF EXISTS "Anyone can view active research sources" ON research_sources;
CREATE POLICY "Anyone can view active research sources"
ON research_sources FOR SELECT
TO authenticated, anon
USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can manage research sources" ON research_sources;
CREATE POLICY "Authenticated users can manage research sources"
ON research_sources FOR ALL
TO authenticated
USING (true);

-- Research aggregation log policies
DROP POLICY IF EXISTS "Authenticated users can view aggregation logs" ON research_aggregation_log;
CREATE POLICY "Authenticated users can view aggregation logs"
ON research_aggregation_log FOR SELECT
TO authenticated
USING (true);

-- Blog newsletters policies
DROP POLICY IF EXISTS "Authors can manage their newsletters" ON blog_newsletters;
CREATE POLICY "Authors can manage their newsletters"
ON blog_newsletters FOR ALL
TO authenticated
USING (author_id = auth.uid());

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Blog categories indexes
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_active ON blog_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_blog_categories_sort_order ON blog_categories(sort_order);

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_post_type ON blog_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_pinned ON blog_posts(is_pinned);
CREATE INDEX IF NOT EXISTS idx_blog_posts_view_count ON blog_posts(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Blog comments indexes
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_author_id ON blog_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at DESC);

-- Blog subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_blog_subscriptions_email ON blog_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_blog_subscriptions_active ON blog_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_blog_subscriptions_verified ON blog_subscriptions(is_verified);

-- Blog analytics indexes
CREATE INDEX IF NOT EXISTS idx_blog_analytics_post_id ON blog_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_event_type ON blog_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_created_at ON blog_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_user_id ON blog_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_country ON blog_analytics(country);

-- Research sources indexes
CREATE INDEX IF NOT EXISTS idx_research_sources_category ON research_sources(category);
CREATE INDEX IF NOT EXISTS idx_research_sources_active ON research_sources(is_active);
CREATE INDEX IF NOT EXISTS idx_research_sources_next_fetch ON research_sources(next_fetch);

-- Research aggregation log indexes
CREATE INDEX IF NOT EXISTS idx_research_aggregation_log_source_id ON research_aggregation_log(source_id);
CREATE INDEX IF NOT EXISTS idx_research_aggregation_log_status ON research_aggregation_log(fetch_status);
CREATE INDEX IF NOT EXISTS idx_research_aggregation_log_started_at ON research_aggregation_log(started_at DESC);

-- Blog newsletters indexes
CREATE INDEX IF NOT EXISTS idx_blog_newsletters_status ON blog_newsletters(status);
CREATE INDEX IF NOT EXISTS idx_blog_newsletters_scheduled_at ON blog_newsletters(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_blog_newsletters_author_id ON blog_newsletters(author_id);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to generate blog post slug
CREATE OR REPLACE FUNCTION generate_blog_slug(post_title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert to lowercase and replace spaces/special chars with hyphens
  base_slug := lower(regexp_replace(post_title, '[^a-z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  base_slug := substring(base_slug from 1 for 80); -- Limit length
  
  final_slug := base_slug;
  
  -- Check if slug exists and append counter if needed
  WHILE EXISTS (SELECT 1 FROM blog_posts WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to get blog post analytics
CREATE OR REPLACE FUNCTION get_blog_post_analytics(p_post_id UUID)
RETURNS TABLE (
  total_views BIGINT,
  total_likes BIGINT,
  total_shares BIGINT,
  total_comments BIGINT,
  unique_visitors BIGINT,
  avg_time_on_page INTERVAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM blog_analytics WHERE post_id = p_post_id AND event_type = 'view')::BIGINT as total_views,
    (SELECT COUNT(*) FROM blog_analytics WHERE post_id = p_post_id AND event_type = 'like')::BIGINT as total_likes,
    (SELECT COUNT(*) FROM blog_analytics WHERE post_id = p_post_id AND event_type = 'share')::BIGINT as total_shares,
    (SELECT COUNT(*) FROM blog_analytics WHERE post_id = p_post_id AND event_type = 'comment')::BIGINT as total_comments,
    (SELECT COUNT(DISTINCT session_id) FROM blog_analytics WHERE post_id = p_post_id AND session_id IS NOT NULL)::BIGINT as unique_visitors,
    (SELECT AVG((event_data->>'time_on_page')::INTERVAL) FROM blog_analytics WHERE post_id = p_post_id AND event_type = 'view' AND event_data->>'time_on_page' IS NOT NULL) as avg_time_on_page;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get trending blog posts
CREATE OR REPLACE FUNCTION get_trending_blog_posts(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title VARCHAR(255),
  slug VARCHAR(255),
  excerpt TEXT,
  featured_image_url TEXT,
  author_name TEXT,
  category_name VARCHAR(100),
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER,
  like_count INTEGER,
  trending_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.id,
    bp.title,
    bp.slug,
    bp.excerpt,
    bp.featured_image_url,
    p.full_name as author_name,
    bc.name as category_name,
    bp.published_at,
    bp.view_count,
    bp.like_count,
    -- Calculate trending score based on views, likes, and recency
    (bp.view_count * 0.5 + bp.like_count * 2.0 + 
     CASE 
       WHEN bp.published_at > NOW() - INTERVAL '7 days' THEN 10.0
       WHEN bp.published_at > NOW() - INTERVAL '30 days' THEN 5.0
       ELSE 1.0
     END) as trending_score
  FROM blog_posts bp
  LEFT JOIN profiles p ON p.id = bp.author_id
  LEFT JOIN blog_categories bc ON bc.id = bp.category_id
  WHERE bp.status = 'published'
  ORDER BY trending_score DESC, bp.published_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search blog posts
CREATE OR REPLACE FUNCTION search_blog_posts(
  search_term TEXT,
  category_id UUID DEFAULT NULL,
  post_type VARCHAR(50) DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title VARCHAR(255),
  slug VARCHAR(255),
  excerpt TEXT,
  featured_image_url TEXT,
  author_name TEXT,
  category_name VARCHAR(100),
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER,
  relevance_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.id,
    bp.title,
    bp.slug,
    bp.excerpt,
    bp.featured_image_url,
    p.full_name as author_name,
    bc.name as category_name,
    bp.published_at,
    bp.view_count,
    -- Calculate relevance score based on title, content, and tags
    (CASE 
       WHEN bp.title ILIKE '%' || search_term || '%' THEN 10.0
       ELSE 0.0
     END +
     CASE 
       WHEN bp.content ILIKE '%' || search_term || '%' THEN 5.0
       ELSE 0.0
     END +
     CASE 
       WHEN search_term = ANY(bp.tags) THEN 8.0
       ELSE 0.0
     END) as relevance_score
  FROM blog_posts bp
  LEFT JOIN profiles p ON p.id = bp.author_id
  LEFT JOIN blog_categories bc ON bc.id = bp.category_id
  WHERE bp.status = 'published'
    AND (bp.title ILIKE '%' || search_term || '%' 
         OR bp.content ILIKE '%' || search_term || '%'
         OR search_term = ANY(bp.tags))
    AND (category_id IS NULL OR bp.category_id = category_id)
    AND (post_type IS NULL OR bp.post_type = post_type)
  ORDER BY relevance_score DESC, bp.published_at DESC
  LIMIT limit_count OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_comments_updated_at ON blog_comments;
CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON blog_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_subscriptions_updated_at ON blog_subscriptions;
CREATE TRIGGER update_blog_subscriptions_updated_at
  BEFORE UPDATE ON blog_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_research_sources_updated_at ON research_sources;
CREATE TRIGGER update_research_sources_updated_at
  BEFORE UPDATE ON research_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_newsletters_updated_at ON blog_newsletters;
CREATE TRIGGER update_blog_newsletters_updated_at
  BEFORE UPDATE ON blog_newsletters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INITIAL DATA SETUP
-- =============================================

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description, color, icon, sort_order) VALUES
('Financial Research', 'financial-research', 'Latest financial market research and analysis', '#10B981', 'trending-up', 1),
('Business Intelligence', 'business-intelligence', 'Business trends, strategies, and market insights', '#3B82F6', 'briefcase', 2),
('Technology Surveys', 'technology-surveys', 'Tech industry surveys and digital transformation insights', '#8B5CF6', 'cpu', 3),
('Market Research', 'market-research', 'Consumer behavior and market analysis reports', '#F59E0B', 'bar-chart-3', 4),
('Survey Reports', 'survey-reports', 'Published survey results and data insights', '#EF4444', 'file-text', 5),
('Industry Analysis', 'industry-analysis', 'Deep dives into specific industries and sectors', '#06B6D4', 'search', 6),
('Global Research', 'global-research', 'International research and cross-border insights', '#84CC16', 'globe', 7),
('Case Studies', 'case-studies', 'Real-world examples and success stories', '#F97316', 'book-open', 8)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Blog System Created Successfully!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Tables Created:';
  RAISE NOTICE '  - blog_categories (8 default categories)';
  RAISE NOTICE '  - blog_posts (articles, reports, news)';
  RAISE NOTICE '  - blog_comments (commenting system)';
  RAISE NOTICE '  - blog_subscriptions (newsletter subscriptions)';
  RAISE NOTICE '  - blog_analytics (detailed analytics)';
  RAISE NOTICE '  - research_sources (aggregation sources)';
  RAISE NOTICE '  - research_aggregation_log (fetch logs)';
  RAISE NOTICE '  - blog_newsletters (email campaigns)';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Helper Functions:';
  RAISE NOTICE '  - generate_blog_slug()';
  RAISE NOTICE '  - get_blog_post_analytics()';
  RAISE NOTICE '  - get_trending_blog_posts()';
  RAISE NOTICE '  - search_blog_posts()';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Security:';
  RAISE NOTICE '  - Row Level Security enabled';
  RAISE NOTICE '  - Public read access for published content';
  RAISE NOTICE '  - Author-based write access';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Features Ready:';
  RAISE NOTICE '  ✅ Blog post management';
  RAISE NOTICE '  ✅ Research aggregation';
  RAISE NOTICE '  ✅ Comment system';
  RAISE NOTICE '  ✅ Newsletter subscriptions';
  RAISE NOTICE '  ✅ Analytics tracking';
  RAISE NOTICE '  ✅ SEO optimization';
  RAISE NOTICE '  ✅ Search functionality';
  RAISE NOTICE '  ✅ Trending posts';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Next: Build the frontend components!';
END $$;
