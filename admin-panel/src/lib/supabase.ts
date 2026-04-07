import { createClient } from '@supabase/supabase-js';
import type { Profile, Skill, Project, User } from '@/types';
export type { Profile, Skill, Project, User };

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth API
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return {
    id: user.id,
    email: user.email || '',
  };
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((_, session) => {
    callback(session?.user ? { id: session.user.id, email: session.user.email || '' } : null);
  });
}

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

export async function updateProfile(profile: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profile')
    .update(profile)
    .eq('id', profile.id)
    .select()
    .single();

  return { data, error };
}

// Skills API
export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching skills:', error);
    return [];
  }

  return data || [];
}

export async function createSkill(skill: Partial<Skill>) {
  const { data, error } = await supabase
    .from('skills')
    .insert(skill)
    .select()
    .single();

  return { data, error };
}

export async function updateSkill(id: string, skill: Partial<Skill>) {
  const { data, error } = await supabase
    .from('skills')
    .update(skill)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function deleteSkill(id: string) {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id);

  return { error };
}

export async function updateSkillOrder(skills: { id: string, sort_order: number }[]) {
  const promises = skills.map(s => 
    supabase.from('skills').update({ sort_order: s.sort_order }).eq('id', s.id)
  );
  const results = await Promise.all(promises);
  const error = results.find(r => r.error)?.error;
  return { error };
}

// Projects API
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data;
}

export async function createProject(project: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  return { data, error };
}

export async function updateProject(id: string, project: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  return { error };
}

export async function updateProjectOrder(projects: { id: string, sort_order: number }[]) {
  const promises = projects.map(p => 
    supabase.from('projects').update({ sort_order: p.sort_order }).eq('id', p.id)
  );
  const results = await Promise.all(promises);
  const error = results.find(r => r.error)?.error;
  return { error };
}

// Storage API
export async function uploadFile(bucket: string, path: string, file: File) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading file:', error);
    return { data: null, error };
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return { data: { ...data, publicUrl }, error: null };
}

export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  return { error };
}

export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
