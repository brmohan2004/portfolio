import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  message?: string;
  isDeleting?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  message,
  isDeleting = false,
}: ConfirmModalProps) {
  const [confirmText, setConfirmText] = useState('');

  const handleConfirm = () => {
    if (confirmText === itemName) {
      onConfirm();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-card dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark shadow-2xl overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-danger">
                <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-foreground/80">
                  {message || `This action cannot be undone. To confirm deletion, please type the name of the item below:`}
                </p>
                <p className="text-sm font-black text-foreground dark:text-foreground-dark p-2 bg-secondary/50 dark:bg-secondary-dark rounded-lg border border-dashed border-border dark:border-border-dark select-none">
                  {itemName}
                </p>
              </div>

              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type name here..."
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
              />

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  className="flex-1 text-white"
                  onClick={handleConfirm}
                  disabled={confirmText !== itemName || isDeleting}
                  isLoading={isDeleting}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary dark:hover:bg-secondary-dark transition-colors"
            >
              <X className="w-4 h-4 text-muted" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
