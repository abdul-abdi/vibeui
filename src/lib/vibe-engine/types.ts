
export type VibeLayout = 'standard' | 'asymmetric' | 'centered' | 'sidebar';

export type ColorTheme = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
};

export type FontPairing = {
  primary: string;
  secondary: string;
  accent: string;
  mono: string;
};

export type RadiusScale = {
  sm: string;
  md: string;
  lg: string;
};

export type SpacingScale = {
  layoutSpacing: string;
  cardSpacing: string;
  elementSpacing: string;
};

export type AnimationSettings = {
  speed: number;
  easing: number[]; // Updated to number[] for Framer Motion compatibility
  entrance: string;
  hover: string;
};

export type VibeSettings = {
  id: string;
  name: string;
  description: string;
  layout: VibeLayout;
  colors: ColorTheme;
  fonts: FontPairing;
  radius: RadiusScale;
  spacing: SpacingScale;
  animation: AnimationSettings;
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
};

export type VibeState = {
  currentVibe: VibeSettings;
  isLocked: boolean;
  vibeHistory: string[];
};

