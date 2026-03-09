
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  asForm?: boolean;
  onSubmit?: (e: React.FormEvent) => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  asForm = false,
  onSubmit
}) => {
  const Container = asForm ? 'form' : 'div';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={cn(
              "relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col max-h-[90vh]",
              className
            )}
          >
            <Container onSubmit={asForm ? onSubmit : undefined} className="flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-black/20 shrink-0">
                <h2 className="text-lg font-black tracking-tight">{title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  type="button"
                  className="rounded-full p-2 h-9 w-9"
                  icon={<X size={20} />}
                />
              </div>

              <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
                {children}
              </div>

              {footer && (
                <div className="p-6 bg-neutral-50/50 dark:bg-black/20 border-t border-neutral-100 dark:border-neutral-800 flex justify-end gap-3 shrink-0">
                  {footer}
                </div>
              )}
            </Container>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
