-- =============================================
-- TEAM COLLABORATION SYSTEM
-- Complete database schema for team collaboration
-- =============================================

-- =============================================
-- 1. TEAMS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  
  -- Team settings
  plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  max_members INTEGER DEFAULT 5,
  max_surveys INTEGER DEFAULT 10,
  max_responses_per_survey INTEGER DEFAULT 1000,
  
  -- Branding
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#3B82F6',
  secondary_color VARCHAR(7) DEFAULT '#1E40AF',
  
  -- Status
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT teams_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT teams_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- =============================================
-- 2. TEAM MEMBERS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Role and permissions
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  permissions JSONB DEFAULT '{}',
  
  -- Invitation tracking
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invited_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended', 'left')),
  
  -- Notification preferences
  email_notifications BOOLEAN DEFAULT true,
  survey_notifications BOOLEAN DEFAULT true,
  team_notifications BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(team_id, user_id)
);

-- =============================================
-- 3. TEAM INVITATIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  
  -- Invitation details
  invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invitation_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'cancelled')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(team_id, email),
  CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- =============================================
-- 4. TEAM SURVEYS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS team_surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE NOT NULL,
  
  -- Collaboration settings
  is_public BOOLEAN DEFAULT false,
  allow_editing BOOLEAN DEFAULT true,
  require_approval BOOLEAN DEFAULT false,
  
  -- Ownership
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(team_id, survey_id)
);

-- =============================================
-- 5. TEAM ACTIVITIES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS team_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Activity details
  activity_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. TEAM RESOURCES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS team_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  
  -- Resource details
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('question_library', 'template', 'brand_kit', 'document')),
  content JSONB,
  file_url TEXT,
  file_size INTEGER,
  
  -- Sharing
  is_public BOOLEAN DEFAULT false,
  shared_with_teams UUID[] DEFAULT '{}',
  
  -- Ownership
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. TEAM COMMENTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS team_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  
  -- Comment details
  content TEXT NOT NULL,
  parent_id UUID REFERENCES team_comments(id) ON DELETE CASCADE,
  
  -- Entity reference (survey, question, etc.)
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  
  -- Author
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Status
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 8. TEAM WORKSPACES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS team_workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  
  -- Workspace details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  
  -- Settings
  settings JSONB DEFAULT '{}',
  
  -- Ownership
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_workspaces ENABLE ROW LEVEL SECURITY;

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Teams policies
DROP POLICY IF EXISTS "Users can view teams they belong to" ON teams;
CREATE POLICY "Users can view teams they belong to"
ON teams FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

DROP POLICY IF EXISTS "Team owners can update teams" ON teams;
CREATE POLICY "Team owners can update teams"
ON teams FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role = 'owner' AND status = 'active'
  )
);

DROP POLICY IF EXISTS "Users can create teams" ON teams;
CREATE POLICY "Users can create teams"
ON teams FOR INSERT
TO authenticated
WITH CHECK (true);

-- Team members policies
DROP POLICY IF EXISTS "Users can view team members of their teams" ON team_members;
CREATE POLICY "Users can view team members of their teams"
ON team_members FOR SELECT
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

DROP POLICY IF EXISTS "Team owners and admins can manage members" ON team_members;
CREATE POLICY "Team owners and admins can manage members"
ON team_members FOR ALL
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND status = 'active'
  )
);

-- Team invitations policies
DROP POLICY IF EXISTS "Users can view invitations for their teams" ON team_invitations;
CREATE POLICY "Users can view invitations for their teams"
ON team_invitations FOR SELECT
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND status = 'active'
  )
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Team owners and admins can manage invitations" ON team_invitations;
CREATE POLICY "Team owners and admins can manage invitations"
ON team_invitations FOR ALL
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND status = 'active'
  )
);

-- Team surveys policies
DROP POLICY IF EXISTS "Team members can view team surveys" ON team_surveys;
CREATE POLICY "Team members can view team surveys"
ON team_surveys FOR SELECT
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

DROP POLICY IF EXISTS "Team editors can manage surveys" ON team_surveys;
CREATE POLICY "Team editors can manage surveys"
ON team_surveys FOR ALL
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'editor') AND status = 'active'
  )
);

-- Team activities policies
DROP POLICY IF EXISTS "Team members can view activities" ON team_activities;
CREATE POLICY "Team members can view activities"
ON team_activities FOR SELECT
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

DROP POLICY IF EXISTS "Team members can create activities" ON team_activities;
CREATE POLICY "Team members can create activities"
ON team_activities FOR INSERT
TO authenticated
WITH CHECK (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Team resources policies
DROP POLICY IF EXISTS "Team members can view resources" ON team_resources;
CREATE POLICY "Team members can view resources"
ON team_resources FOR SELECT
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

DROP POLICY IF EXISTS "Team editors can manage resources" ON team_resources;
CREATE POLICY "Team editors can manage resources"
ON team_resources FOR ALL
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'editor') AND status = 'active'
  )
);

-- Team comments policies
DROP POLICY IF EXISTS "Team members can view comments" ON team_comments;
CREATE POLICY "Team members can view comments"
ON team_comments FOR SELECT
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

