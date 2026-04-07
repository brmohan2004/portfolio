import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, ArrowRight } from 'lucide-react';
import type { Profile } from '@/types';

interface HeroProps {
  profile: Profile | null;
}

export function Hero({ profile }: HeroProps) {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-[80vh] flex flex-col overflow-hidden bg-background dark:bg-background-dark">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 py-[40px]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Profile Image - Mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:hidden flex justify-center"
            >
              <div className="relative">
                <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-background dark:border-background-dark">
                  {profile?.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary">
                        {profile?.name?.charAt(0) || 'M'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <div className="space-y-4">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-muted dark:text-muted-dark text-base"
              >
                Hi, I&apos;m
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground dark:text-foreground-dark tracking-tight"
              >
                {profile?.name || 'Mohan B R'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-base sm:text-lg text-primary font-medium"
              >
                {profile?.title || 'Tekla Structural Detailer | Structural Design Engineer'}
              </motion.p>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-base text-muted dark:text-muted-dark max-w-xl leading-relaxed"
            >
              {profile?.hero_description || 'I create steel structures, GA drawings, and BIM models ready for real-world construction.'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="md"
                onClick={scrollToProjects}
                className="group sm:px-6 sm:py-3 sm:text-lg"
              >
                View Projects
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
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

          {/* Right content - Profile Image Desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl transform rotate-6 scale-105" />

              {/* Main image container */}
              <div className="relative w-80 h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-background dark:border-background-dark">
                {profile?.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-background dark:to-background-dark flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-8xl font-bold text-primary/40">
                        {profile?.name?.charAt(0) || 'M'}
                      </span>
                      <p className="mt-4 text-muted dark:text-muted-dark">Profile Image</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-4 -right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg"
              >
                <p className="text-sm font-medium">Available for Work</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-muted dark:border-muted-dark rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-muted dark:bg-muted-dark rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
