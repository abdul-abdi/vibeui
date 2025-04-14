
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVibe } from '@/lib/vibe-engine';
import { ChevronRight, Star, Heart, MessageSquare } from 'lucide-react';

export function VibeDemoElements() {
  const { vibeState } = useVibe();
  const { currentVibe } = vibeState;
  
  // Check if this is the "Soft Organic" vibe
  const isSoftOrganic = currentVibe.name.toLowerCase().includes("organic");
  const buttonClasses = isSoftOrganic ? {
    primary: 'soft-organic-primary-button',
    secondary: 'soft-organic-secondary-button',
    outline: 'soft-organic-outline-button',
    ghost: 'soft-organic-ghost-button',
    link: 'soft-organic-link-button'
  } : {};
  
  const cardClass = isSoftOrganic ? 'soft-organic-card' : '';

  return (
    <div className="space-y-8">
      {/* Interactive Elements */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Interactive Elements</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="default" className={buttonClasses.primary}>Primary Button</Button>
          <Button variant="secondary" className={buttonClasses.secondary}>Secondary Button</Button>
          <Button variant="outline" className={buttonClasses.outline}>Outline Button</Button>
          <Button variant="ghost" className={buttonClasses.ghost}>Ghost Button</Button>
          <Button variant="link" className={buttonClasses.link}>Link Button</Button>
        </div>
        <div className="flex flex-wrap gap-3 items-center mt-4">
          <Input placeholder="Standard input" className="max-w-[250px]" />
          <div className="flex flex-wrap gap-2 items-center">
            <Badge>Badge</Badge>
            <Badge variant="secondary">Secondary Badge</Badge>
            <Badge variant="outline">Outline Badge</Badge>
            <Badge variant="destructive">Destructive Badge</Badge>
          </div>
        </div>
      </div>

      {/* Card Components with Dynamic Animation */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Card Components</h3>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Card className={`shadow-sm hover:shadow-md transition-shadow ${cardClass}`}>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description with details</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card demonstrates the current vibe styling.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" size="sm">Cancel</Button>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card className={`shadow-sm hover:shadow-md transition-shadow ${cardClass}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Interactive Card</CardTitle>
                <div className="p-2 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                  <Star className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>This card showcases content with the current vibe.</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span className="text-sm text-muted-foreground">24</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">12</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="ml-auto group">
                Read More 
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Typography Examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Typography</h3>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold">Heading 1</h1>
          <h2 className="text-3xl font-semibold">Heading 2</h2>
          <h3 className="text-2xl font-medium">Heading 3</h3>
          <p className="text-lg">This is a paragraph with standard text styling.</p>
          <p className="text-sm text-muted-foreground">This is smaller text with muted color.</p>
          <p><code className="text-sm px-1 py-0.5 rounded bg-muted">Code example</code></p>
        </div>
      </div>
    </div>
  );
}
