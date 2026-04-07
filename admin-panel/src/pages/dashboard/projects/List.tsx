import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProjects, deleteProject, updateProjectOrder } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import type { Project } from '@/types';

export function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const filtered = projects.filter((project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  async function fetchProjects() {
    setIsLoading(true);
    const data = await getProjects();
    setProjects(data);
    setFilteredProjects(data);
    setIsLoading(false);
  }

  async function handleDelete(id: string) {
    setIsLoading(true); // Overlay loading
    const { error } = await deleteProject(id);
    if (!error) {
      setProjects(projects.filter((p) => p.id !== id));
    }
    setProjectToDelete(null);
    setIsLoading(false);
  }

  async function moveProject(id: string, direction: 'left' | 'right') {
    const fullIndex = projects.findIndex(p => p.id === id);
    if (fullIndex === -1) return;

    const newProjects = [...projects];
    const newIndex = direction === 'left' ? fullIndex - 1 : fullIndex + 1;
    
    if (newIndex < 0 || newIndex >= newProjects.length) return;
    
    // Swap
    [newProjects[fullIndex], newProjects[newIndex]] = [newProjects[newIndex], newProjects[fullIndex]];
    
    // Update sort order for ALL (to keep it fresh)
    const updates = newProjects.map((p, i) => ({
      id: p.id,
      sort_order: i + 1
    }));
    
    setProjects(newProjects);
    const { error } = await updateProjectOrder(updates);
    if (error) {
      console.error('Failed to update project order:', error);
      fetchProjects(); // Revert on failure
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark">
            Projects
          </h1>
          <p className="text-muted dark:text-muted-dark">
            Manage your portfolio projects
          </p>
        </div>
        <a href="/dashboard/projects/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </a>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted dark:text-muted-dark" />
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </motion.div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-secondary/50 dark:bg-secondary-dark/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-muted dark:text-muted-dark">
            {searchQuery ? 'No projects found' : 'No projects yet. Create your first project!'}
          </p>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark overflow-hidden group"
            >
              {/* Cover Image */}
              <div className="aspect-video bg-secondary dark:bg-secondary-dark relative overflow-hidden">
                {project.cover_image ? (
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-muted/30">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Reorder actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveProject(project.id, 'left'); }}
                    disabled={projects.findIndex(p => p.id === project.id) === 0}
                    className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center disabled:opacity-30 hover:bg-primary hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveProject(project.id, 'right'); }}
                    disabled={projects.findIndex(p => p.id === project.id) === projects.length - 1}
                    className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center disabled:opacity-30 hover:bg-primary hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Status badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {project.featured && (
                    <Badge variant="warning" className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </Badge>
                  )}
                  <Badge variant={project.status === 'published' ? 'success' : 'default'}>
                    {project.status}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground dark:text-foreground-dark truncate">
                  {project.title}
                </h3>
                <p className="text-sm text-muted dark:text-muted-dark truncate mt-1">
                  {project.description || 'No description'}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4">
                  <a
                    href={`/dashboard/projects/${project.id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </a>
                  <button
                    onClick={(e) => { e.stopPropagation(); setProjectToDelete(project); }}
                    className="px-3 py-2 rounded-lg border border-danger text-danger hover:bg-danger hover:text-white transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={() => projectToDelete && handleDelete(projectToDelete.id)}
        title="Delete Project"
        itemName={projectToDelete?.title || ''}
        isDeleting={isLoading && !!projectToDelete}
      />
    </div>
  );
}
