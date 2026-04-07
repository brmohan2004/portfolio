import { motion } from 'framer-motion';
import { FolderOpen, Wrench, User, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { getProjects, getSkills, getProfile } from '@/lib/supabase';

export function DashboardHome() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    profile: false,
  });

  useEffect(() => {
    async function fetchStats() {
      const [projects, skills, profile] = await Promise.all([
        getProjects(),
        getSkills(),
        getProfile(),
      ]);
      setStats({
        projects: projects.length,
        skills: skills.length,
        profile: !!profile,
      });
    }
    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Projects',
      description: `${stats.projects} projects managed`,
      icon: FolderOpen,
      href: '/dashboard/projects',
      color: 'bg-blue-500',
    },
    {
      title: 'Skills',
      description: `${stats.skills} skills listed`,
      icon: Wrench,
      href: '/dashboard/skills',
      color: 'bg-green-500',
    },
    {
      title: 'Profile',
      description: stats.profile ? 'Profile complete' : 'Setup required',
      icon: User,
      href: '/dashboard/profile',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground dark:text-foreground-dark">
          Dashboard
        </h1>
        <p className="text-muted dark:text-muted-dark mt-2">
          Welcome to your portfolio management system
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <a href={card.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </a>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-6"
      >
        <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FileText className="w-4 h-4" />
            New Project
          </a>
          <a
            href="/dashboard/skills"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border dark:border-border-dark rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark transition-colors"
          >
            <Wrench className="w-4 h-4" />
            Manage Skills
          </a>
        </div>
      </motion.div>
    </div>
  );
}
