'use client';
import React, { useState, useEffect } from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CodeIcon, Copy, Download, Check, ExternalLink, Clipboard, Terminal, FileJson, Code2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

// Animation timing constants for consistency
const ANIMATION_DURATION = {
  fast: 0.2,
  medium: 0.3,
  slow: 0.5
};

// Standard easing functions
const EASING = {
  standard: [0.4, 0, 0.2, 1],
  decelerate: [0, 0, 0.2, 1],
  accelerate: [0.4, 0, 1, 1]
};

export function VibeCodeExport() {
  const { vibeState } = useVibe();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('json');
  const [copied, setCopied] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'json' | 'css' | 'tailwind'>('json');
  const isDarkTheme = theme === 'dark';
  const [syntaxStyle, setSyntaxStyle] = useState({});

  // Load syntax highlighter styles
  useEffect(() => {
    const loadStyle = async () => {
      if (isDarkTheme) {
        const { materialDark } = await import('react-syntax-highlighter/dist/cjs/styles/prism');
        setSyntaxStyle(materialDark);
      } else {
        const { materialLight } = await import('react-syntax-highlighter/dist/cjs/styles/prism');
        setSyntaxStyle(materialLight);
      }
    };
    
    loadStyle();
  }, [isDarkTheme]);

  // Format vibe settings to JSON with proper indentation
  const formatJSON = () => {
    const { id, ...settingsWithoutId } = { ...vibeState.currentVibe };
    return JSON.stringify(settingsWithoutId, null, 2);
  };

  // Format vibe settings to CSS variables
  const formatCSS = () => {
    const { colors, shadows, radius, fonts } = vibeState.currentVibe;
    let css = `:root {\n`;

    // Add colors as CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      css += `  --color-${key.toLowerCase()}: hsl(${value});\n`;
    });

    // Add shadows as CSS variables
    Object.entries(shadows).forEach(([key, value]) => {
      css += `  --shadow-${key.toLowerCase()}: ${value};\n`;
    });

    // Add border radii as CSS variables
    Object.entries(radius).forEach(([key, value]) => {
      css += `  --radius-${key.toLowerCase()}: ${value};\n`;
    });

    // Add fonts as CSS variables
    Object.entries(fonts).forEach(([key, value]) => {
      css += `  --font-${key.toLowerCase()}: ${value};\n`;
    });

    css += `}`;
    return css;
  };

  // Format vibe settings to Tailwind config
  const formatTailwind = () => {
    const { colors, shadows, radius, fonts } = vibeState.currentVibe;
    
    // Convert HSL color to hex for Tailwind compatibility
    const hslToHex = (hsl: string) => {
      const [h, s, l] = hsl.split(' ').map(v => parseFloat(v.replace(/[^0-9.]/g, '')));
      
      // Convert HSL to RGB
      const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l / 100 - c / 2;
      
      let r, g, b;
      if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
      else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
      else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
      else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
      else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
      else { r = c; g = 0; b = x; }
      
      // Convert RGB to Hex
      const toHex = (val: number) => {
        const hex = Math.round((val + m) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };
    
    // Build the Tailwind config
    let config = `/** @type {import('tailwindcss').Config} */\n`;
    config += `module.exports = {\n`;
    config += `  theme: {\n`;
    config += `    extend: {\n`;
    
    // Add colors
    config += `      colors: {\n`;
    Object.entries(colors).forEach(([key, value]) => {
      config += `        '${key}': '${hslToHex(value)}',\n`;
    });
    config += `      },\n`;
    
    // Add border radius
    config += `      borderRadius: {\n`;
    Object.entries(radius).forEach(([key, value]) => {
      config += `        '${key}': '${value}',\n`;
    });
    config += `      },\n`;
    
    // Add box shadow
    config += `      boxShadow: {\n`;
    Object.entries(shadows).forEach(([key, value]) => {
      config += `        '${key}': '${value}',\n`;
    });
    config += `      },\n`;
    
    // Add font family
    config += `      fontFamily: {\n`;
    Object.entries(fonts).forEach(([key, value]) => {
      config += `        '${key}': ['${value}', 'sans-serif'],\n`;
    });
    config += `      },\n`;
    
    config += `    },\n`;
    config += `  },\n`;
    config += `  plugins: [],\n`;
    config += `};\n`;
    
    return config;
  };
  
  // Get the code based on the active tab
  const getCode = () => {
    switch (activeTab) {
      case 'json':
        return formatJSON();
      case 'css':
        return formatCSS();
      case 'tailwind':
        return formatTailwind();
      default:
        return formatJSON();
    }
  };
  
  const getLanguage = () => {
    switch (activeTab) {
      case 'json':
        return 'json';
      case 'css':
        return 'css';
      case 'tailwind':
        return 'javascript';
      default:
        return 'json';
    }
  };

  // Handle downloading the code as a file
  const handleDownload = () => {
    const code = getCode();
    let filename = `vibe-${vibeState.currentVibe.name.toLowerCase().replace(/\s+/g, '-')}`;
    let extension = '';
    
    switch (downloadFormat) {
      case 'json':
        extension = '.json';
        break;
      case 'css':
        extension = '.css';
        break;
      case 'tailwind':
        extension = '.config.js';
        break;
    }
    
    try {
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename + extension;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "File downloaded",
        description: `${filename}${extension} has been downloaded successfully.`
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your file. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle copying code to clipboard
  const handleCopy = async () => {
    const code = getCode();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: `The ${activeTab.toUpperCase()} code has been copied to your clipboard.`
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast({
        title: "Copy failed",
        description: "There was an error copying to clipboard. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: ANIMATION_DURATION.fast }}
          >
            <Button 
              variant="outline" 
              size="icon" 
              className="w-8 h-8 vibe-code-export-button"
              aria-label="Export Code"
              title="Export Code"
            >
              <CodeIcon className="h-4 w-4" />
            </Button>
          </motion.div>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <span>Export {vibeState.currentVibe.name} Vibe</span>
            </DialogTitle>
            <DialogDescription>
              Export your vibe for use in your design system or codebase
            </DialogDescription>
          </DialogHeader>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mt-4"
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="json" className="relative flex items-center gap-1.5">
                  <FileJson className="h-4 w-4" />
                  <span>JSON</span>
                  {activeTab === 'json' && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                      layoutId="tab-indicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: ANIMATION_DURATION.fast }}
                    />
                  )}
                </TabsTrigger>
                <TabsTrigger value="css" className="relative flex items-center gap-1.5">
                  <Code2 className="h-4 w-4" />
                  <span>CSS</span>
                  {activeTab === 'css' && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                      layoutId="tab-indicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: ANIMATION_DURATION.fast }}
                    />
                  )}
                </TabsTrigger>
                <TabsTrigger value="tailwind" className="relative flex items-center gap-1.5">
                  <Terminal className="h-4 w-4" />
                  <span>Tailwind</span>
                  {activeTab === 'tailwind' && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                      layoutId="tab-indicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: ANIMATION_DURATION.fast }}
                    />
                  )}
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopy} 
                  className="gap-1.5 relative overflow-hidden"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Copied</span>
                      <motion.span 
                        className="absolute bottom-0 left-0 h-0.5 bg-green-500" 
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: 2, ease: 'linear' }}
                        onAnimationComplete={() => setCopied(false)}
                      />
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownload}
                  className="gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  <span>Download {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
                </Button>
              </div>
            </div>
            
            <div className="mt-4">
              <TabsContent value="json" className="mt-0">
                <div className="border rounded-md overflow-hidden">
                  <SyntaxHighlighter
                    language="json"
                    style={syntaxStyle}
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      background: 'transparent',
                      fontSize: '0.9rem',
                      borderRadius: '0.5rem',
                      maxHeight: '40vh',
                      overflow: 'auto'
                    }}
                  >
                    {formatJSON()}
                  </SyntaxHighlighter>
                </div>
                <div className="mt-4 bg-muted/30 rounded-md p-3">
                  <h4 className="text-sm font-medium mb-1 flex items-center gap-1.5">
                    <Clipboard className="h-4 w-4 text-primary" />
                    <span>Implementation tips for designers</span>
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Use this JSON to document your design tokens or import them into Figma with plugins like "Tokens Studio for Figma"
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="css" className="mt-0">
                <div className="border rounded-md overflow-hidden">
                  <SyntaxHighlighter
                    language="css"
                    style={syntaxStyle}
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      background: 'transparent',
                      fontSize: '0.9rem',
                      borderRadius: '0.5rem',
                      maxHeight: '40vh',
                      overflow: 'auto'
                    }}
                  >
                    {formatCSS()}
                  </SyntaxHighlighter>
                </div>
                <div className="mt-4 bg-muted/30 rounded-md p-3">
                  <h4 className="text-sm font-medium mb-1 flex items-center gap-1.5">
                    <Clipboard className="h-4 w-4 text-primary" />
                    <span>Implementation tips for developers</span>
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Add these CSS variables to your project's root stylesheet or use a CSS-in-JS solution to apply them globally. You can then use <code className="text-xs bg-muted px-1 py-0.5 rounded">var(--color-primary)</code> in your styles.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="tailwind" className="mt-0">
                <div className="border rounded-md overflow-hidden">
                  <SyntaxHighlighter
                    language="javascript"
                    style={syntaxStyle}
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      background: 'transparent',
                      fontSize: '0.9rem',
                      borderRadius: '0.5rem',
                      maxHeight: '40vh',
                      overflow: 'auto'
                    }}
                  >
                    {formatTailwind()}
                  </SyntaxHighlighter>
                </div>
                <div className="mt-4 bg-muted/30 rounded-md p-3 space-y-2">
                  <h4 className="text-sm font-medium mb-1 flex items-center gap-1.5">
                    <Clipboard className="h-4 w-4 text-primary" />
                    <span>Implementation tips for Tailwind users</span>
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Save this as <code className="text-xs bg-muted px-1 py-0.5 rounded">tailwind.config.js</code> or merge the theme values into your existing Tailwind configuration.
                  </p>
                  <p className="text-xs flex items-center gap-1.5">
                    <ExternalLink className="h-3 w-3 text-primary" />
                    <a href="https://tailwindcss.com/docs/theme" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Learn more about Tailwind theming
                    </a>
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
          
          <DialogFooter className="mt-6 flex items-center">
            <p className="text-xs text-muted-foreground mr-auto">
              {vibeState.currentVibe.name} has {Object.keys(vibeState.currentVibe.colors).length} color tokens, {Object.keys(vibeState.currentVibe.radius).length} radius tokens
            </p>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}