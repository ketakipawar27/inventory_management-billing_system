
import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className,
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full rounded-2xl p-4 text-sm bg-neutral-100 dark:bg-black border border-transparent focus:border-neutral-200 dark:focus:border-neutral-800 outline-none transition-all placeholder:text-neutral-400",
            icon && "pl-12",
            error && "border-rose-500/50 focus:border-rose-500",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <span className="text-[10px] font-bold text-rose-500 ml-1 italic">
          {error}
        </span>
      )}
    </div>
  );
};
