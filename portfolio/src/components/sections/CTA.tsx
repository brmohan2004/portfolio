import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Mail } from 'lucide-react';
import type { Profile } from '@/types';

interface CTAProps {
  profile: Profile | null;
}

export function CTA({ profile }: CTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-[40px] bg-background dark:bg-background-dark" ref={ref}>
      <div className="max-w-[1440px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Hire me heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl font-semibold text-foreground dark:text-foreground-dark inline-block border-b-2 border-primary pb-1 mb-4"
          >
            Hire me
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-muted dark:text-muted-dark max-w-xl mx-auto mb-6"
          >
            {profile?.hire_me_text || 'i am Civil Engineering Student i am searching job, if you can interest you can hire me'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              size="md"
              onClick={() => profile?.email && window.open(`mailto:${profile.email}`, '_blank')}
              className="sm:px-6 sm:py-3 sm:text-lg"
            >
              <Mail className="mr-2 w-4 h-4" />
              Contact Me
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => profile?.resume_url && window.open(profile.resume_url, '_blank')}
              className="sm:px-6 sm:py-3 sm:text-lg"
            >
              <Download className="mr-2 w-4 h-4" />
              View/download Resume
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
