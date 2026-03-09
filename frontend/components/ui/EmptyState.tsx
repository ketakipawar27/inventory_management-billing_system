
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-4 text-center rounded-[2.5rem] border-2 border-dashed border-neutral-100 dark:border-neutral-900 bg-white/50 dark:bg-neutral-900/20",
      className
    )}>
      {Icon && (
        <div className="p-5 rounded-3xl bg-neutral-100 dark:bg-neutral-800 text-neutral-300 dark:text-neutral-600 mb-5">
          <Icon size={48} strokeWidth={1} />
        </div>
      )}
      <h3 className="text-base font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400">{title}</h3>
      {description && <p className="text-sm text-neutral-400 mt-2 max-w-[280px] mx-auto font-medium">{description}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
};
