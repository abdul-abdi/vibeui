'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function FloatingOrbs() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === 'dark';

  // Spring transition for bouncy feel
  const springTransition = {
    type: 'spring',
    stiffness: 50,
    damping: 20,
    mass: 2,
  };

  // Bouncy keyframes for orbs
  const orbBounce = {
    scale: [1, 1.15, 0.95, 1.08, 1],
    rotate: [0, 3, -3, 1, 0],
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Primary orb - Large violet/purple */}
      <motion.div
        animate={{
          x: [0, 180, 60, -80, 0],
          y: [0, -100, 120, -40, 0],
          ...orbBounce,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, var(--orb-1) 0%, transparent 70%)`,
        }}
      />

      {/* Secondary orb - Cyan/teal */}
      <motion.div
        animate={{
          x: [0, -150, 80, -40, 0],
          y: [0, 130, -80, 100, 0],
          scale: [1, 0.9, 1.12, 0.95, 1],
          rotate: [0, -4, 4, -2, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, var(--orb-2) 0%, transparent 70%)`,
        }}
      />

      {/* Accent orb - Pink/magenta */}
      <motion.div
        animate={{
          x: [0, 120, -100, 60, 0],
          y: [0, -150, 50, -80, 0],
          scale: [1, 1.2, 0.88, 1.1, 1],
          rotate: [0, 5, -5, 2, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, var(--orb-3) 0%, transparent 70%)`,
        }}
      />

      {/* Fourth orb - Indigo, top right */}
      <motion.div
        animate={{
          x: [0, -100, 50, -70, 0],
          y: [0, 80, -50, 100, 0],
          scale: [1, 1.1, 0.92, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-10 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, var(--orb-4) 0%, transparent 70%)`,
        }}
      />

      {/* Fifth orb - Bottom accent */}
      <motion.div
        animate={{
          x: [0, 70, -50, 90, 0],
          y: [0, -60, 40, -30, 0],
          scale: [1, 1.15, 0.9, 1.08, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-20 right-1/3 w-[350px] h-[350px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, var(--orb-1) 0%, transparent 70%)`,
          opacity: 0.7,
        }}
      />

      {/* Floating particles with bounce */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -40 - (i % 4) * 15, 10, -20 - (i % 3) * 10, 0],
            x: [0, (i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 8), 0],
            scale: [1, 1.3, 0.9, 1.15, 1],
            opacity: [0.3, 0.8, 0.5, 0.9, 0.3],
          }}
          transition={{
            duration: 5 + (i % 5),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
          className="absolute rounded-full"
          style={{
            width: `${5 + (i % 4) * 3}px`,
            height: `${5 + (i % 4) * 3}px`,
            left: `${8 + i * 6}%`,
            top: `${12 + (i % 6) * 15}%`,
            background: `var(--orb-particle)`,
            boxShadow: isDark 
              ? `0 0 ${10 + i * 2}px var(--orb-particle)`
              : `0 0 ${8 + i}px var(--accent-warm-muted)`,
          }}
        />
      ))}

      {/* Orbiting accent dots with bounce */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`orbit-${i}`}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 25 + i * 4,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute"
          style={{
            left: `${25 + i * 8}%`,
            top: `${20 + (i % 4) * 20}%`,
          }}
        >
          <motion.div
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.7, 1.4, 0.7],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
            className="rounded-full"
            style={{
              width: `${6 + (i % 3) * 2}px`,
              height: `${6 + (i % 3) * 2}px`,
              background: i % 2 === 0 ? 'var(--orb-accent)' : 'var(--accent-cool)',
              transform: `translateX(${50 + i * 18}px)`,
              boxShadow: `0 0 12px ${i % 2 === 0 ? 'var(--accent-warm-glow)' : 'var(--accent-cool-glow)'}`,
            }}
          />
        </motion.div>
      ))}

      {/* Shooting stars with bounce */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`streak-${i}`}
          initial={{ x: '-100%', y: '100%', opacity: 0 }}
          animate={{
            x: ['150%', '-150%'],
            y: ['-30%', '120%'],
            opacity: [0, 0.8, 0.8, 0],
            scaleX: [0.5, 1.2, 1, 0.5],
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 5,
          }}
          className="absolute w-40 h-[2px] rounded-full"
          style={{
            top: `${15 + i * 22}%`,
            background: `linear-gradient(90deg, transparent 0%, ${
              i % 2 === 0 ? 'var(--accent-warm)' : 'var(--accent-cool)'
            } 50%, transparent 100%)`,
            transform: 'rotate(45deg)',
            filter: 'blur(0.5px)',
          }}
        />
      ))}

      {/* Pulsing glow rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeOut',
            delay: i * 1.5,
          }}
          className="absolute rounded-full border"
          style={{
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
            left: `${30 + i * 15}%`,
            top: `${25 + i * 10}%`,
            borderColor: i % 2 === 0 ? 'var(--accent-warm-muted)' : 'var(--accent-cool-muted)',
          }}
        />
      ))}
    </div>
  );
}
