'use client';

import { motion } from 'framer-motion';
import { Sparkles, Palette, Type, Layout, Zap } from 'lucide-react';

const INSPIRATION_ITEMS = [
  {
    title: 'Glassmorphic SaaS',
    description: 'Frosted glass effects with aurora gradients',
    colors: ['#a78bfa', '#22d3ee', '#f472b6'],
    icon: <Palette className="w-5 h-5" />,
  },
  {
    title: 'Neubrutalist Portfolio',
    description: 'Bold borders, high contrast, raw aesthetic',
    colors: ['#fbbf24', '#0f0f10', '#ef4444'],
    icon: <Zap className="w-5 h-5" />,
  },
  {
    title: 'Minimal E-commerce',
    description: 'Clean typography, spacious layouts',
    colors: ['#0f0f10', '#fafafa', '#7c3aed'],
    icon: <Type className="w-5 h-5" />,
  },
  {
    title: 'Dark Mode Dashboard',
    description: 'Bento grids with subtle glows',
    colors: ['#0a0a0c', '#22d3ee', '#10b981'],
    icon: <Layout className="w-5 h-5" />,
  },
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

export function InspirationGallery({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div 
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSmooth}
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-warm)' }} />
        </motion.div>
        <h3 className="text-lg font-semibold text-foreground">Need Inspiration?</h3>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {INSPIRATION_ITEMS.map((item, index) => (
          <motion.button
            key={item.title}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...springSmooth, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.03, 
              y: -8,
              boxShadow: '0 20px 40px -10px var(--shadow-color)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(`${item.title.toLowerCase()} - ${item.description.toLowerCase()}`)}
            className="relative rounded-2xl p-6 text-left group overflow-hidden border-2 border-border bg-card hover:border-accent-warm/40 transition-colors"
          >
            {/* Background gradient on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'var(--gradient-surface)' }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-warm/5 to-transparent pointer-events-none"
            />
            
            <div className="flex items-start gap-4 relative z-10">
              {/* Color preview with bounce */}
              <motion.div 
                className="flex-shrink-0"
                animate={{ 
                  rotate: [0, 3, -3, 0],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: 'easeInOut',
                  delay: index * 0.2
                }}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex shadow-lg border border-border">
                  {item.colors.map((color, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 h-full"
                      style={{ backgroundColor: color }}
                      animate={{
                        opacity: [1, 0.7, 1],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <motion.span 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--accent-warm)' }}
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {item.icon}
                  </motion.span>
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              
              {/* Arrow indicator */}
              <motion.div
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                <svg 
                  className="w-5 h-5 text-muted-foreground" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
