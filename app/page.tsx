'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { PromptInput } from '@/components/PromptInput';
import { GenerationProgress } from '@/components/GenerationProgress';
import { DesignExplorer } from '@/components/DesignExplorer';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { Header } from '@/components/Header';
import { FloatingOrbs } from '@/components/FloatingOrbs';
import { generateVibe } from '@/lib/gemini';
import type { VibeResult, DesignMood, DesignStyle } from '@/lib/types';

type AppState = 'landing' | 'generating' | 'result';
type GenerationStage = 'idle' | 'analyzing' | 'colors' | 'typography' | 'components' | 'preview' | 'complete';

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

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState<GenerationStage>('idle');
  const [result, setResult] = useState<VibeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [pendingGeneration, setPendingGeneration] = useState<{
    prompt: string;
    mood?: DesignMood;
    style?: DesignStyle;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('gemini-api-key');
    if (stored) {
      setApiKey(stored);
    }
  }, []);

  const simulateProgress = useCallback(() => {
    const stages: { stage: GenerationStage; progress: number; duration: number }[] = [
      { stage: 'analyzing', progress: 15, duration: 800 },
      { stage: 'colors', progress: 35, duration: 1200 },
      { stage: 'typography', progress: 55, duration: 1000 },
      { stage: 'components', progress: 75, duration: 1500 },
      { stage: 'preview', progress: 90, duration: 2000 },
    ];

    let currentIndex = 0;

    const advanceStage = () => {
      if (currentIndex < stages.length) {
        const { stage, progress, duration } = stages[currentIndex];
        setGenerationStage(stage);
        setGenerationProgress(progress);
        currentIndex++;
        setTimeout(advanceStage, duration);
      }
    };

    advanceStage();
  }, []);

  const handleGenerate = useCallback(async (prompt: string, mood?: DesignMood, style?: DesignStyle) => {
    if (!apiKey) {
      setPendingGeneration({ prompt, mood, style });
      setShowApiModal(true);
      return;
    }

    setAppState('generating');
    setError(null);
    setGenerationProgress(0);
    setGenerationStage('idle');

    simulateProgress();

    try {
      const vibeResult = await generateVibe({
        prompt,
        mood,
        style,
        apiKey,
      });

      setGenerationProgress(100);
      setGenerationStage('complete');
      setResult(vibeResult);
      
      setTimeout(() => {
        setAppState('result');
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setAppState('landing');
      setGenerationStage('idle');
    }
  }, [apiKey, simulateProgress]);

  const handleApiKeySave = (key: string) => {
    setApiKey(key);
    setShowApiModal(false);
    
    if (pendingGeneration) {
      handleGenerate(pendingGeneration.prompt, pendingGeneration.mood, pendingGeneration.style);
      setPendingGeneration(null);
    }
  };

  const handleBackToLanding = () => {
    setAppState('landing');
    setResult(null);
    setGenerationProgress(0);
    setGenerationStage('idle');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="aurora-bg" />
      <div className="grid-pattern" />
      
      {/* Floating Orbs - Theme aware */}
      <FloatingOrbs />

      {/* Header - floats seamlessly over content */}
      <Header />

      {/* Main Content - extends to top for seamless feel */}
      <main className="relative z-10 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {appState === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col items-center justify-center px-6 py-24"
            >
              {/* Hero Section - Playful & Alive */}
              <div className="text-center mb-16 max-w-3xl">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ ...springSmooth, delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-8"
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles className="w-4 h-4 text-accent-warm" style={{ color: 'var(--accent-warm)' }} />
                  </motion.div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    AI-Powered Design System Generator
                  </span>
                </motion.div>

                {/* Main headline with gradient */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springSmooth, delay: 0.2 }}
                  className="text-display mb-6"
                >
                  <motion.span
                    className="gradient-text block"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springSmooth, delay: 0.3 }}
                  >
                    Design systems,
                  </motion.span>
                  <motion.span
                    className="gradient-text-vibrant block"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springSmooth, delay: 0.4 }}
                  >
                    instantly crafted.
                  </motion.span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springSmooth, delay: 0.5 }}
                  className="text-body-lg max-w-xl mx-auto"
                >
                  Describe your vision. Get a complete design system with colors,
                  typography, and components—powered by{' '}
                  <span className="font-medium text-foreground">Gemini AI</span>.
                </motion.p>
              </div>

              {/* Prompt Input */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springSmooth, delay: 0.6 }}
                className="w-full max-w-2xl"
              >
                <PromptInput
                  onGenerate={handleGenerate}
                  isGenerating={false}
                />
              </motion.div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={springBounce}
                    className="mt-6 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-small max-w-md text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Features with bouncy stagger */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-20 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
              >
                {['Color palettes', 'Typography scales', 'Components', 'Export ready'].map((feature, i) => (
                  <motion.span 
                    key={feature}
                    className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ ...springBounce, delay: 0.9 + i * 0.1 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -3,
                      borderColor: 'var(--accent-warm-muted)',
                    }}
                  >
                    <motion.span 
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        background: i % 2 === 0 ? 'var(--accent-warm)' : 'var(--accent-cool)' 
                      }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    />
                    {feature}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          )}

          {appState === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex items-center justify-center px-6"
            >
              <GenerationProgress progress={generationProgress} stage={generationStage} />
            </motion.div>
          )}

          {appState === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 px-6 pt-24 pb-12"
            >
              {/* Back Button with bounce */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...springSmooth, delay: 0.2 }}
                onClick={handleBackToLanding}
                className="fixed top-20 left-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground bg-card/50 backdrop-blur-sm border border-border hover:border-accent-warm/30 transition-all"
                whileHover={{ scale: 1.05, x: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </motion.button>

              <DesignExplorer result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiModal}
        onClose={() => {
          setShowApiModal(false);
          setPendingGeneration(null);
        }}
        onSave={handleApiKeySave}
        error={error}
      />
    </div>
  );
}
