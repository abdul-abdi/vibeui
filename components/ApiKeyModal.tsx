'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Key, Sparkles } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  error?: string | null;
}

// Bouncy spring configurations
const springBounce = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 20,
};

const springSmooth = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 25,
};

export function ApiKeyModal({ isOpen, onClose, onSave }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('gemini-api-key', apiKey.trim());
      onSave(apiKey.trim());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={springSmooth}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="relative bg-card border-2 border-border rounded-2xl p-8 mx-4 shadow-2xl overflow-hidden">
              {/* Background gradient effect */}
              <div 
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ background: 'var(--gradient-surface)' }}
              />
              
              {/* Decorative orb */}
              <motion.div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl"
                style={{ background: 'var(--accent-warm-muted)' }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Header */}
              <div className="relative flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--gradient-warm)' }}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Key className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">API Key Required</h2>
                    <p className="text-sm text-muted-foreground">One-time setup</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={springBounce}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Content */}
              <p className="relative text-sm text-muted-foreground mb-5 leading-relaxed">
                Enter your Gemini API key to start generating design systems. 
                Your key is stored locally and never sent to our servers.
              </p>

              <motion.a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-2 text-sm font-medium mb-6 group"
                style={{ color: 'var(--accent-warm)' }}
                whileHover={{ x: 4 }}
                transition={springBounce}
              >
                <Sparkles className="w-4 h-4" />
                Get a free API key
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.a>

              {/* Form */}
              <form onSubmit={handleSubmit} className="relative space-y-5">
                <div className="relative">
                  <motion.input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="AIza..."
                    className={`
                      w-full px-4 py-3.5 rounded-xl 
                      bg-input-bg border-2 
                      text-foreground text-sm 
                      placeholder:text-muted-foreground 
                      outline-none transition-all duration-300
                      ${isFocused 
                        ? 'border-accent-warm shadow-[0_0_20px_-5px_var(--accent-warm-glow)]' 
                        : 'border-border hover:border-accent-warm/30'
                      }
                    `}
                    animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
                    transition={springSmooth}
                  />
                  {/* Input glow effect */}
                  <AnimatePresence>
                    {isFocused && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{
                          background: 'var(--gradient-surface)',
                        }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={springBounce}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={!apiKey.trim()}
                    className={`
                      relative flex-1 px-4 py-3 rounded-xl text-sm font-semibold overflow-hidden
                      ${apiKey.trim()
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }
                    `}
                    whileHover={apiKey.trim() ? { scale: 1.02, y: -2 } : {}}
                    whileTap={apiKey.trim() ? { scale: 0.98 } : {}}
                    transition={springBounce}
                  >
                    {/* Hover gradient */}
                    {apiKey.trim() && (
                      <motion.div
                        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                        style={{ background: 'var(--gradient-warm)' }}
                      />
                    )}
                    <span className="relative z-10">Save & Continue</span>
                  </motion.button>
                </div>
              </form>
              
              {/* Security note */}
              <motion.p 
                className="relative mt-5 text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Stored securely in your browser
              </motion.p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
