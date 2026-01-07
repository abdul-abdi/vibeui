'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { 
  Palette, 
  Type, 
  Eye,
  Code, 
  Copy, 
  Check, 
  Download,
  Sparkles,
} from 'lucide-react';
import type { DesignSystem, VibeResult } from '@/lib/types';
import { generateCSSVariables, generateTailwindConfig, generateFigmaTokens } from '@/lib/gemini';

interface DesignExplorerProps {
  result: VibeResult;
}

type Tab = 'preview' | 'colors' | 'typography' | 'export';

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

export function DesignExplorer({ result }: DesignExplorerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('preview');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const { designSystem, preview, vibePrompt } = result;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'preview', label: 'Preview', icon: <Eye className="w-4 h-4" /> },
    { id: 'colors', label: 'Colors', icon: <Palette className="w-4 h-4" /> },
    { id: 'typography', label: 'Type', icon: <Type className="w-4 h-4" /> },
    { id: 'export', label: 'Export', icon: <Code className="w-4 h-4" /> },
  ];

  const copyToClipboard = async (text: string, itemId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedItem(itemId);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springSmooth}
      className="w-full max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.div 
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springSmooth, delay: 0.1 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-4"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-warm)' }} />
          </motion.div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Generated Design System
          </span>
        </motion.div>
        <h2 className="text-2xl font-semibold text-foreground mb-3">{designSystem.name}</h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">{designSystem.description}</p>
      </motion.div>

      {/* Tabs with bounce */}
      <motion.div 
        className="flex justify-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springSmooth, delay: 0.2 }}
      >
        <div className="inline-flex gap-1.5 p-1.5 rounded-2xl bg-muted/50 border border-border backdrop-blur-sm">
          {tabs.map((tab, i) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              whileHover={{ scale: activeTab === tab.id ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={springBounce}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'var(--foreground)' }}
                  transition={springBounce}
                />
              )}
              <span className="relative z-10">{tab.icon}</span>
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={springSmooth}
      >
        {activeTab === 'preview' && <PreviewTab preview={preview} />}
        {activeTab === 'colors' && <ColorsTab colors={designSystem.colors} onCopy={copyToClipboard} copiedItem={copiedItem} />}
        {activeTab === 'typography' && <TypographyTab typography={designSystem.typography} />}
        {activeTab === 'export' && <ExportTab designSystem={designSystem} vibePrompt={vibePrompt} preview={preview} onCopy={copyToClipboard} copiedItem={copiedItem} />}
      </motion.div>
    </motion.div>
  );
}

