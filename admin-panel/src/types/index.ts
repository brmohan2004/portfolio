export interface Profile {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  hero_description: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  resume_url?: string;
  profile_image?: string;
  social_links?: Record<string, string>;
  hire_me_text: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  icon_url?: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectPDF {
  name: string;
  url: string;
  thumbnail_url?: string;
  size?: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  overview?: string;
  tools: string[];
  project_type?: string;
  duration?: string;
  featured: boolean;
  status: 'draft' | 'published';
  cover_image?: string;
  images: string[];
  model_images: string[];
  connection_images: string[];
  drawing_details?: string;
  pdfs: ProjectPDF[];
  sort_order: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  role?: string;
}
