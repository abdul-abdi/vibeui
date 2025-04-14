
import React from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function VibeInfo() {
  const { vibeState } = useVibe();
  const { currentVibe } = vibeState;

  return (
    <Card className={`animate-${currentVibe.animation.entrance} vibe-card`}>
      <CardHeader>
        <CardTitle className="text-2xl">{currentVibe.name}</CardTitle>
        <CardDescription>{currentVibe.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">
              Layout: {currentVibe.layout}
            </Badge>
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              Primary
            </Badge>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
              Secondary
            </Badge>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Accent
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h4 className="text-sm font-semibold mb-1">Typography</h4>
              <p className="text-sm text-muted-foreground">
                {currentVibe.fonts.primary.split(',')[0].replace(/'/g, '')}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-1">Animation</h4>
              <p className="text-sm text-muted-foreground">
                Speed: {currentVibe.animation.speed}x
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
