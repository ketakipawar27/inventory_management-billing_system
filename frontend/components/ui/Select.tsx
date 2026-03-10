import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  options: Option[];
  value?: string | number;
  onChange?: (e: { target: { value: string | number; name?: string } }) => void;
  placeholder?: string;
  className?: string;
  fullWidth?: boolean;
  name?: string;
  disabled?: boolean;
  direction?: "up" | "down"; // NEW PROP
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  icon,
  options,
  value,
  onChange,
  placeholder,
  className,
  fullWidth = true,
  name,
  disabled = false,
  direction = "down", // default to down
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    if (disabled) return;
    if (onChange) {
      onChange({ target: { value: option.value, name } });
    }
    setIsOpen(false);
  };

  return (
    <div className={cn("space-y-1 relative", fullWidth && "w-full")} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">
          {label}
        </label>
      )}

      <div className="relative group">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center text-left transition-all cursor-pointer bg-neutral-100 dark:bg-black border border-transparent focus:border-neutral-200 dark:focus:border-neutral-800 outline-none rounded-xl py-2 px-3 text-sm text-neutral-900 dark:text-white",
            fullWidth && "w-full",
            icon && "pl-8",
            "pr-8",
            error && "border-rose-500/50 focus:border-rose-500",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          {icon && (
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors pointer-events-none z-10">
              {React.isValidElement(icon)
                ? React.cloneElement(icon as any, { size: 14 })
                : icon}
            </div>
          )}

          <span className={cn("block truncate", !selectedOption && "text-neutral-400")}>
            {selectedOption ? selectedOption.label : placeholder || "Select..."}
          </span>

          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none group-focus-within:text-black dark:group-focus-within:text-white transition-colors z-10">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} />
            </motion.div>
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: direction === "down" ? -10 : 10, scale: 0.95 }}
              animate={{ opacity: 1, y: direction === "down" ? 4 : -4, scale: 1 }}
              exit={{ opacity: 0, y: direction === "down" ? -10 : 10, scale: 0.95 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className={cn(
                "absolute left-0 right-0 z-[100] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto min-w-[150px]",
                direction === "down" ? "top-full mt-1" : "bottom-full mb-1"
              )}
            >
              <div className="p-1">
                {options.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-neutral-400 italic">No options available</div>
                ) : (
                  options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt)}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center justify-between",
                        opt.value === value
                          ? "bg-black text-white dark:bg-white dark:text-black font-bold"
                          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      )}
                    >
                      <span className="truncate uppercase tracking-wide font-semibold text-[10px]">
                        {opt.label}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <span className="text-[10px] font-bold text-rose-500 ml-1 italic">
          {error}
        </span>
      )}
    </div>
  );
};