// Preview Tab
function PreviewTab({ preview }: { preview: { html: string; css: string; description: string; sections: string[] } }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const iframeContent = useMemo(() => {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Inter',system-ui,sans-serif;}${preview.css}</style></head><body>${preview.html}</body></html>`;
  }, [preview.html, preview.css]);

  return (
    <>
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={springSmooth}
      >
        <div className="rounded-2xl overflow-hidden border-2 border-border bg-card shadow-lg">
          {/* Browser Chrome */}
          <div className="flex items-center gap-3 px-5 py-3.5 bg-muted/50 border-b border-border">
            <div className="flex gap-2">
              <motion.div 
                className="w-3 h-3 rounded-full" 
                style={{ background: 'var(--accent-warm)' }}
                whileHover={{ scale: 1.3 }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full bg-yellow-400"
                whileHover={{ scale: 1.3 }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full" 
                style={{ background: 'var(--accent-cool)' }}
                whileHover={{ scale: 1.3 }}
              />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-background rounded-lg px-4 py-1.5 text-xs text-muted-foreground text-center max-w-xs mx-auto border border-border">
                preview.vibeui.design
              </div>
            </div>
            {/* Fullscreen toggle */}
            <motion.button
              onClick={() => setIsFullscreen(true)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Fullscreen preview"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </motion.button>
          </div>
          
          {/* Preview Frame - Larger */}
          <div className="bg-white" style={{ height: '650px' }}>
            <iframe srcDoc={iframeContent} className="w-full h-full border-0" title="Design Preview" sandbox="allow-scripts" />
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={springSmooth}
              className="w-full h-full max-w-7xl max-h-[90vh] rounded-2xl overflow-hidden bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fullscreen Browser Chrome */}
              <div className="flex items-center gap-3 px-5 py-3 bg-zinc-100 border-b border-zinc-200">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-zinc-500 text-center max-w-md mx-auto border border-zinc-200">
                    preview.vibeui.design
                  </div>
                </div>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
                  title="Close fullscreen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <iframe srcDoc={iframeContent} className="w-full h-[calc(100%-48px)] border-0" title="Design Preview Fullscreen" sandbox="allow-scripts" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Colors Tab
function ColorsTab({ colors, onCopy, copiedItem }: { colors: DesignSystem['colors']; onCopy: (text: string, id: string) => void; copiedItem: string | null; }) {
  const colorGroups = ['primary', 'secondary', 'accent', 'neutral'] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {colorGroups.map((colorName, groupIndex) => (
        <motion.div 
          key={colorName} 
          className="p-6 rounded-2xl border-2 border-border bg-card hover:border-accent-warm/30 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSmooth, delay: groupIndex * 0.1 }}
          whileHover={{ y: -4, boxShadow: '0 10px 40px -10px var(--shadow-color)' }}
        >
          <h3 className="text-sm font-semibold text-foreground capitalize mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: groupIndex % 2 === 0 ? 'var(--accent-warm)' : 'var(--accent-cool)' }} />
            {colorName}
          </h3>
          <div className="flex gap-1.5">
            {Object.entries(colors[colorName]).map(([shade, value], i) => (
              <motion.button
                key={shade}
                onClick={() => onCopy(value, `${colorName}-${shade}`)}
                className="flex-1 aspect-square rounded-lg relative group overflow-hidden"
                style={{ backgroundColor: value }}
                title={`${shade}: ${value}`}
                whileHover={{ scale: 1.15, y: -4, zIndex: 10 }}
                whileTap={{ scale: 0.95 }}
                transition={springBounce}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {copiedItem === `${colorName}-${shade}` && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-[10px] text-muted-foreground font-medium">
            <span>50</span>
            <span>950</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Typography Tab
function TypographyTab({ typography }: { typography: DesignSystem['typography'] }) {
  const scales = [
    { name: '6xl', size: typography.fontSize['6xl'] },
    { name: '5xl', size: typography.fontSize['5xl'] },
    { name: '4xl', size: typography.fontSize['4xl'] },
    { name: '3xl', size: typography.fontSize['3xl'] },
    { name: '2xl', size: typography.fontSize['2xl'] },
    { name: 'xl', size: typography.fontSize.xl },
    { name: 'lg', size: typography.fontSize.lg },
    { name: 'base', size: typography.fontSize.base },
    { name: 'sm', size: typography.fontSize.sm },
    { name: 'xs', size: typography.fontSize.xs },
  ];

  return (
    <div className="space-y-6">
      {/* Font Families */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sans', value: typography.fontFamily.sans },
          { label: 'Serif', value: typography.fontFamily.serif },
          { label: 'Mono', value: typography.fontFamily.mono },
          { label: 'Display', value: typography.fontFamily.display },
        ].map((item, i) => (
          <motion.div 
            key={item.label} 
            className="p-5 rounded-2xl border-2 border-border bg-card hover:border-accent-warm/30 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSmooth, delay: i * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <p className="text-xs text-muted-foreground mb-2 font-medium">{item.label}</p>
            <p className="text-foreground font-semibold truncate" style={{ fontFamily: item.value }}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Type Scale */}
      <motion.div 
        className="p-6 rounded-2xl border-2 border-border bg-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springSmooth, delay: 0.2 }}
      >
        <h3 className="text-sm font-semibold text-foreground mb-6 flex items-center gap-2">
          <Type className="w-4 h-4" style={{ color: 'var(--accent-warm)' }} />
          Type Scale
        </h3>
        <div className="space-y-4">
          {scales.map((item, i) => (
            <motion.div 
              key={item.name} 
              className="flex items-baseline gap-4 py-2 border-b border-border/50 last:border-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springSmooth, delay: i * 0.03 }}
            >
              <span className="w-16 text-xs text-muted-foreground font-mono">{item.name}</span>
              <span className="text-foreground font-medium" style={{ fontSize: item.size }}>{item.size}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Export Tab
function ExportTab({ designSystem, vibePrompt, preview, onCopy, copiedItem }: { designSystem: DesignSystem; vibePrompt: string; preview: { html: string; css: string }; onCopy: (text: string, id: string) => void; copiedItem: string | null; }) {
  const cssVariables = useMemo(() => generateCSSVariables(designSystem), [designSystem]);
  const tailwindConfig = useMemo(() => generateTailwindConfig(designSystem), [designSystem]);
  const figmaTokens = useMemo(() => generateFigmaTokens(designSystem), [designSystem]);

  const exports = [
    { id: 'css', title: 'CSS Variables', content: cssVariables, filename: 'variables.css' },
    { id: 'tailwind', title: 'Tailwind Config', content: tailwindConfig, filename: 'tailwind.config.js' },
    { id: 'tokens', title: 'Design Tokens', content: figmaTokens, filename: 'tokens.json' },
    { id: 'html', title: 'Full HTML', content: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n${preview.css}\n</style>\n</head>\n<body>\n${preview.html}\n</body>\n</html>`, filename: 'preview.html' },
    { id: 'prompt', title: 'Vibe Prompt', content: vibePrompt, filename: 'prompt.md' },
  ];

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {exports.map((item, i) => (
        <motion.div 
          key={item.id} 
          className="p-5 rounded-2xl border-2 border-border bg-card hover:border-accent-warm/30 transition-colors group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSmooth, delay: i * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
            <div className="flex gap-1.5">
              <motion.button
                onClick={() => onCopy(item.content, item.id)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={springBounce}
              >
                {copiedItem === item.id ? <Check className="w-4 h-4" style={{ color: 'var(--accent-cool)' }} /> : <Copy className="w-4 h-4" />}
              </motion.button>
              <motion.button
                onClick={() => downloadFile(item.content, item.filename)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={springBounce}
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          <pre className="text-xs text-muted-foreground overflow-hidden max-h-32 font-mono bg-muted/50 rounded-lg p-3">
            {item.content.slice(0, 300)}...
          </pre>
        </motion.div>
      ))}
    </div>
  );
}
