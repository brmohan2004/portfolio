import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="py-12 bg-background dark:bg-background-dark border-t border-border dark:border-border-dark">
      <div className="max-w-[1440px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          {/* Copyright */}
          <p className="text-sm text-muted dark:text-muted-dark mb-4">
            &copy; {new Date().getFullYear()} Mohan B R. All rights reserved.
          </p>

          {/* Development Inquiry Button */}
          <button
            onClick={() => window.open('https://anthatech.me/', '_blank')}
            className="mb-8 text-xs font-semibold px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all active:scale-95"
          >
            Contact for Development (Antha tech)
          </button>

          {/* Logo */}
          <div>
            <span className="text-8xl sm:text-9xl lg:text-[12rem] font-black text-muted/10 dark:text-muted-dark/10 tracking-tighter uppercase select-none leading-none">
              Qynta
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
