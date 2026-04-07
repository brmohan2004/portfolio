import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Mail, Phone, MapPin, FileText, Loader2 } from 'lucide-react';
import { getProfile, updateProfile, uploadFile } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '@/components/media/ImageUploader';
import type { Profile } from '@/types';
import { useToast } from '@/hooks/useToast';

export function ProfileManager() {
  const { addToast } = useToast();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setIsLoading(true);
    const data = await getProfile();
    if (data) {
      setProfile(data);
    }
    setIsLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile.id) return;

    setIsSaving(true);
    const { error } = await updateProfile(profile);
    setIsSaving(false);
    
    if (!error) {
      addToast('Profile updated successfully!', 'success');
    } else {
      addToast(error.message, 'error');
    }
  }

  async function handleImageUpload(file: File, field: string): Promise<string | null> {
    const path = `${field}/${Date.now()}-${file.name}`;
    const { data, error } = await uploadFile('assets', path, file);
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    return data?.publicUrl || null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark">
          Profile
        </h1>
        <p className="text-muted dark:text-muted-dark">
          Manage your personal information
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Profile Image */}
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            Profile Image
          </h2>
          <ImageUploader
            value={profile.profile_image}
            onChange={(url) => setProfile({ ...profile, profile_image: url })}
            onUpload={(file) => handleImageUpload(file, 'profile')}
          />
        </div>

        {/* Basic Info */}
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            Basic Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted dark:text-muted-dark" />
              <Input
                label="Full Name"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted dark:text-muted-dark" />
              <Input
                label="Title"
                value={profile.title || ''}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="pl-10"
                placeholder="e.g., Structural Engineer"
              />
            </div>

            <div className="sm:col-span-2">
              <Textarea
                label="Hero Description"
                value={profile.hero_description || ''}
                onChange={(e) => setProfile({ ...profile, hero_description: e.target.value })}
                placeholder="Brief description for hero section..."
                rows={3}
              />
            </div>

            <div className="sm:col-span-2">
              <Textarea
                label="Bio"
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Your professional biography..."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            Contact Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted dark:text-muted-dark" />
              <Input
                label="Email"
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted dark:text-muted-dark" />
              <Input
                label="Phone"
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="pl-10"
              />
            </div>

            <div className="relative sm:col-span-2">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted dark:text-muted-dark" />
              <Input
                label="Location"
                value={profile.location || ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="pl-10"
                placeholder="e.g., Bangalore, India"
              />
            </div>
          </div>
        </div>

        {/* Resume */}
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            Resume
          </h2>

          {profile.resume_url && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 dark:bg-secondary-dark/50">
              <FileText className="w-5 h-5 text-primary" />
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View Current Resume
              </a>
            </div>
          )}

          <Input
            type="file"
            accept=".pdf"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = await handleImageUpload(file, 'resumes');
                if (url) setProfile({ ...profile, resume_url: url });
              }
            }}
          />
        </div>

        {/* Hire Me Text */}
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            Hire Me Section
          </h2>
          <Textarea
            value={profile.hire_me_text || ''}
            onChange={(e) => setProfile({ ...profile, hire_me_text: e.target.value })}
            placeholder="Text for the hire me section..."
            rows={3}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" size="lg" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
