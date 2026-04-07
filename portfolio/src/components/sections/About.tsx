import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import type { Profile } from '@/types';

interface AboutProps {
  profile: Profile | null;
}

export function About({ profile }: AboutProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-[30px] bg-background dark:bg-background-dark" ref={ref}>
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-semibold text-foreground dark:text-foreground-dark inline-block border-b-2 border-primary pb-1">
            About Me
          </h2>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl"
        >
          <p className="text-lg text-foreground dark:text-foreground-dark leading-relaxed">
            {profile?.bio || 'Civil Engineer specialized in structural analysis and steel detailing. Experienced in Tekla, STAAD, and BIM workflows with practical site exposure. Focused on delivering construction-ready solutions.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
