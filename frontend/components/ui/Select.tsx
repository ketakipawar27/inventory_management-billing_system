
import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  icon,
  options,
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
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors pointer-events-none z-10">
            {React.isValidElement(icon) ? React.cloneElement(icon as any, { size: 16 }) : icon}
          </div>
        )}
        <select
          className={cn(
            "w-full rounded-2xl py-2.5 px-4 text-sm bg-neutral-100 dark:bg-black border border-transparent focus:border-neutral-200 dark:focus:border-neutral-800 outline-none appearance-none transition-all cursor-pointer text-neutral-900 dark:text-white placeholder:text-neutral-400",
            icon && "pl-11",
            "pr-11",
            error && "border-rose-500/50 focus:border-rose-500",
            className
          )}
          {...props}
          value={props.value ?? ""}
        >
          {props.placeholder && (
            <option value="" disabled hidden>
              {props.placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none group-focus-within:text-black dark:group-focus-within:text-white transition-colors z-10">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && (
        <span className="text-[10px] font-bold text-rose-500 ml-1 italic">
          {error}
        </span>
      )}
    </div>
  );
};
