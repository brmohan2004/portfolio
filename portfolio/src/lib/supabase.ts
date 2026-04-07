import { createClient } from '@supabase/supabase-js';
import type { Profile, Skill, Project } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Profile API
export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

// Skills API
export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching skills:', error);
    return [];
  }

  return data || [];
}

// Projects API
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }

  return data || [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data;
}

// Storage helpers
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
