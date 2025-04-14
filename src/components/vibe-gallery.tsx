
import React from 'react';
import { useVibe } from '@/lib/vibe-engine';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Palette } from 'lucide-react';

export function VibeGallery() {
  const { aiVibes, vibeState, changeVibe } = useVibe();
  const currentVibeId = vibeState.currentVibe.id;

  // Don't show the gallery if there are no AI vibes
  if (aiVibes.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">AI Generated Vibes</h2>
          <Palette className="h-5 w-5 text-primary" />
        </div>
        <Badge variant="outline" className="px-2">
          {aiVibes.length} {aiVibes.length === 1 ? 'vibe' : 'vibes'}
        </Badge>
      </div>
      
      <Carousel className="w-full pb-10">
        <CarouselContent>
          {aiVibes.map((vibe) => (
            <CarouselItem key={vibe.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <Card className={`h-full transition-all hover:shadow-lg ${currentVibeId === vibe.id ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center gap-2 text-lg">
                    <span className="truncate">{vibe.name}</span>
                    {currentVibeId === vibe.id && (
                      <Badge variant="secondary" className="flex-shrink-0">Current</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{vibe.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div 
                      className="w-6 h-6 rounded-full border" 
                      style={{ background: vibe.colors.primary }}
                      title="Primary"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border" 
                      style={{ background: vibe.colors.secondary }}
                      title="Secondary"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border" 
                      style={{ background: vibe.colors.accent }}
                      title="Accent"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border" 
                      style={{ background: vibe.colors.background }}
                      title="Background"
                    />
                  </div>
                  <Badge variant="outline" className="capitalize">
                    Layout: {vibe.layout}
                  </Badge>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={currentVibeId === vibe.id ? "secondary" : "default"} 
                    className="w-full" 
                    onClick={() => changeVibe(vibe.id)}
                  >
                    {currentVibeId === vibe.id ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Applied
                      </>
                    ) : (
                      'Apply Vibe'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1" />
        <CarouselNext className="right-1" />
      </Carousel>
    </section>
  );
}
