import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, ChevronUp, ChevronDown } from 'lucide-react';
import { getSkills, createSkill, updateSkill, deleteSkill, uploadFile, updateSkillOrder } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import type { Skill } from '@/types';
import { useToast } from '@/hooks/useToast';

export function SkillsManager() {
  const { addToast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    setIsLoading(true);
    const data = await getSkills();
    setSkills(data);
    setIsLoading(false);
  }

  async function handleAdd() {
    if (!newSkillName.trim()) return;

    const { data, error } = await createSkill({
      name: newSkillName.trim(),
      category: 'software',
      sort_order: skills.length + 1,
    });

    if (!error && data) {
      setSkills([...skills, data]);
      setNewSkillName('');
      setIsAdding(false);
      addToast('Skill added successfully!', 'success');
    } else if (error) {
      addToast(error.message, 'error');
    }
  }

  async function handleUpdate(id: string, updates: Partial<Skill>) {
    const { data, error } = await updateSkill(id, updates);
    if (!error && data) {
      setSkills(skills.map((s) => (s.id === id ? data : s)));
      setEditingId(null);
      addToast('Skill updated successfully!', 'success');
    } else if (error) {
      addToast(error.message, 'error');
    }
  }

  async function handleDelete(id: string) {
    setIsLoading(true);
    const { error } = await deleteSkill(id);
    if (!error) {
      setSkills(skills.filter((s) => s.id !== id));
      addToast('Skill deleted successfully!', 'success');
    } else {
      addToast(error.message, 'error');
    }
    setSkillToDelete(null);
    setIsLoading(false);
  }

  async function handleIconUpload(id: string, file: File) {
    const path = `skills/${id}-${file.name}`;
    const { data, error } = await uploadFile('assets', path, file);
    if (!error && data?.publicUrl) {
      await handleUpdate(id, { icon_url: data.publicUrl });
    }
  }

  async function moveSkill(id: string, direction: 'up' | 'down') {
    const fullIndex = skills.findIndex(s => s.id === id);
    if (fullIndex === -1) return;

    const newSkills = [...skills];
    const newIndex = direction === 'up' ? fullIndex - 1 : fullIndex + 1;
    
    if (newIndex < 0 || newIndex >= newSkills.length) return;
    
    // Swap
    [newSkills[fullIndex], newSkills[newIndex]] = [newSkills[newIndex], newSkills[fullIndex]];
    
    // Update sort order for ALL
    const updates = newSkills.map((s, i) => ({
      id: s.id,
      sort_order: i + 1
    }));
    
    setSkills(newSkills);
    const { error } = await updateSkillOrder(updates);
    if (error) {
      console.error('Failed to update skill order:', error);
      fetchSkills(); // Revert on failure
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
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
            Skills
          </h1>
          <p className="text-muted dark:text-muted-dark">
            Manage your skills and tools
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </motion.div>

      {/* Add New Skill */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-4"
        >
          <div className="flex gap-3">
            <Input
              placeholder="Skill name..."
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
            <Button onClick={handleAdd}>
              <Save className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Skills List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark divide-y divide-border dark:divide-border-dark"
      >
        {skills.length === 0 ? (
          <div className="p-8 text-center text-muted dark:text-muted-dark">
            No skills yet. Add your first skill!
          </div>
        ) : (
          skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center gap-4 p-4 hover:bg-secondary/50 dark:hover:bg-secondary-dark/50 transition-colors"
            >
              {/* Reorder actions */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveSkill(skill.id, 'up')}
                  disabled={skills.findIndex(s => s.id === skill.id) === 0}
                  className="p-1 rounded-md hover:bg-secondary dark:hover:bg-secondary-dark disabled:opacity-30 transition-colors"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveSkill(skill.id, 'down')}
                  disabled={skills.findIndex(s => s.id === skill.id) === skills.length - 1}
                  className="p-1 rounded-md hover:bg-secondary dark:hover:bg-secondary-dark disabled:opacity-30 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                {skill.icon_url ? (
                  <img src={skill.icon_url} alt="" className="w-6 h-6 object-contain" />
                ) : (
                  <span className="text-lg font-bold text-primary">
                    {skill.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Name */}
              {editingId === skill.id ? (
                <div className="flex-1 flex gap-2">
                  <Input
                    defaultValue={skill.name}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdate(skill.id, { name: e.currentTarget.value });
                      }
                    }}
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      handleUpdate(skill.id, { name: input.value });
                    }}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <span className="flex-1 font-medium text-foreground dark:text-foreground-dark">
                  {skill.name}
                </span>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer w-8 h-8 rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark flex items-center justify-center transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleIconUpload(skill.id, file);
                    }}
                  />
                  <Edit2 className="w-4 h-4 text-muted dark:text-muted-dark" />
                </label>
                <button
                  onClick={() => setEditingId(editingId === skill.id ? null : skill.id)}
                  className="w-8 h-8 rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark flex items-center justify-center transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-muted dark:text-muted-dark" />
                </button>
                <button
                  onClick={() => setSkillToDelete(skill)}
                  className="w-8 h-8 rounded-lg hover:bg-danger/10 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-danger" />
                </button>
              </div>
            </div>
          ))
        )}
      </motion.div>

      <ConfirmModal
        isOpen={!!skillToDelete}
        onClose={() => setSkillToDelete(null)}
        onConfirm={() => skillToDelete && handleDelete(skillToDelete.id)}
        title="Delete Skill"
        itemName={skillToDelete?.name || ''}
        isDeleting={isLoading && !!skillToDelete}
      />
    </div>
  );
}
