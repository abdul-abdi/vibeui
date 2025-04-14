
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
import { Check } from 'lucide-react';

export function VibeGallery() {
  const { aiVibes, vibeState, changeVibe } = useVibe();
  const currentVibeId = vibeState.currentVibe.id;

  if (aiVibes.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Generated Vibes</h2>
        <Badge variant="outline" className="px-2">
          {aiVibes.length} vibes
        </Badge>
      </div>
      
      <Carousel className="w-full pb-8">
        <CarouselContent>
          {aiVibes.map((vibe) => (
            <CarouselItem key={vibe.id} className="sm:basis-1/2 lg:basis-1/3">
              <Card className={`h-full ${currentVibeId === vibe.id ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center gap-2">
                    {vibe.name}
                    {currentVibeId === vibe.id && (
                      <Badge variant="secondary">Current</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{vibe.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div 
                      className="w-6 h-6 rounded-full border" 
                      style={{ background: `hsl(${vibe.colors.primary})` }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border" 
                      style={{ background: `hsl(${vibe.colors.secondary})` }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border" 
                      style={{ background: `hsl(${vibe.colors.accent})` }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border" 
                      style={{ background: `hsl(${vibe.colors.background})` }}
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
