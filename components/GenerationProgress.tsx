'use client';

import { motion } from 'framer-motion';

interface GenerationProgressProps {
  progress: number;
  stage: 'idle' | 'analyzing' | 'colors' | 'typography' | 'components' | 'preview' | 'complete';
}

const STAGE_MESSAGES: Record<string, string> = {
  idle: 'Preparing...',
  analyzing: 'Understanding your vision',
  colors: 'Generating color palette',
  typography: 'Crafting typography system',
  components: 'Designing components',
  preview: 'Finalizing design system',
  complete: 'Complete!',
};

const STAGE_EMOJIS: Record<string, string> = {
  idle: '✨',
  analyzing: '🔍',
  colors: '🎨',
  typography: '📝',
  components: '🧩',
  preview: '👁️',
  complete: '🎉',
};

// Bouncy spring configurations
const springBounce = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 15,
};

const springSmooth = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 25,
};

export function GenerationProgress({ progress, stage }: GenerationProgressProps) {
  return (
    <motion.div 
      className="w-full max-w-sm mx-auto text-center"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={springSmooth}
    >
      {/* Progress indicator */}
      <div className="mb-10">
        <div className="relative w-28 h-28 mx-auto mb-8">
          {/* Outer pulsing glow ring */}
          <motion.div
            className="absolute -inset-4 rounded-full"
            style={{
              background: 'var(--gradient-vibrant)',
              opacity: 0.2,
              filter: 'blur(20px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Rotating gradient ring */}
          <motion.div
            className="absolute -inset-1 rounded-full"
            style={{
              background: 'var(--gradient-vibrant)',
              opacity: 0.3,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full bg-card border-2 border-border" />
          
          {/* Progress ring SVG */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            {/* Track */}
            <circle
              cx="56"
              cy="56"
              r="50"
              fill="none"
              className="stroke-muted"
              strokeWidth="4"
            />
            {/* Progress with gradient */}
            <motion.circle
              cx="56"
              cy="56"
              r="50"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={314}
              initial={{ strokeDashoffset: 314 }}
              animate={{ strokeDashoffset: 314 - (314 * progress) / 100 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-warm)" />
                <stop offset="100%" stopColor="var(--accent-cool)" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Emoji with bounce */}
            <motion.span 
              key={stage}
              className="text-2xl mb-1"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={springBounce}
            >
              {STAGE_EMOJIS[stage]}
            </motion.span>
            
            {/* Percentage with bounce */}
            <motion.span 
              className="text-lg font-bold text-foreground"
              key={Math.round(progress)}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={springBounce}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
        </div>

        {/* Stage message with slide animation */}
        <motion.p
          key={stage}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={springSmooth}
          className="text-base font-medium text-foreground mb-2"
        >
          {STAGE_MESSAGES[stage]}
        </motion.p>
        
        {/* Substage hint */}
        <motion.p
          className="text-sm text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          This might take a moment...
        </motion.p>
      </div>

      {/* Loading dots with pronounced bounce */}
      {stage !== 'complete' && (
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? 'var(--accent-warm)' : 'var(--accent-cool)',
              }}
              animate={{
                y: [0, -12, 0],
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}
      
      {/* Complete state with celebration */}
      {stage === 'complete' && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={springBounce}
          className="flex flex-col items-center gap-3"
        >
          {/* Success icon with gradient */}
          <motion.div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'var(--gradient-vibrant)' }}
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 0.5 }}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              />
            </svg>
          </motion.div>
          
          {/* Confetti particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? 'var(--accent-warm)' : 'var(--accent-cool)',
              }}
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 1, 
                scale: 1,
              }}
              animate={{ 
                x: Math.cos(i * 45 * Math.PI / 180) * 60,
                y: Math.sin(i * 45 * Math.PI / 180) * 60 - 20,
                opacity: 0,
                scale: 0,
              }}
              transition={{ 
                duration: 0.8, 
                delay: 0.1,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
