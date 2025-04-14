
import React, { useEffect } from 'react';
import { VibeProvider, useVibe } from '@/lib/vibe-engine';
import { VibeControls } from '@/components/vibe-controls';
import { VibeInfo } from '@/components/vibe-info';
import { VibeDemoElements } from '@/components/vibe-demo-elements';

const VibeContent = () => {
  const { vibeState, changeVibe } = useVibe();
  const { currentVibe } = vibeState;

  // Generate a new vibe on first load or page refresh
  useEffect(() => {
    changeVibe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`min-h-screen bg-background text-foreground`}>
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Vibe UI
              <span className="inline-block ml-2 text-primary">Shift</span>
            </h1>
            <p className="text-muted-foreground">
              A dynamic UI experience that changes on every reload
            </p>
          </div>
          <VibeControls />
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className={`grid gap-8 ${
          currentVibe.layout === 'sidebar' ? 'grid-cols-1 lg:grid-cols-[280px_1fr]' :
          currentVibe.layout === 'asymmetric' ? 'grid-cols-1 lg:grid-cols-[2fr_1fr]' :
          'grid-cols-1'
        }`}>
          <section className={`space-y-6 ${currentVibe.layout === 'centered' ? 'max-w-2xl mx-auto text-center' : ''}`}>
            <h2 className="text-3xl font-bold tracking-tight">
              Current Vibe: <span className="text-primary">{currentVibe.name}</span>
            </h2>
            
            <p className="text-lg text-muted-foreground">
              This UI dynamically changes its entire appearance, layout, and interactions
              based on the randomly selected vibe. Reload the page or click "New Vibe" to experience
              a completely different UI while maintaining functionality.
            </p>
            
            <div className="pt-4">
              <VibeInfo />
            </div>
          </section>
          
          <section className={`space-y-6 ${currentVibe.layout === 'centered' ? 'max-w-2xl mx-auto' : ''}`}>
            <VibeDemoElements />
          </section>
        </div>
      </main>

      <footer className="mt-auto py-6 px-4 sm:px-6 lg:px-8 border-t">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Vibe UI - A dynamic UI experience that changes on every page reload
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse-soft"></div>
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString()} · {currentVibe.name}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Wrap the main application with the VibeProvider
const Index = () => {
  return (
    <VibeProvider>
      <VibeContent />
    </VibeProvider>
  );
};

export default Index;
