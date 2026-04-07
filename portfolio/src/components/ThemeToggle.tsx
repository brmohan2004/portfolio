import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-full bg-card dark:bg-card-dark border border-border dark:border-border-dark flex items-center justify-center">
        <span className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full bg-card dark:bg-card-dark border border-border dark:border-border-dark flex items-center justify-center hover:bg-border dark:hover:bg-border-dark transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-foreground dark:text-foreground-dark" />
      ) : (
        <Sun className="w-5 h-5 text-foreground dark:text-foreground-dark" />
      )}
    </button>
  );
}
