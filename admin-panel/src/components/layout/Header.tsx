import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-background/80 dark:bg-background-dark/80 backdrop-blur-lg border-b border-border dark:border-border-dark">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-lg bg-secondary dark:bg-secondary-dark flex items-center justify-center"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
