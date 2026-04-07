import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Wrench, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { signOut } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/projects', icon: FolderOpen, label: 'Projects' },
    { to: '/dashboard/skills', icon: Wrench, label: 'Skills' },
    { to: '/dashboard/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 bg-background-sidebar dark:bg-background-sidebar-dark border-r border-border dark:border-border-dark transition-transform duration-300',
          'lg:translate-x-0',
          !isOpen && '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-border dark:border-border-dark">
            <span className="text-xl font-bold text-foreground dark:text-foreground-dark">
              Admin Panel
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-foreground/70 dark:text-foreground-dark/70 hover:bg-secondary dark:hover:bg-secondary-dark'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border dark:border-border-dark">
            <button
              onClick={signOut}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
