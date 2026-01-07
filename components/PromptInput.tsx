'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { VIBE_SUGGESTIONS, type DesignMood, type DesignStyle } from '@/lib/types';

interface PromptInputProps {
  onGenerate: (prompt: string, mood?: DesignMood, style?: DesignStyle) => void;
  isGenerating: boolean;
}

const PLACEHOLDERS = [
  "A SaaS dashboard for analytics...",
  "E-commerce site for luxury watches...",
  "Portfolio for a design studio...",
  "Landing page for an AI startup...",
  "Mobile app for meditation...",
];

// Bouncy spring configurations
const springBounce = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 17,
};

const springSmooth = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 25,
};

export function PromptInput({ onGenerate, isGenerating }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleRandomize = () => {
    const randomSuggestion = VIBE_SUGGESTIONS[Math.floor(Math.random() * VIBE_SUGGESTIONS.length)];
    setPrompt(randomSuggestion);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Main input container with glow effects */}
      <motion.div 
        className="relative flex items-center gap-3 px-5 py-4 bg-transparent border border-border/50 rounded-2xl transition-all duration-300 hover:border-accent-warm/30"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...springSmooth, delay: 0.1 }}
        whileHover={{ scale: 1.01, y: -2 }}
      >
        {/* Sparkle icon button with bounce */}
        <motion.button
          type="button"
          onClick={handleRandomize}
          disabled={isGenerating}
          className="relative flex-shrink-0 p-2 rounded-lg text-muted-foreground hover:text-accent-warm disabled:opacity-50 transition-colors"
          title="Random inspiration"
          whileHover={{ scale: 1.15, rotate: 15 }}
          whileTap={{ scale: 0.85, rotate: -15 }}
          transition={springBounce}
        >
          <motion.div
            animate={isGenerating ? {} : { rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
        </motion.button>

        {/* Input - fully transparent, no inner box */}
        <div className="relative flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {!prompt && !isFocused && (
              <motion.span
                key={placeholderIndex}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 0.4, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={springSmooth}
                className="absolute inset-0 flex items-center text-muted-foreground pointer-events-none truncate"
              >
                {PLACEHOLDERS[placeholderIndex]}
              </motion.span>
            )}
          </AnimatePresence>
          <input
            ref={inputRef}
            type="text"
            suppressHydrationWarning
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? "Describe your design vision..." : ""}
            disabled={isGenerating}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none border-none disabled:opacity-50 text-[15px] focus:outline-none focus:ring-0 focus:border-none focus:shadow-none [&:focus-visible]:outline-none [&:focus-visible]:ring-0 [&:focus-visible]:shadow-none"
          />
        </div>

        {/* Submit Button with gradient and bounce */}
        <motion.button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className={`
            relative flex-shrink-0 flex items-center justify-center gap-2 
            px-6 py-3 rounded-xl
            text-sm font-semibold
            overflow-hidden
            ${prompt.trim() && !isGenerating
              ? 'bg-foreground text-background'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
          whileHover={prompt.trim() && !isGenerating ? { 
            scale: 1.05, 
            y: -3,
          } : {}}
          whileTap={prompt.trim() && !isGenerating ? { scale: 0.95 } : {}}
          transition={springBounce}
        >
          {/* Hover gradient overlay */}
          {prompt.trim() && !isGenerating && (
            <motion.div
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: 'var(--gradient-warm)' }}
            />
          )}
          
          {isGenerating ? (
            <motion.div
              className="flex items-center gap-2 relative z-10"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Generating</span>
            </motion.div>
          ) : (
            <motion.div className="flex items-center gap-2 relative z-10">
              <span className="hidden sm:inline">Generate</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      {/* Hints with playful entrance */}
      <motion.div 
        className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, ...springSmooth }}
      >
        <motion.kbd 
          className="px-2 py-1 rounded-lg bg-muted border border-border text-foreground/70 font-mono text-[10px]"
          whileHover={{ scale: 1.1, y: -2 }}
          transition={springBounce}
        >
          ↵
        </motion.kbd>
        <span>to generate</span>
        <span className="mx-2 text-border">·</span>
        <span>Click</span>
        <motion.div
          whileHover={{ scale: 1.2, rotate: 20 }}
          transition={springBounce}
        >
          <Sparkles className="w-3 h-3 text-accent-warm" />
        </motion.div>
        <span>for inspiration</span>
      </motion.div>
    </form>
  );
}
