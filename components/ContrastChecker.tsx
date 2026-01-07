'use client';

import { useMemo } from 'react';

interface ContrastInfo {
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
}

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Check WCAG compliance
export function checkContrast(foreground: string, background: string): ContrastInfo {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio: Math.round(ratio * 100) / 100,
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5,
  };
}

interface ContrastCheckerProps {
  foreground: string;
  background: string;
  showDetails?: boolean;
}

export function ContrastChecker({ foreground, background, showDetails = false }: ContrastCheckerProps) {
  const contrast = useMemo(() => checkContrast(foreground, background), [foreground, background]);

  const getStatusColor = () => {
    if (contrast.aaa) return 'text-green-400';
    if (contrast.aa) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusLabel = () => {
    if (contrast.aaa) return 'AAA';
    if (contrast.aa) return 'AA';
    if (contrast.aaLarge) return 'AA Large';
    return 'Fail';
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
        style={{ backgroundColor: background, color: foreground }}
      >
        Aa
      </div>
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {contrast.ratio}:1
        </span>
        {showDetails && (
          <span className="text-xs text-white/40">{getStatusLabel()}</span>
        )}
      </div>
    </div>
  );
}

// Color utility functions for export
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  return luminance > 0.179;
}

export function getTextColorForBackground(background: string): string {
  return isLightColor(background) ? '#000000' : '#ffffff';
}
