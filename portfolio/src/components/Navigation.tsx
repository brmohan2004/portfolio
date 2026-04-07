import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Mail, Home, Download, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from './ui/button';
import type { Profile } from '@/types';

interface NavigationProps {
  profile: Profile | null;
}

export function Navigation({ profile }: NavigationProps) {
  const { theme, toggleTheme } = useTheme();
  const [showTopDownload, setShowTopDownload] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show top download button after scrolling past hero (~500px)
      setShowTopDownload(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#hero', label: 'Home', icon: Home },
    { href: '#projects', label: 'Projects', icon: Briefcase },
    { href: '#about', label: 'About', icon: User },
    { href: '#contact', label: 'Contact', icon: Mail },
  ];

  const handleDownload = () => {
    if (profile?.resume_url) {
      window.open(profile.resume_url, '_blank');
    }
  };

  return (
    <>
      {/* Top Header - Visible on scroll */}
      <AnimatePresence>
        {showTopDownload && (
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1A1C1E]/80 backdrop-blur-xl border-b-2 border-black/5 dark:border-white/5 transition-all duration-300"
          >
            <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 h-18 flex items-center justify-end py-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="rounded-full"
              >
                <Download className="mr-2 w-4 h-4" />
                Resume
              </Button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <motion.nav
        initial={{ y: 100, x: '-50%' }}
        animate={{ y: 0, x: '-50%' }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed bottom-6 left-1/2 z-50 flex items-center bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-3xl border-2 border-black dark:border-white px-6 py-1.5 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] space-x-2 md:space-x-4 w-[95%] md:w-auto md:max-w-max ring-1 ring-black/5 dark:ring-white/10"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex-1 md:flex-none flex flex-col items-center justify-center p-1.5 rounded-2xl text-black/60 dark:text-white/60 hover:text-primary dark:hover:text-primary hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 group"
          >
            <link.icon className="w-5 h-5 mb-0.5 text-black dark:text-white group-hover:scale-110 transition-all" />
            <span className="text-[9px] font-black uppercase tracking-widest text-black/80 dark:text-white/80">{link.label}</span>
          </a>
        ))}

        <div className="w-[1.5px] h-8 bg-black/10 dark:bg-white/20 mx-2" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex-none p-2.5 rounded-full text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 bg-black/5 dark:bg-white/5 shadow-inner"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)] transition-transform hover:rotate-90" />
          ) : (
            <Moon className="w-5 h-5 text-slate-800 transition-transform hover:-rotate-12" />
          )}
        </button>
      </motion.nav>
    </>
  );
}