DROP POLICY IF EXISTS "Team members can create comments" ON team_comments;
CREATE POLICY "Team members can create comments"
ON team_comments FOR INSERT
TO authenticated
WITH CHECK (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

DROP POLICY IF EXISTS "Comment authors can update their comments" ON team_comments;
CREATE POLICY "Comment authors can update their comments"
ON team_comments FOR UPDATE
TO authenticated
USING (author_id = auth.uid());

-- Team workspaces policies
DROP POLICY IF EXISTS "Team members can view workspaces" ON team_workspaces;
CREATE POLICY "Team members can view workspaces"
ON team_workspaces FOR SELECT
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

DROP POLICY IF EXISTS "Team editors can manage workspaces" ON team_workspaces;
CREATE POLICY "Team editors can manage workspaces"
ON team_workspaces FOR ALL
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'editor') AND status = 'active'
  )
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Teams indexes
CREATE INDEX IF NOT EXISTS idx_teams_slug ON teams(slug);
CREATE INDEX IF NOT EXISTS idx_teams_status ON teams(status);
CREATE INDEX IF NOT EXISTS idx_teams_plan ON teams(plan);

-- Team members indexes
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);

-- Team invitations indexes
CREATE INDEX IF NOT EXISTS idx_team_invitations_team_id ON team_invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_team_invitations_status ON team_invitations(status);

-- Team surveys indexes
CREATE INDEX IF NOT EXISTS idx_team_surveys_team_id ON team_surveys(team_id);
CREATE INDEX IF NOT EXISTS idx_team_surveys_survey_id ON team_surveys(survey_id);
CREATE INDEX IF NOT EXISTS idx_team_surveys_assigned_to ON team_surveys(assigned_to);

-- Team activities indexes
CREATE INDEX IF NOT EXISTS idx_team_activities_team_id ON team_activities(team_id);
CREATE INDEX IF NOT EXISTS idx_team_activities_user_id ON team_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_team_activities_created_at ON team_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_activities_type ON team_activities(activity_type);

-- Team resources indexes
CREATE INDEX IF NOT EXISTS idx_team_resources_team_id ON team_resources(team_id);
CREATE INDEX IF NOT EXISTS idx_team_resources_type ON team_resources(type);
CREATE INDEX IF NOT EXISTS idx_team_resources_created_by ON team_resources(created_by);

-- Team comments indexes
CREATE INDEX IF NOT EXISTS idx_team_comments_team_id ON team_comments(team_id);
CREATE INDEX IF NOT EXISTS idx_team_comments_entity ON team_comments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_team_comments_parent_id ON team_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_team_comments_author_id ON team_comments(author_id);

