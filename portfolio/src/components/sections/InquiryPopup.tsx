import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Building2, User, Mail, MessageSquare } from 'lucide-react';

interface InquiryPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InquiryPopup({ isOpen, onClose }: InquiryPopupProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setFormData({ name: '', company: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="inquiry-popup" className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-background dark:bg-card-dark w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl border border-border dark:border-border-dark flex flex-col"
          >
            <div className="max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted dark:hover:bg-muted-dark transition-colors z-10"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              <div className="p-8">
                <div className="mb-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark">
                    Development Inquiry
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Looking for custom structural solutions? Send us your requirements.
                  </p>
                </div>

                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold">Request Sent!</h3>
                    <p className="text-muted-foreground">We'll get back to you shortly.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-muted/50 dark:bg-muted-dark/50 border border-border dark:border-border-dark rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                          placeholder="Your name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium ml-1">Company Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          required
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full bg-muted/50 dark:bg-muted-dark/50 border border-border dark:border-border-dark rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                          placeholder="Company name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium ml-1">Work Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-muted/50 dark:bg-muted-dark/50 border border-border dark:border-border-dark rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                          placeholder="work@company.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium ml-1">Project Requirements</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <textarea
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={4}
                          className="w-full bg-muted/50 dark:bg-muted-dark/50 border border-border dark:border-border-dark rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                          placeholder="Describe your project..."
                        />
                      </div>
                    </div>

                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none mt-4"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Submit Inquiry
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
