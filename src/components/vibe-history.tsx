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
  DialogDescription,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  History, 
  Star, 
  StarOff, 
  MoreHorizontal, 
  Trash, 
  Edit, 
  Clock, 
  Bookmark,
  ArrowRight,
  Search,
  ArrowLeft,
  Palette,
  Trash2,
  Download,
  Check,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface HistoryItem {
  id: string;
  vibeName: string;
  timestamp: number;
  isFavorite: boolean;
  customName?: string;
}

const MAX_HISTORY_ITEMS = 20;
const LOCAL_STORAGE_KEY = "vibeui-history";
const FAVORITES_KEY = "vibeui-favorites";

export function VibeHistory() {
  const { vibeState, changeVibe, generateAiVibe } = useVibe();
  const [isOpen, setIsOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<VibeSettings[]>([]);
  const [favoriteVibes, setFavoriteVibes] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [filterMode, setFilterMode] = useState<"all" | "favorites">("all");
  const [selectedVibe, setSelectedVibe] = useState<VibeSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load history from localStorage when component mounts
  useEffect(() => {
    const savedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory) as VibeSettings[];
        setHistoryItems(parsedHistory.slice(0, MAX_HISTORY_ITEMS));
      } catch (error) {
        console.error("Failed to parse history from localStorage:", error);
        // If parsing fails, start with empty history
        setHistoryItems([]);
      }
    }
    
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites) as string[];
        setFavoriteVibes(parsedFavorites);
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error);
        setFavoriteVibes([]);
      }
    }
  }, []);

  // Save current vibe to history when it changes
  useEffect(() => {
    if (!vibeState.currentVibe) return;

    setHistoryItems(prevHistoryItems => {
      // 1. Prepend the new/current vibe
      const newHistoryWithPotentialDuplicates = [vibeState.currentVibe, ...prevHistoryItems];

      // 2. Remove duplicates based on ID, keeping the first occurrence (which is the newest one we just added)
      const uniqueHistory = newHistoryWithPotentialDuplicates.filter(
        (item, index, self) => index === self.findIndex(t => t.id === item.id)
      );
      
      // 3. Limit to MAX_HISTORY_ITEMS
      const updatedHistory = uniqueHistory.slice(0, MAX_HISTORY_ITEMS);

      // 4. Save to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
      
      // 5. Return the updated state
      return updatedHistory; 
    });

  }, [vibeState.currentVibe]); // Only depend on the source vibe change

  const handleVibeSelect = (vibe: VibeSettings) => {
    setSelectedVibe(vibe);
  };

  const handleVibeLoad = () => {
    if (!selectedVibe) return;
    
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      changeVibe(selectedVibe.id);
      setIsOpen(false);
      setIsLoading(false);
      toast({
        title: "Vibe loaded",
        description: `${selectedVibe.name} has been loaded`,
      });
      setSelectedVibe(null);
    }, 500);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your vibe history?")) {
      setHistoryItems([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      toast({
        title: "History cleared",
        description: "Your vibe history has been cleared",
      });
    }
  };

  const handleDeleteVibe = (e: React.MouseEvent, vibe: VibeSettings) => {
    e.stopPropagation();
    
    const updatedHistory = historyItems.filter(item => item.id !== vibe.id);
    setHistoryItems(updatedHistory);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
    
    // If the deleted vibe was selected, clear selection
    if (selectedVibe && selectedVibe.id === vibe.id) {
      setSelectedVibe(null);
    }
    
    toast({
      title: "Vibe removed",
      description: `${vibe.name} has been removed from history`,
      variant: "destructive",
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  const toggleFavorite = (e: React.MouseEvent, vibe: VibeSettings) => {
    e.stopPropagation();
    
    const updatedFavorites = [...favoriteVibes];
    const index = updatedFavorites.indexOf(vibe.id);
    
    if (index !== -1) {
      // Remove from favorites
      updatedFavorites.splice(index, 1);
      toast({
        title: "Removed from favorites",
        description: `${vibe.name} has been removed from your favorites`
      });
    } else {
      // Add to favorites
      updatedFavorites.push(vibe.id);
      toast({
        title: "Added to favorites",
        description: `${vibe.name} has been added to your favorites`
      });
    }
    
    setFavoriteVibes(updatedFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  };

  const getSortedHistoryItems = () => {
    let items = [...historyItems];
    
    // Filter by favorites if in favorites mode
    if (filterMode === "favorites") {
      items = items.filter(item => favoriteVibes.includes(item.id));
    }
    
    // Sort by newest/oldest
    if (sortOrder === "oldest") {
      items.reverse();
    }
    
    return items;
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
              className="w-8 h-8 vibe-history-button relative"
              aria-label="Vibe History"
              title="View Vibe History"
            >
              <History className="h-4 w-4" />
              {historyItems.length > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center pointer-events-none"
                >
                  {historyItems.length}
                </motion.span>
              )}
            </Button>
          </motion.div>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <span>Vibe History</span>
            </DialogTitle>
            <DialogDescription>
              View and apply vibes you've used previously
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleSortOrder}
                className="text-xs h-8 px-2 flex items-center gap-1.5"
              >
                <Clock className="h-3.5 w-3.5" />
                {sortOrder === "newest" ? "Newest first" : "Oldest first"}
              </Button>
              
              <Button
                variant={filterMode === "all" ? "outline" : "secondary"}
                size="sm"
                onClick={() => setFilterMode(filterMode === "all" ? "favorites" : "all")}
                className="text-xs h-8 px-2 flex items-center gap-1.5"
              >
                {filterMode === "all" ? (
                  <>
                    <Palette className="h-3.5 w-3.5" />
                    <span>All vibes</span>
                  </>
                ) : (
                  <>
                    <Star className="h-3.5 w-3.5" />
                    <span>Favorites</span>
                  </>
                )}
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              className="text-xs h-8 px-2 flex items-center gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash className="h-3.5 w-3.5" />
              <span>Clear history</span>
            </Button>
          </div>

          {historyItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: ANIMATION_DURATION.medium }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <AlertCircle className="h-10 w-10 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No vibes in history</h3>
              <p className="text-muted-foreground max-w-md">
                Your vibe history will be saved here as you generate and customize new vibes.
              </p>
            </motion.div>
          ) : (
            <ScrollArea className="flex-1 min-h-0 overflow-hidden border rounded-md">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 p-1 overflow-y-auto max-h-[60vh]">
                <AnimatePresence>
                  {getSortedHistoryItems().map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ 
                        duration: ANIMATION_DURATION.medium,
                        delay: index * 0.05
                      }}
                    >
                      <div
                        className={cn(
                          "relative h-auto p-3 border rounded-lg cursor-pointer transition-all",
                          "hover:border-primary/50 hover:shadow-md",
                          selectedVibe?.id === item.id
                            ? "border-primary/80 bg-primary/5 shadow-md"
                            : "border-border bg-background"
                        )}
                        onClick={() => handleVibeSelect(item)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-sm flex items-center">
                            <Palette className="h-3.5 w-3.5 mr-1.5 text-primary" />
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            <button
                              className={cn(
                                "transition-colors p-1",
                                favoriteVibes.includes(item.id) 
                                  ? "text-amber-500 hover:text-amber-600" 
                                  : "text-muted-foreground hover:text-amber-500"
                              )}
                              onClick={(e) => toggleFavorite(e, item)}
                              title={favoriteVibes.includes(item.id) ? "Remove from favorites" : "Add to favorites"}
                            >
                              {favoriteVibes.includes(item.id) ? (
                                <Star className="h-3.5 w-3.5 fill-current" />
                              ) : (
                                <StarOff className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <button
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                              onClick={(e) => handleDeleteVibe(e, item)}
                              title="Remove from history"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-1 mb-2">
                          {Object.entries(item.colors)
                            .slice(0, 8)
                            .map(([key, value]) => (
                              <div
                                key={key}
                                className="aspect-square rounded-sm"
                                style={{ backgroundColor: `hsl(${value})` }}
                                title={key}
                              />
                            ))}
                        </div>
                        
                        <div className="text-[10px] text-muted-foreground flex items-center justify-between">
                          <span>{Object.keys(item.colors).length} colors</span>
                          {selectedVibe?.id === item.id && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-primary flex items-center"
                            >
                              <Check className="h-3 w-3 mr-0.5" /> Selected
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleVibeLoad}
              disabled={!selectedVibe || isLoading}
              className="gap-1.5"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Load vibe</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 