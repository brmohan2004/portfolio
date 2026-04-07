-- =====================================================
-- Portfolio Ecosystem Database Schema
-- For Supabase PostgreSQL
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Profile Table (Single row for portfolio owner)
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Mohan B R',
  title TEXT DEFAULT 'Tekla Structural Detailer | Structural Design Engineer',
  subtitle TEXT DEFAULT 'Structural Engineer',
  hero_description TEXT DEFAULT 'I create steel structures, GA drawings, and BIM models ready for real-world construction.',
  bio TEXT DEFAULT 'Civil Engineer specialized in structural analysis and steel detailing. Experienced in Tekla, STAAD, and BIM workflows with practical site exposure. Focused on delivering construction-ready solutions.',
  email TEXT,
  phone TEXT,
  location TEXT,
  resume_url TEXT,
  profile_image TEXT,
  social_links JSONB DEFAULT '{}',
  hire_me_text TEXT DEFAULT 'i am Civil Engineering Student i am searching job, if you can interest you can hire me',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon_url TEXT,
  category TEXT DEFAULT 'software',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  overview TEXT,
  tools TEXT[] DEFAULT '{}',
  project_type TEXT,
  duration TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  cover_image TEXT,
  images TEXT[] DEFAULT '{}',
  model_images TEXT[] DEFAULT '{}',
  connection_images TEXT[] DEFAULT '{}',
  pdfs JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order);

-- Skills indexes
CREATE INDEX IF NOT EXISTS idx_skills_sort_order ON skills(sort_order);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profile_updated_at
  BEFORE UPDATE ON profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Profile is publicly readable"
  ON profile FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Only authenticated users can modify profile"
  ON profile FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Skills policies
CREATE POLICY "Skills are publicly readable"
  ON skills FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Only authenticated users can modify skills"
  ON skills FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Projects policies
CREATE POLICY "Published projects are publicly readable"
  ON projects FOR SELECT
  TO PUBLIC
  USING (status = 'published');

CREATE POLICY "Authenticated users can read all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can modify projects"
  ON projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Note: Run these in Supabase Dashboard SQL Editor
-- or use Supabase CLI to create buckets

/*
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('projects', 'projects', true),
  ('resumes', 'resumes', true),
  ('assets', 'assets', true);

-- Storage policies for projects bucket
CREATE POLICY "Project images are publicly accessible"
  ON storage.objects FOR SELECT
  TO PUBLIC
  USING (bucket_id = 'projects');

CREATE POLICY "Authenticated users can upload project images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'projects');

CREATE POLICY "Authenticated users can update project images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'projects');

CREATE POLICY "Authenticated users can delete project images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'projects');

-- Storage policies for resumes bucket
CREATE POLICY "Resumes are publicly accessible"
  ON storage.objects FOR SELECT
  TO PUBLIC
  USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can manage resumes"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'resumes');

-- Storage policies for assets bucket
CREATE POLICY "Assets are publicly accessible"
  ON storage.objects FOR SELECT
  TO PUBLIC
  USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can manage assets"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'assets');
*/

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert default profile
INSERT INTO profile (id, name, title, subtitle, hero_description, bio, email, hire_me_text)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Mohan B R',
  'Tekla Structural Detailer | Structural Design Engineer',
  'Structural Engineer',
  'I create steel structures, GA drawings, and BIM models ready for real-world construction.',
  'Civil Engineer specialized in structural analysis and steel detailing. Experienced in Tekla, STAAD, and BIM workflows with practical site exposure. Focused on delivering construction-ready solutions.',
  'contact@mohanbr.com',
  'i am Civil Engineering Student i am searching job, if you can interest you can hire me'
)
ON CONFLICT (id) DO NOTHING;

-- Insert default skills
INSERT INTO skills (name, icon_url, category, sort_order) VALUES
  ('Auto CAD', '', 'software', 1),
  ('STAAD.Pro', '', 'software', 2),
  ('Revit', '', 'software', 3),
  ('V-ray', '', 'software', 4),
  ('Tekla', '', 'software', 5)
ON CONFLICT DO NOTHING;

-- Insert sample project
INSERT INTO projects (
  id,
  title,
  slug,
  description,
  overview,
  tools,
  project_type,
  duration,
  featured,
  status,
  sort_order
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Steel Industrial Shed',
  'steel-industrial-shed',
  'Tekla Structures | GA + Shop Drawings',
  'This project involves modeling a steel industrial shed including columns, rafters, purlins, and bracings using Tekla Structures. The objective was to generate fabrication-ready drawings.',
  ARRAY['Tekla Structures'],
  'Steel Structure',
  '1-2 Weeks',
  true,
  'published',
  1
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- VIEWS (for convenience)
-- =====================================================

-- Featured projects view
CREATE OR REPLACE VIEW featured_projects AS
SELECT * FROM projects
WHERE featured = true AND status = 'published'
ORDER BY sort_order ASC, created_at DESC;

-- Published projects view
CREATE OR REPLACE VIEW published_projects AS
SELECT * FROM projects
WHERE status = 'published'
ORDER BY sort_order ASC, created_at DESC;

-- Active skills view
CREATE OR REPLACE VIEW active_skills AS
SELECT * FROM skills
WHERE is_active = true
ORDER BY sort_order ASC;
