'use client';

import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

// Custom VibeUI Logo SVG with gradient
function VibeUILogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent-warm)" />
          <stop offset="100%" stopColor="var(--accent-cool)" />
        </linearGradient>
      </defs>
      {/* Background with gradient border effect */}
      <rect 
        width="32" 
        height="32" 
        rx="10" 
        className="fill-foreground dark:fill-white" 
      />
      
      {/* V shape */}
      <path
        d="M8 10L16 22L24 10"
        className="stroke-background dark:stroke-zinc-900"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Accent dot with gradient */}
      <circle 
        cx="16" 
        cy="22" 
        r="2.5" 
        fill="url(#logoGradient)"
      />
    </svg>
  );
}

// Bouncy spring configuration
const springBounce = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 15,
};

const springHover = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20,
};

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Subtle gradient fade for seamless integration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-5xl px-6 py-5">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <motion.a 
            href="/" 
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={springBounce}
          >
            <motion.div 
              whileHover={{ 
                rotate: [0, -10, 10, -5, 0],
                transition: { duration: 0.5 }
              }}
              className="relative"
            >
              <motion.div
                className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'var(--gradient-vibrant)',
                  filter: 'blur(8px)',
                }}
              />
              <VibeUILogo className="w-9 h-9 relative" />
            </motion.div>
            <div className="flex flex-col">
              <motion.span 
                className="text-sm font-semibold text-foreground"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                VibeUI
              </motion.span>
              <motion.span 
                className="text-[10px] text-muted-foreground font-medium tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Design System Generator
              </motion.span>
            </div>
          </motion.a>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-10 h-10 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground overflow-hidden group"
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={springBounce}
            >
              {/* Hover background effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'var(--gradient-cool)',
                }}
                initial={false}
              />
              <Github className="w-[18px] h-[18px] relative z-10 group-hover:text-white transition-colors" />
            </motion.a>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
