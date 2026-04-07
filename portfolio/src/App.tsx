import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useProfile, useSkills, useProjects } from '@/hooks/useData';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/sections/Hero';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { About } from '@/components/sections/About';
import { CTA } from '@/components/sections/CTA';
import { Footer } from '@/components/Footer';
import { ProjectDetail } from '@/components/ProjectDetail';
import { Skeleton } from '@/components/ui/skeleton';

function HomePage() {
  const { profile, loading: profileLoading } = useProfile();
  const { skills, loading: skillsLoading } = useSkills();
  const { projects, loading: projectsLoading } = useProjects();

  const isLoading = profileLoading || skillsLoading || projectsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <div className="mt-12 space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-4">
              <Skeleton className="h-16 w-32" />
              <Skeleton className="h-16 w-32" />
              <Skeleton className="h-16 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation profile={profile} />
      <main>
        <Hero profile={profile} />
        <Skills skills={skills} />
        <Projects projects={projects} skills={skills} />
        <About profile={profile} />
        <div id="contact">
          <CTA profile={profile} />
        </div>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
