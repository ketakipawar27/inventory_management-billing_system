
import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
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
        <select
          className={cn(
            "w-full rounded-2xl p-4 text-sm bg-neutral-100 dark:bg-black border border-transparent focus:border-neutral-200 dark:focus:border-neutral-800 outline-none appearance-none transition-all cursor-pointer",
            error && "border-rose-500/50 focus:border-rose-500",
            className
          )}
          {...props}
        >
          {props.placeholder && (
            <option value="" disabled>
              {props.placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
          <ChevronDown size={18} />
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
