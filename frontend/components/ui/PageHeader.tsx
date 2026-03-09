
import React from 'react';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8", className)}>
      <div className="space-y-1">
        {title && <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{title}</h2>}
        {description && (
          <p className="text-sm sm:text-base text-neutral-500 font-medium">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-3 shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};
