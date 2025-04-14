import React, { useState, useEffect } from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { VibeSettings } from '@/lib/vibe-engine/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getVibePresetById, vibePresets } from '@/lib/vibe-engine/vibe-presets';
import { Split, RefreshCw, CheckSquare, ArrowLeftRight, Eye, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

// Sample UI elements to showcase the vibes
const SampleElements = ({ vibe }: { vibe: VibeSettings }) => {
  const buttonColor = vibe.colors.primary;
  const textColor = vibe.colors.foreground;
  const bgColor = vibe.colors.background;
  const borderColor = vibe.colors.border;
  const radius = vibe.radius.md;
  const fontPrimary = vibe.fonts.primary;
  const fontSecondary = vibe.fonts.secondary;

  return (
    <motion.div
      className="p-4 rounded-lg shadow-md h-full overflow-auto"
      style={{
        background: `hsl(${bgColor})`,
        color: `hsl(${textColor})`,
        fontFamily: fontPrimary,
        borderRadius: radius,
        border: `1px solid hsl(${borderColor})`,
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION.medium, ease: EASING.standard }}
    >
      <h3
        className="text-xl font-bold mb-2"
        style={{ fontFamily: fontSecondary }}
      >
        {vibe.name}
      </h3>
      <p className="text-sm mb-3">Sample UI elements with this vibe</p>

      <div className="space-y-3">
        <div
          className="p-3 rounded"
          style={{
            background: `hsl(${vibe.colors.card})`,
            color: `hsl(${vibe.colors.cardForeground})`,
            borderRadius: vibe.radius.md
          }}
        >
          <h4 className="font-medium">Card Component</h4>
          <p className="text-xs">A sample card with {vibe.name}'s styling</p>
        </div>

        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 rounded text-sm font-medium"
            style={{
              background: `hsl(${vibe.colors.primary})`,
              color: `hsl(${vibe.colors.primaryForeground})`,
              borderRadius: vibe.radius.sm,
              boxShadow: vibe.shadows.sm
            }}
          >
            Primary
          </button>

          <button
            className="px-3 py-1.5 rounded text-sm font-medium"
            style={{
              background: `hsl(${vibe.colors.secondary})`,
              color: `hsl(${vibe.colors.secondaryForeground})`,
              borderRadius: vibe.radius.sm,
              boxShadow: vibe.shadows.sm
            }}
          >
            Secondary
          </button>
        </div>

        <div className="flex gap-2">
          <div
            className="h-6 w-6 rounded-full"
            style={{ background: `hsl(${vibe.colors.primary})` }}
          />
          <div
            className="h-6 w-6 rounded-full"
            style={{ background: `hsl(${vibe.colors.secondary})` }}
          />
          <div
            className="h-6 w-6 rounded-full"
            style={{ background: `hsl(${vibe.colors.accent})` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export function VibeComparison() {
  const { vibeState, changeVibe } = useVibe();
  const [isOpen, setIsOpen] = useState(false);
  const [leftVibeId, setLeftVibeId] = useState('');
  const [rightVibeId, setRightVibeId] = useState('');
  const [leftVibe, setLeftVibe] = useState<VibeSettings | null>(null);
  const [rightVibe, setRightVibe] = useState<VibeSettings | null>(null);
  const [recentlyUsedVibes, setRecentlyUsedVibes] = useState<VibeSettings[]>([]);
  const [loadingVibe, setLoadingVibe] = useState<'left' | 'right' | null>(null);

  // Initialize with default vibes when opened
  const handleOpenDialog = () => {
    // Set current vibe as left vibe
    setLeftVibeId(vibeState.currentVibe.id);
    setLeftVibe(vibeState.currentVibe);

    // Find a different vibe for the right side
    const differentVibe = vibePresets.find(v => v.id !== vibeState.currentVibe.id);
    if (differentVibe) {
      setRightVibeId(differentVibe.id);
      setRightVibe(differentVibe);
    }

    setIsOpen(true);
  };

  // Fetch vibes from localStorage on component mount
  useEffect(() => {
    try {
      // Get current vibe first
      const currentVibe = vibeState.currentVibe;
      let vibes: VibeSettings[] = [currentVibe];

      // Try to get vibes from localStorage
      const savedHistory = localStorage.getItem('vibeui-history');
      if (savedHistory) {
        try {
          const historyItems = JSON.parse(savedHistory);

          // Get unique IDs that aren't the current vibe's ID
          const uniqueVibeIds = Array.from(
            new Set(historyItems.filter((item: VibeSettings) => item.id !== currentVibe.id).map((item: VibeSettings) => item.id))
          ).slice(0, 5);

          // Try to get them from localStorage first
          uniqueVibeIds.forEach(id => {
            // Check if the vibe is already in our array
            if (!vibes.find(v => v.id === id)) {
              // Try to find this vibe
              let vibe = getVibePresetById(id as string);
              if (vibe) vibes.push(vibe);
            }
          });
        } catch (e) {
          console.error("Error parsing history:", e);
        }
      }

      // Always load some preset vibes if we don't have enough
      if (vibes.length < 3) {
        // Get some preset vibes that aren't already in our array
        const presetOptions = vibePresets
          .filter(preset => !vibes.find(v => v.id === preset.id))
          .slice(0, 3 - vibes.length);

        vibes = [...vibes, ...presetOptions];
      }

      setRecentlyUsedVibes(vibes);

      // Auto-select the first vibe for comparison when dialog opens
      if (isOpen && vibes.length > 1) {
        // First item is likely the current vibe
        setLeftVibeId(vibes[0].id);
        setRightVibeId(vibes[1].id);
      }
    } catch (error) {
      console.error("Error loading vibes:", error);
      // Fallback to default presets
      setRecentlyUsedVibes(vibePresets.slice(0, 3));
    }
  }, [isOpen, vibeState.currentVibe]);

  // Update vibes when IDs change
  useEffect(() => {
    if (leftVibeId) {
      setLoadingVibe('left');
      try {
        // First try to get from vibeState if it's the current vibe
        if (vibeState.currentVibe && vibeState.currentVibe.id === leftVibeId) {
          setLeftVibe(vibeState.currentVibe);
          setLoadingVibe(null);
          return;
        }

        // Then try in preset vibes
        const presetVibe = getVibePresetById(leftVibeId);
        if (presetVibe) {
          setLeftVibe(presetVibe);
          setLoadingVibe(null);
          return;
        }

        // Finally try recent vibes
        const recentVibe = recentlyUsedVibes.find(v => v.id === leftVibeId);
        if (recentVibe) {
          setLeftVibe(recentVibe);
          setLoadingVibe(null);
          return;
        }

        // If all fails, clear selection
        setLeftVibe(null);
        setLoadingVibe(null);
        console.error(`Vibe with ID ${leftVibeId} not found`);
      } catch (error) {
        console.error("Error setting left vibe:", error);
        setLeftVibe(null);
        setLoadingVibe(null);
      }
    } else {
      setLeftVibe(null);
    }
  }, [leftVibeId, vibeState.currentVibe, recentlyUsedVibes]);

  useEffect(() => {
    if (rightVibeId) {
      setLoadingVibe('right');
      try {
        // First try to get from vibeState if it's the current vibe
        if (vibeState.currentVibe && vibeState.currentVibe.id === rightVibeId) {
          setRightVibe(vibeState.currentVibe);
          setLoadingVibe(null);
          return;
        }

        // Then try in preset vibes
        const presetVibe = getVibePresetById(rightVibeId);
        if (presetVibe) {
          setRightVibe(presetVibe);
          setLoadingVibe(null);
          return;
        }

        // Finally try recent vibes
        const recentVibe = recentlyUsedVibes.find(v => v.id === rightVibeId);
        if (recentVibe) {
          setRightVibe(recentVibe);
          setLoadingVibe(null);
          return;
        }

        // If all fails, clear selection
        setRightVibe(null);
        setLoadingVibe(null);
        console.error(`Vibe with ID ${rightVibeId} not found`);
      } catch (error) {
        console.error("Error setting right vibe:", error);
        setRightVibe(null);
        setLoadingVibe(null);
      }
    } else {
      setRightVibe(null);
    }
  }, [rightVibeId, vibeState.currentVibe, recentlyUsedVibes]);

  const handleApplyVibe = (vibeId: string) => {
    changeVibe(vibeId);
    setIsOpen(false);
    toast({
      title: "Vibe applied",
      description: "The selected vibe has been applied to the UI"
    });
  };

  const swapVibes = () => {
    const tempLeftId = leftVibeId;
    const tempRightId = rightVibeId;
    setLeftVibeId(tempRightId);
    setRightVibeId(tempLeftId);

    // Show success toast
    toast({
      title: "Vibes swapped",
      description: "Left and right vibes have been swapped"
    });
  };

  const resetSelection = (side: 'left' | 'right') => {
    if (side === 'left') {
      setLeftVibeId('');
      setLeftVibe(null);
    } else {
      setRightVibeId('');
      setRightVibe(null);
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
            onClick={handleOpenDialog}
          >
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 vibe-comparison-button"
              aria-label="Compare Vibes"
              title="Compare Vibes"
              type="button"
            >
              <Split className="h-4 w-4" />
            </Button>
          </motion.div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              <span>Vibe Comparison</span>
            </DialogTitle>
            <DialogDescription>
              Compare different vibes side by side to see how their styles differ
            </DialogDescription>
          </DialogHeader>

          {/* Debug info - will show what's happening with state */}
          <div className="text-xs text-muted-foreground mb-4 p-2 bg-muted/10 rounded border">
            <p>Status: {leftVibe ? `Left: ${leftVibe.name}` : 'Left: None'} | {rightVibe ? `Right: ${rightVibe.name}` : 'Right: None'}</p>
            <p>Recent Vibes: {recentlyUsedVibes.length > 0 ? recentlyUsedVibes.map(v => v.name).join(', ') : 'None loaded'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Left vibe selector */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="leftVibe" className="flex items-center gap-1.5">
                    <span>Left Vibe</span>
                    {leftVibe && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full"
                        onClick={() => resetSelection('left')}
                        aria-label="Clear left vibe selection"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </Label>
                </div>
                <Select value={leftVibeId} onValueChange={setLeftVibeId}>
                  <SelectTrigger id="leftVibe" className="w-full">
                    <SelectValue placeholder="Select a vibe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={vibeState.currentVibe.id}>Current: {vibeState.currentVibe.name}</SelectItem>

                    {recentlyUsedVibes.length > 0 && (
                      <>
                        <SelectItem value="header-recent" disabled>
                          Recently Used
                        </SelectItem>
                        {recentlyUsedVibes.map(vibe => (
                          <SelectItem key={`left-recent-${vibe.id}`} value={vibe.id}>
                            {vibe.name}
                          </SelectItem>
                        ))}
                      </>
                    )}

                    <SelectItem value="header-presets" disabled>
                      Presets
                    </SelectItem>
                    {vibePresets.map(vibe => (
                      <SelectItem key={`left-preset-${vibe.id}`} value={vibe.id}>
                        {vibe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="h-[250px] overflow-y-auto border rounded-md">
                {loadingVibe === 'left' ? (
                  <div className="h-full flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                  </div>
                ) : leftVibe ? (
                  <SampleElements vibe={leftVibe} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-2 bg-muted/20 p-4 text-center">
                    <Eye className="h-6 w-6 text-muted-foreground/70" />
                    <p className="text-muted-foreground">Select a vibe to preview</p>
                    <p className="text-xs text-muted-foreground/70">Choose from recent or preset vibes</p>
                  </div>
                )}
              </div>

              {leftVibe && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: ANIMATION_DURATION.medium }}
                >
                  <Button
                    onClick={() => handleApplyVibe(leftVibe.id)}
                    className="w-full"
                    variant="outline"
                  >
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Apply {leftVibe.name}
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Right vibe selector */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="rightVibe" className="flex items-center gap-1.5">
                    <span>Right Vibe</span>
                    {rightVibe && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full"
                        onClick={() => resetSelection('right')}
                        aria-label="Clear right vibe selection"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={swapVibes}
                          disabled={!leftVibeId || !rightVibeId}
                        >
                          <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: ANIMATION_DURATION.medium }}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </motion.div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Swap vibes</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select value={rightVibeId} onValueChange={setRightVibeId}>
                  <SelectTrigger id="rightVibe" className="w-full">
                    <SelectValue placeholder="Select a vibe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={vibeState.currentVibe.id}>Current: {vibeState.currentVibe.name}</SelectItem>

                    {recentlyUsedVibes.length > 0 && (
                      <>
                        <SelectItem value="header-recent" disabled>
                          Recently Used
                        </SelectItem>
                        {recentlyUsedVibes.map(vibe => (
                          <SelectItem key={`right-recent-${vibe.id}`} value={vibe.id}>
                            {vibe.name}
                          </SelectItem>
                        ))}
                      </>
                    )}

                    <SelectItem value="header-presets" disabled>
                      Presets
                    </SelectItem>
                    {vibePresets.map(vibe => (
                      <SelectItem key={`right-preset-${vibe.id}`} value={vibe.id}>
                        {vibe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="h-[250px] overflow-y-auto border rounded-md">
                {loadingVibe === 'right' ? (
                  <div className="h-full flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                  </div>
                ) : rightVibe ? (
                  <SampleElements vibe={rightVibe} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-2 bg-muted/20 p-4 text-center">
                    <Eye className="h-6 w-6 text-muted-foreground/70" />
                    <p className="text-muted-foreground">Select a vibe to preview</p>
                    <p className="text-xs text-muted-foreground/70">Choose from recent or preset vibes</p>
                  </div>
                )}
              </div>

              {rightVibe && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: ANIMATION_DURATION.medium }}
                >
                  <Button
                    onClick={() => handleApplyVibe(rightVibe.id)}
                    className="w-full"
                    variant="outline"
                  >
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Apply {rightVibe.name}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {leftVibe && rightVibe && (
              <motion.div
                className="mt-6 bg-muted/20 p-4 rounded-md border"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: ANIMATION_DURATION.medium }}
              >
                <h3 className="font-medium mb-2 flex items-center gap-1.5">
                  <ArrowLeftRight className="h-4 w-4 text-primary" />
                  <span>Key Differences</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="block font-medium">Color Scheme:</span>
                    <span className={cn("text-xs", leftVibe.colors.primary !== rightVibe.colors.primary ? "text-amber-600 dark:text-amber-400" : "")}>
                      {leftVibe.colors.primary === rightVibe.colors.primary ? "Same primary colors" : "Different primary colors"}
                    </span>
                  </div>
                  <div>
                    <span className="block font-medium">Typography:</span>
                    <span className={cn("text-xs", leftVibe.fonts.primary !== rightVibe.fonts.primary ? "text-amber-600 dark:text-amber-400" : "")}>
                      {leftVibe.fonts.primary === rightVibe.fonts.primary ? "Same fonts" : "Different font families"}
                    </span>
                  </div>
                  <div>
                    <span className="block font-medium">Roundness:</span>
                    <span className={cn("text-xs", leftVibe.radius.md !== rightVibe.radius.md ? "text-amber-600 dark:text-amber-400" : "")}>
                      {leftVibe.radius.md === rightVibe.radius.md ? "Same corner radius" : "Different corner radius"}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}