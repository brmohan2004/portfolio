import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '@/types';

import { ProjectCard } from '@/components/ProjectCard';
import type { Skill } from '@/types';

interface ProjectsProps {
  projects: Project[];
  skills: Skill[];
}

export function Projects({ projects, skills }: ProjectsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', skipSnaps: false }
  );

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  // Default projects if none from database
  const defaultProjects: Project[] = [
    {
      id: '1',
      title: 'Steel Industrial Shed',
      slug: 'steel-industrial-shed',
      description: 'Tekla Structures | GA + Shop Drawings',
      overview: 'Complete steel structure modeling and detailing',
      tools: ['Tekla Structures'],
      project_type: 'Steel Structure',
      duration: '1-2 Weeks',
      featured: true,
      status: 'published',
      images: [],
      model_images: [],
      connection_images: [],
      pdfs: [],
      sort_order: 1,
      created_at: '',
      updated_at: '',
    },
    {
      id: '2',
      title: 'G+5 Building',
      slug: 'g5-building',
      description: 'Revit | Structural + BBS',
      overview: 'Multi-story building structural design',
      tools: ['Revit'],
      project_type: 'Building',
      duration: '2-3 Weeks',
      featured: true,
      status: 'published',
      images: [],
      model_images: [],
      connection_images: [],
      pdfs: [],
      sort_order: 2,
      created_at: '',
      updated_at: '',
    },
  ];

  const displayProjects = projects.length > 0 ? projects : defaultProjects;

  return (
    <section id="projects" className="py-[20px] bg-background dark:bg-background-dark overflow-hidden" ref={ref}>
      <div className="w-full">
        {/* Section header - keeping slight padding for title alignment */}
        <div className="max-w-[1440px] mx-auto px-4 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-foreground dark:text-foreground-dark inline-block border-b-2 border-primary pb-1">
              Featured projects
            </h2>
          </motion.div>
        </div>

        {/* Projects carousel - stretches to edges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full"
        >
          <div className="overflow-visible" ref={emblaRef}>
            <div className="flex gap-4 md:gap-8 pt-4 pb-6 px-4">
              {displayProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  skills={skills}
                  className="flex-[0_0_100%] md:flex-[0_0_85%]"
                />
              ))}
            </div>
          </div>

          {/* Navigation buttons - aligned with container */}
          <div className="max-w-[1440px] mx-auto px-4 mt-6">
            <div className="flex justify-end pr-4 md:pr-10">
              <div className="inline-flex items-center bg-white/5 dark:bg-white/10 rounded-full border-2 border-black/10 dark:border-white/10 p-1.5 gap-3 shadow-2xl backdrop-blur-md">
                <button
                  onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
                  className="w-14 h-14 rounded-full bg-primary text-white border-2 border-white/20 flex items-center justify-center hover:bg-primary/80 hover:scale-105 transition-all shadow-xl active:scale-95"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="w-8 h-8 stroke-[3]" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); scrollNext(); }}
                  className="w-14 h-14 rounded-full bg-primary text-white border-2 border-white/20 flex items-center justify-center hover:bg-primary/80 hover:scale-105 transition-all shadow-xl active:scale-95"
                  aria-label="Next project"
                >
                  <ChevronRight className="w-8 h-8 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
