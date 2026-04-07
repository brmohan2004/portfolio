import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { getProjectById, createProject, updateProject, uploadFile } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader, GalleryUploader } from '@/components/media/ImageUploader';
import { PDFUploader } from '@/components/media/PDFUploader';
import { generateSlug } from '@/lib/utils';
import type { Project } from '@/types';
import { useToast } from '@/hooks/useToast';

const AVAILABLE_TOOLS = ['Auto CAD', 'STAAD.Pro', 'Revit', 'V-ray', 'Tekla', 'Tekla Structures'];

export function ProjectForm() {
  const { addToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [project, setProject] = useState<Partial<Project>>({
    title: '',
    slug: '',
    description: '',
    overview: '',
    tools: [],
    project_type: '',
    duration: '',
    featured: false,
    status: 'draft',
    images: [],
    model_images: [],
    connection_images: [],
    drawing_details: '',
    pdfs: [],
  });

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      fetchProject(id);
    }
  }, [id, isEditing]);

  async function fetchProject(projectId: string) {
    const data = await getProjectById(projectId);
    if (data) {
      setProject(data);
    }
    setIsLoading(false);
  }

  const handleUpload = useCallback(async (file: File, folder: string): Promise<string | null> => {
    const path = `projects/${folder}/${Date.now()}-${file.name}`;
    const { data, error } = await uploadFile('assets', path, file);
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    return data?.publicUrl || null;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const projectData = {
      ...project,
      slug: project.slug || generateSlug(project.title || ''),
    };

    if (isEditing && id) {
      await updateProject(id, projectData);
      addToast('Project updated successfully!', 'success');
    } else {
      await createProject(projectData);
      addToast('Project created successfully!', 'success');
    }

    setIsSaving(false);
    navigate('/dashboard/projects');
  };

  const toggleTool = (tool: string) => {
    const tools = project.tools || [];
    if (tools.includes(tool)) {
      setProject({ ...project, tools: tools.filter((t) => t !== tool) });
    } else {
      setProject({ ...project, tools: [...tools, tool] });
    }
  };

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
        className="flex items-center gap-4"
      >
        <button
          onClick={() => navigate('/dashboard/projects')}
          className="w-10 h-10 rounded-lg border border-border dark:border-border-dark flex items-center justify-center hover:bg-secondary dark:hover:bg-secondary-dark transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark">
            {isEditing ? 'Edit Project' : 'New Project'}
          </h1>
          <p className="text-muted dark:text-muted-dark">
            {isEditing ? 'Update project details' : 'Create a new portfolio project'}
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Basic Info */}
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            Basic Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <Input
                label="Project Title"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                placeholder="e.g., Steel Industrial Shed"
                required
              />
            </div>

            <div>
              <Input
                label="Slug"
                value={project.slug}
                onChange={(e) => setProject({ ...project, slug: e.target.value })}
                placeholder="auto-generated-from-title"
              />
            </div>

            <div>
              <Input
                label="Project Type"
                value={project.project_type}
                onChange={(e) => setProject({ ...project, project_type: e.target.value })}
                placeholder="e.g., Steel Structure"
              />
            </div>

            <div>
              <Input
                label="Duration"
                value={project.duration}
                onChange={(e) => setProject({ ...project, duration: e.target.value })}
                placeholder="e.g., 1-2 Weeks"
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Short Description"
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                placeholder="e.g., Tekla Structures | GA + Shop Drawings"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-foreground dark:text-foreground-dark mb-2 block">
                Overview
              </label>
              <Textarea
                value={project.overview}
                onChange={(e) => setProject({ ...project, overview: e.target.value })}
                placeholder="Detailed project description..."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            Tools Used
          </h2>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TOOLS.map((tool) => (
              <button
                key={tool}
                type="button"
                onClick={() => toggleTool(tool)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  project.tools?.includes(tool)
                    ? 'bg-primary text-white'
                    : 'bg-secondary dark:bg-secondary-dark text-foreground dark:text-foreground-dark hover:bg-border'
                }`}
              >
                {tool}
              </button>
            ))}
          </div>
        </div>

        {/* Status & Featured */}
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark mb-2">
            Project Settings
          </h2>
          <div className="flex flex-wrap gap-8">
            {/* Visibility / Status */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Visibility Status
              </label>
              <button
                type="button"
                onClick={() => setProject({
                  ...project,
                  status: project.status === 'published' ? 'draft' : 'published'
                })}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all shadow-lg active:scale-95 ${
                  project.status === 'published'
                    ? 'bg-emerald-500 ring-4 ring-emerald-500/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-700'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${project.status === 'published' ? 'bg-white' : 'bg-slate-400'}`} />
                {project.status === 'published' ? 'PUBLISHED' : 'DRAFT (HIDDEN)'}
              </button>
              <p className="text-[10px] text-gray-500 max-w-[180px] leading-tight font-medium">
                {project.status === 'published' 
                  ? 'Visible to everyone on the public website.' 
                  : 'Only visible here. Switch to published to show on site.'}
              </p>
            </div>

            {/* Featured Selection */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Front-Page Display
              </label>
              <button
                type="button"
                onClick={() => setProject({ ...project, featured: !project.featured })}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all shadow-lg active:scale-95 ${
                  project.featured
                    ? 'bg-amber-500 ring-4 ring-amber-500/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-700'
                }`}
              >
                <span className="text-lg">{project.featured ? '★' : '☆'}</span>
                {project.featured ? 'FEATURED' : 'GENERAL'}
              </button>
              <p className="text-[10px] text-gray-500 max-w-[180px] leading-tight font-medium">
                {project.featured 
                  ? 'Shown prominently in the "Featured Projects" section.' 
                  : 'Shown in the general portfolio list.'}
              </p>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            Cover Image
          </h2>
          <ImageUploader
            value={project.cover_image}
            onChange={(url) => setProject({ ...project, cover_image: url })}
            onUpload={(file) => handleUpload(file, 'cover')}
          />
        </div>

        {/* Gallery */}
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            Project Gallery
          </h2>
          <GalleryUploader
            images={project.images || []}
            onChange={(images) => setProject({ ...project, images })}
            onUpload={(file) => handleUpload(file, 'gallery')}
          />
        </div>

        {/* 3D Models */}
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            3D Models
          </h2>
          <GalleryUploader
            images={project.model_images || []}
            onChange={(images) => setProject({ ...project, model_images: images })}
            onUpload={(file) => handleUpload(file, 'models')}
          />
        </div>

        {/* Drawing Details */}
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            Drawing Details
          </h2>
          <div className="space-y-4">
            <Textarea
              label="Drawing Details Description"
              value={project.drawing_details}
              onChange={(e) => setProject({ ...project, drawing_details: e.target.value })}
              placeholder="Detailed information about the drawings..."
              rows={3}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground dark:text-foreground-dark">
                Drawing Documents (PDFs)
              </label>
              <PDFUploader
                pdfs={project.pdfs || []}
                onChange={(pdfs) => setProject({ ...project, pdfs })}
                onUpload={async (file) => handleUpload(file, 'drawings/pdfs')}
              />
            </div>
          </div>
        </div>



        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" size="lg" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Project' : 'Create Project'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => navigate('/dashboard/projects')}
          >
            Cancel
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
