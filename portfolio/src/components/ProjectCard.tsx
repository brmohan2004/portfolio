import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Maximize2 } from 'lucide-react';
import type { Project, Skill } from '@/types';

interface ProjectCardProps {
  project: Project;
  skills?: Skill[];
  onSelect?: (p: Project) => void;
  className?: string;
}

export function ProjectCard({ project, skills = [], onSelect, className = '' }: ProjectCardProps) {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 20, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(project);
    } else {
      navigate(`/project/${project.slug}`);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`min-w-0 ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        whileHover={{ y: -4 }}
        className="group relative bg-[#F3F4F6] dark:bg-card-dark rounded-[2rem] p-2.5 shadow-xl border-2 border-black dark:border-white/20 cursor-pointer flex flex-col md:flex-row gap-6 items-center h-full"
        onClick={handleClick}
      >
        {/* Software Icon (Top Left) */}
        <div className="absolute -top-5 -left-2.5 w-12 h-12 bg-white dark:bg-card-dark rounded-full border-2 border-black dark:border-white/20 flex items-center justify-center z-40 shadow-lg group-hover:scale-110 transition-transform p-2.5">
          {(() => {
            const firstTool = project.tools?.[0];
            const matchingSkill = skills.find(s => s.name === firstTool);
            
            if (matchingSkill?.icon_url) {
              return (
                <img
                  src={matchingSkill.icon_url}
                  className="w-full h-full object-contain"
                  alt={firstTool}
                />
              );
            }
            
            return (
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-black text-primary text-lg">
                {firstTool?.charAt(0) || 'P'}
              </div>
            );
          })()}
        </div>

        {/* Link Icon (Top Right) */}
        <div className="absolute -top-5 -right-2.5 w-12 h-12 bg-white dark:bg-card-dark rounded-full border-2 border-black dark:border-white/20 flex items-center justify-center z-40 shadow-lg group-hover:scale-110 transition-transform">
          <ExternalLink className="w-6 h-6 text-black dark:text-white" strokeWidth={2} />
        </div>

        {/* Custom Cursor Text */}
        <motion.div
          style={{
            x: springX,
            y: springY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          className="absolute z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full border border-black/10 shadow-2xl backdrop-blur-md">
            <span className="font-black tracking-[0.2em] text-xs md:text-sm whitespace-nowrap">VIEW PROJECT</span>
          </div>
        </motion.div>

        {/* Project image container */}
        <div className="relative w-full md:w-[58%] aspect-video md:aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-[#E5E7EB] dark:bg-muted/10 border border-black/5 shadow-inner flex items-center justify-center">
          {project.cover_image ? (
            <img
              src={project.cover_image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-xl">
                <span className="text-3xl font-black text-primary">
                  {project.title.charAt(0)}
                </span>
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">No Preview Available</p>
            </div>
          )}
        </div>

        {/* Text content container */}
        <div className="flex-1 w-full p-2 md:p-4 text-left">
          <div className="space-y-4">
            <h3 className="text-2xl md:text-4xl font-black text-black dark:text-white tracking-tighter leading-none">
              {project.title}
            </h3>

            <div className="flex items-center gap-3">
              <div className="h-1.5 w-10 bg-primary rounded-full shadow-sm shadow-primary/20" />
            </div>

            <div className="space-y-1">
              {(project.description || '').split('|').map((part, i) => (
                <p key={i} className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-bold leading-tight">
                  {part.trim()}
                </p>
              ))}
            </div>
          </div>

          {/* View Button (Mobile only indicator) */}
          <div className="md:hidden mt-4 flex items-center text-primary font-bold gap-2">
            View Details <Maximize2 className="w-4 h-4" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
