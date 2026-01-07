// Design System Types - Comprehensive tokens for UI generation

export interface ColorShade {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface ColorPalette {
  primary: ColorShade;
  secondary: ColorShade;
  accent: ColorShade;
  neutral: ColorShade;
  success: ColorShade;
  warning: ColorShade;
  error: ColorShade;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
}

export interface TypographyScale {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
    display: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
  };
}

export interface SpacingScale {
  px: string;
  0: string;
  0.5: string;
  1: string;
  1.5: string;
  2: string;
  2.5: string;
  3: string;
  3.5: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  14: string;
  16: string;
  20: string;
  24: string;
  28: string;
  32: string;
  36: string;
  40: string;
  44: string;
  48: string;
  52: string;
  56: string;
  60: string;
  64: string;
  72: string;
  80: string;
  96: string;
}

export interface BorderRadius {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface Shadows {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  glow: string;
  none: string;
}

export interface AnimationTokens {
  duration: {
    instant: string;
    fast: string;
    normal: string;
    slow: string;
    slower: string;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    spring: string;
    bounce: string;
  };
  keyframes: {
    fadeIn: string;
    fadeOut: string;
    slideUp: string;
    slideDown: string;
    scaleIn: string;
    float: string;
    pulse: string;
    shimmer: string;
  };
}

export interface GlassmorphismTokens {
  blur: {
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
  };
  background: {
    light: string;
    medium: string;
    dark: string;
  };
  border: {
    light: string;
    medium: string;
  };
}

export interface GradientTokens {
  primary: string;
  secondary: string;
  accent: string;
  aurora: string;
  mesh: string;
  radial: string;
}

export interface ComponentStyles {
  button: {
    primary: {
      background: string;
      color: string;
      hoverBackground: string;
      padding: string;
      borderRadius: string;
      shadow: string;
    };
    secondary: {
      background: string;
      color: string;
      border: string;
      hoverBackground: string;
      padding: string;
      borderRadius: string;
    };
    ghost: {
      background: string;
      color: string;
      hoverBackground: string;
      padding: string;
    };
  };
  card: {
    background: string;
    border: string;
    borderRadius: string;
    shadow: string;
    padding: string;
  };
  input: {
    background: string;
    border: string;
    focusBorder: string;
    borderRadius: string;
    padding: string;
    placeholder: string;
  };
  badge: {
    background: string;
    color: string;
    padding: string;
    borderRadius: string;
  };
}

export interface DesignSystem {
  name: string;
  description: string;
  mood: string;
  style: string;
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  borderRadius: BorderRadius;
  shadows: Shadows;
  animation: AnimationTokens;
  glassmorphism: GlassmorphismTokens;
  gradients: GradientTokens;
  components: ComponentStyles;
}

export interface GeneratedPage {
  html: string;
  css: string;
  description: string;
  sections: string[];
}

export interface VibeResult {
  designSystem: DesignSystem;
  preview: GeneratedPage;
  vibePrompt: string;
  timestamp: number;
}

export type DesignMood = 
  | 'professional'
  | 'playful'
  | 'elegant'
  | 'bold'
  | 'minimal'
  | 'futuristic'
  | 'organic'
  | 'retro';

export type DesignStyle = 
  | 'glassmorphism'
  | 'neubrutalism'
  | 'bento'
  | 'gradient-heavy'
  | 'dark-mode'
  | 'light-mode'
  | 'duotone'
  | 'monochrome';

export interface VibeInput {
  prompt: string;
  mood?: DesignMood;
  style?: DesignStyle;
}

// Inspiration suggestions for the UI
export const VIBE_SUGGESTIONS = [
  "A fintech dashboard with glassmorphism and aurora gradients",
  "Neubrutalist portfolio for a creative agency",
  "Dark mode SaaS landing page with bento grid layout",
  "Minimal e-commerce with elegant typography",
  "Futuristic AI product with mesh gradients",
  "Playful education platform with rounded corners",
  "Professional law firm website with serif typography",
  "Bold fitness app with high contrast colors",
  "Organic wellness brand with earth tones",
  "Retro gaming platform with pixel accents",
  "Luxury fashion brand with sophisticated animations",
  "Tech startup with gradient accents and clean lines",
] as const;

export const MOOD_DESCRIPTIONS: Record<DesignMood, string> = {
  professional: "Clean, trustworthy, corporate-friendly aesthetics",
  playful: "Fun, vibrant, energetic with rounded shapes",
  elegant: "Sophisticated, refined, luxury feel",
  bold: "High contrast, impactful, attention-grabbing",
  minimal: "Clean, spacious, content-focused",
  futuristic: "Cutting-edge, tech-forward, innovative",
  organic: "Natural, flowing, earth-inspired",
  retro: "Nostalgic, vintage-inspired, characterful",
};

export const STYLE_DESCRIPTIONS: Record<DesignStyle, string> = {
  glassmorphism: "Frosted glass effects with blur and transparency",
  neubrutalism: "Raw, bold borders, high contrast, intentionally unpolished",
  bento: "Grid-based layouts with varied card sizes",
  'gradient-heavy': "Rich gradients throughout the design",
  'dark-mode': "Dark backgrounds with light text",
  'light-mode': "Light backgrounds with dark text",
  duotone: "Two-color palette used creatively",
  monochrome: "Single color with shades and tints",
};