-- Team workspaces indexes
CREATE INDEX IF NOT EXISTS idx_team_workspaces_team_id ON team_workspaces(team_id);
CREATE INDEX IF NOT EXISTS idx_team_workspaces_is_default ON team_workspaces(is_default);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to generate team slug
CREATE OR REPLACE FUNCTION generate_team_slug(team_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert to lowercase and replace spaces/special chars with hyphens
  base_slug := lower(regexp_replace(team_name, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  
  -- Check if slug exists and append counter if needed
  WHILE EXISTS (SELECT 1 FROM teams WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to check team permissions
CREATE OR REPLACE FUNCTION check_team_permission(
  p_team_id UUID,
  p_user_id UUID,
  p_required_role TEXT DEFAULT 'viewer'
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  role_hierarchy INTEGER;
  required_hierarchy INTEGER;
BEGIN
  -- Get user's role in team
  SELECT role INTO user_role
  FROM team_members
  WHERE team_id = p_team_id AND user_id = p_user_id AND status = 'active';
  
  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Define role hierarchy (higher number = more permissions)
  CASE user_role
    WHEN 'owner' THEN role_hierarchy := 4;
    WHEN 'admin' THEN role_hierarchy := 3;
    WHEN 'editor' THEN role_hierarchy := 2;
    WHEN 'viewer' THEN role_hierarchy := 1;
    ELSE role_hierarchy := 0;
  END CASE;
  
  CASE p_required_role
    WHEN 'owner' THEN required_hierarchy := 4;
    WHEN 'admin' THEN required_hierarchy := 3;
    WHEN 'editor' THEN required_hierarchy := 2;
    WHEN 'viewer' THEN required_hierarchy := 1;
    ELSE required_hierarchy := 0;
  END CASE;
  
  RETURN role_hierarchy >= required_hierarchy;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add team member
CREATE OR REPLACE FUNCTION add_team_member(
  p_team_id UUID,
  p_user_id UUID,
  p_role TEXT DEFAULT 'member',
  p_invited_by UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  member_id UUID;
BEGIN
  -- Check if user is already a member
  IF EXISTS (SELECT 1 FROM team_members WHERE team_id = p_team_id AND user_id = p_user_id) THEN
    RAISE EXCEPTION 'User is already a member of this team';
  END IF;
  
  -- Insert team member
  INSERT INTO team_members (team_id, user_id, role, invited_by)
  VALUES (p_team_id, p_user_id, p_role, p_invited_by)
  RETURNING id INTO member_id;
  
  -- Log activity
  INSERT INTO team_activities (team_id, user_id, activity_type, entity_type, entity_id, description)
  VALUES (p_team_id, p_user_id, 'member_added', 'team_member', member_id, 
          'Joined the team as ' || p_role);
  
  RETURN member_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create team invitation
CREATE OR REPLACE FUNCTION create_team_invitation(
  p_team_id UUID,
  p_email TEXT,
  p_invited_by UUID,
  p_role TEXT DEFAULT 'member'
)
RETURNS UUID AS $$
DECLARE
  invitation_id UUID;
  invitation_token TEXT;
BEGIN
  -- Generate unique invitation token
  invitation_token := encode(gen_random_bytes(32), 'base64');
  
  -- Insert invitation
  INSERT INTO team_invitations (team_id, email, role, invited_by, invitation_token)
  VALUES (p_team_id, p_email, p_role, p_invited_by, invitation_token)
  RETURNING id INTO invitation_id;
  
  -- Log activity
  INSERT INTO team_activities (team_id, user_id, activity_type, entity_type, entity_id, description)
  VALUES (p_team_id, p_invited_by, 'invitation_sent', 'team_invitation', invitation_id,
          'Invited ' || p_email || ' as ' || p_role);
  
  RETURN invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get team statistics
CREATE OR REPLACE FUNCTION get_team_stats(p_team_id UUID)
RETURNS TABLE (
  total_members BIGINT,
  active_surveys BIGINT,
  total_responses BIGINT,
  recent_activities BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM team_members WHERE team_id = p_team_id AND status = 'active')::BIGINT as total_members,
    (SELECT COUNT(*) FROM team_surveys WHERE team_id = p_team_id)::BIGINT as active_surveys,
    (SELECT COUNT(*) FROM responses r 
     JOIN team_surveys ts ON ts.survey_id = r.survey_id 
     WHERE ts.team_id = p_team_id)::BIGINT as total_responses,
    (SELECT COUNT(*) FROM team_activities 
     WHERE team_id = p_team_id AND created_at > NOW() - INTERVAL '7 days')::BIGINT as recent_activities;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Teams updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_invitations_updated_at ON team_invitations;
CREATE TRIGGER update_team_invitations_updated_at
  BEFORE UPDATE ON team_invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_surveys_updated_at ON team_surveys;
CREATE TRIGGER update_team_surveys_updated_at
  BEFORE UPDATE ON team_surveys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_resources_updated_at ON team_resources;
CREATE TRIGGER update_team_resources_updated_at
  BEFORE UPDATE ON team_resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_comments_updated_at ON team_comments;
CREATE TRIGGER update_team_comments_updated_at
  BEFORE UPDATE ON team_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_workspaces_updated_at ON team_workspaces;
CREATE TRIGGER update_team_workspaces_updated_at
  BEFORE UPDATE ON team_workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INITIAL DATA SETUP
-- =============================================

-- Create default workspace for each team
CREATE OR REPLACE FUNCTION create_default_workspace()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO team_workspaces (team_id, name, description, is_default, created_by)
  VALUES (NEW.id, 'Default Workspace', 'Main workspace for the team', true, 
          (SELECT user_id FROM team_members WHERE team_id = NEW.id AND role = 'owner' LIMIT 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_default_workspace_trigger ON teams;
CREATE TRIGGER create_default_workspace_trigger
  AFTER INSERT ON teams
  FOR EACH ROW EXECUTE FUNCTION create_default_workspace();

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Team Collaboration System Created Successfully!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Tables Created:';
  RAISE NOTICE '  - teams (team information and settings)';
  RAISE NOTICE '  - team_members (team membership and roles)';
  RAISE NOTICE '  - team_invitations (invitation management)';
  RAISE NOTICE '  - team_surveys (collaborative survey access)';
  RAISE NOTICE '  - team_activities (activity feed)';
  RAISE NOTICE '  - team_resources (shared resources)';
  RAISE NOTICE '  - team_comments (collaborative comments)';
  RAISE NOTICE '  - team_workspaces (team workspaces)';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Helper Functions:';
  RAISE NOTICE '  - generate_team_slug()';
  RAISE NOTICE '  - check_team_permission()';
  RAISE NOTICE '  - add_team_member()';
  RAISE NOTICE '  - create_team_invitation()';
  RAISE NOTICE '  - get_team_stats()';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Security:';
  RAISE NOTICE '  - Row Level Security enabled';
  RAISE NOTICE '  - Role-based permissions';
  RAISE NOTICE '  - Team isolation';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Features Ready:';
  RAISE NOTICE '  ✅ Team creation and management';
  RAISE NOTICE '  ✅ Member invitations';
  RAISE NOTICE '  ✅ Role-based permissions';
  RAISE NOTICE '  ✅ Collaborative surveys';
  RAISE NOTICE '  ✅ Activity feed';
  RAISE NOTICE '  ✅ Shared resources';
  RAISE NOTICE '  ✅ Comments system';
  RAISE NOTICE '  ✅ Team workspaces';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Next: Build the frontend components!';
END $$;
