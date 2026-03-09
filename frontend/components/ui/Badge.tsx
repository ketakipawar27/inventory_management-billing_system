
import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className
}) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    error: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    outline: 'border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-500',
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
