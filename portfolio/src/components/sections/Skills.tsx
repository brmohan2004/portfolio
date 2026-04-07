import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import type { Skill } from '@/types';

interface SkillsProps {
  skills: Skill[];
}

// Skill icon mapping with real logos
const skillIcons: Record<string, string> = {
  'Auto CAD': 'https://upload.wikimedia.org/wikipedia/commons/a/af/Autodesk_AutoCAD_logo.svg',
  'STAAD.Pro': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Bentley_Systems_logo.svg',
  'Revit': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Autodesk_Revit_logo.svg',
  'V-ray': 'https://upload.wikimedia.org/wikipedia/commons/b/b5/V-Ray_Logo.svg',
  'Tekla': 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Tekla_Corporation_Logo.svg',
};


export function Skills({ skills }: SkillsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Default skills if none from database
  const defaultSkills = [
    { id: '1', name: 'Auto CAD', icon_url: '', category: 'software', sort_order: 1 },
    { id: '2', name: 'STAAD.Pro', icon_url: '', category: 'software', sort_order: 2 },
    { id: '3', name: 'Revit', icon_url: '', category: 'software', sort_order: 3 },
    { id: '4', name: 'V-ray', icon_url: '', category: 'software', sort_order: 4 },
    { id: '5', name: 'Tekla', icon_url: '', category: 'software', sort_order: 5 },
  ];

  const displaySkills = skills.length > 0 ? skills : defaultSkills;

  return (
    <section className="py-[40px] bg-background dark:bg-background-dark" ref={ref}>
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-foreground dark:text-foreground-dark inline-block border-b-2 border-primary pb-1">
            Skills & tools
          </h2>
        </motion.div>

        {/* Skills grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-wrap gap-4 md:gap-x-16 md:gap-y-10 justify-center sm:justify-start"
        >
          {displaySkills.map((skill) => (
            <motion.div
              key={skill.id}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="flex items-center gap-3 md:gap-5 px-2 py-1 transition-all"
            >
              {/* Skill icon */}
              <div className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center">
                {skill.icon_url ? (
                  <img
                    src={skill.icon_url}
                    alt={skill.name}
                    className="w-full h-full object-contain"
                  />
                ) : skillIcons[skill.name] ? (
                  <img
                    src={skillIcons[skill.name]}
                    alt={skill.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg md:text-2xl uppercase">
                      {skill.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Skill name */}
              <span className="text-foreground/80 dark:text-foreground-dark/80 font-medium md:text-xl group-hover:text-primary transition-colors">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
