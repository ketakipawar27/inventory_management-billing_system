
import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable = false }) => {
  return (
    <div className={cn(
      "p-6 rounded-2xl bg-white dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 transition-all duration-300",
      hoverable && "hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm",
      className
    )}>
      {children}
    </div>
  );
};
