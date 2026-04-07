import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground dark:text-foreground-dark">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex w-full rounded-lg border border-border dark:border-border-dark bg-background dark:bg-background-dark px-3 py-2 text-sm',
            'placeholder:text-muted dark:placeholder:text-muted-dark',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger focus:ring-danger',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-danger">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
