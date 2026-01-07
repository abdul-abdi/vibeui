import type { DesignSystem, GeneratedPage, VibeResult, DesignMood, DesignStyle } from './types';

const DESIGN_PRINCIPLES = `
You are a world-class UI/UX designer with deep knowledge of:

VISUAL HIERARCHY:
- Not all elements are equal - size, color, and weight create importance
- Use whitespace strategically to group and separate elements
- Lead the eye with intentional contrast and positioning

COLOR THEORY (HSL-based):
- Build palettes with consistent saturation curves
- Dark mode: desaturate slightly, avoid pure black (#000)
- Ensure WCAG AA contrast ratios (4.5:1 for text)
- Use color meaningfully - don't rely on color alone for information

TYPOGRAPHY:
- Establish clear hierarchy with 3-4 font sizes max
- Line height: 1.5-1.7 for body, 1.1-1.2 for headings
- Letter spacing: tighter for large text, normal/wider for small text
- Font pairing: contrast with intention (sans + serif, geometric + humanist)

SPACING SYSTEM:
- Use a mathematical scale (4px base: 4, 8, 12, 16, 24, 32, 48, 64)
- Consistent padding creates visual rhythm
- More space = more importance/breathing room

DEPTH & SHADOWS:
- Shadows emulate a consistent light source (top-left typically)
- Layered shadows look more natural (small sharp + large soft)
- Glassmorphism: blur + transparency + subtle border

MICRO-INTERACTIONS:
- Hover states should feel responsive (100-200ms)
- Use easing curves for natural motion (ease-out for entrances)
- Subtle animations delight without distracting

MODERN TRENDS TO INCORPORATE:
- Bento grids: asymmetric grid layouts with varied card sizes
- Glassmorphism: frosted glass with backdrop-blur
- Aurora/mesh gradients: multi-color organic gradients
- Neubrutalism: bold borders, raw aesthetic, high contrast
- Variable fonts for refined typography control
`;

const SYSTEM_PROMPT = `${DESIGN_PRINCIPLES}

You are generating a complete design system and preview for a website/app. Your output must be valid JSON that exactly matches the schema provided.

CRITICAL RULES:
1. Colors MUST use valid hex codes (e.g., "#8b5cf6")
2. All numeric values for lineHeight/fontWeight must be numbers, not strings
3. CSS values must be valid (e.g., "0.75rem", "12px", "-0.02em")
4. The preview HTML must be self-contained with inline styles
5. Be creative but practical - these designs should be implementable
6. Consider accessibility in all color choices
7. Make the design cohesive - all elements should feel part of the same system

When given a prompt, interpret it thoughtfully:
- Extract the industry/context
- Identify the target audience
- Determine the appropriate mood and style
- Create a design that would genuinely impress designers
`;

interface GenerateVibeParams {
  prompt: string;
  mood?: DesignMood;
  style?: DesignStyle;
  apiKey: string;
}

export async function generateVibe({ prompt, mood, style, apiKey }: GenerateVibeParams): Promise<VibeResult> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-3-pro-preview',
    generationConfig: {
      temperature: 0.85,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 16384,
    }
  });

  const moodContext = mood ? `The mood should be ${mood} - conveying a sense of ${getMoodDescription(mood)}.` : '';
  const styleContext = style ? `Use ${style} as the primary design style - ${getStyleDescription(style)}.` : '';

  const userPrompt = `
Create a complete design system and preview page for: "${prompt}"

${moodContext}
${styleContext}

Generate a JSON response with this EXACT structure (no markdown, just pure JSON):

{
  "designSystem": {
    "name": "string - creative name for this design system",
    "description": "string - 1-2 sentence description of the design direction",
    "mood": "string - the overall feeling",
    "style": "string - the visual style approach",
    "colors": {
      "primary": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex", "950": "#hex" },
      "secondary": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex", "950": "#hex" },
      "accent": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex", "950": "#hex" },
      "neutral": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex", "950": "#hex" },
      "success": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex", "950": "#hex" },
      "warning": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex", "950": "#hex" },
      "error": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex", "950": "#hex" },
      "background": {
        "primary": "#hex - main background",
        "secondary": "#hex - secondary/card background",
        "tertiary": "#hex - subtle accent background",
        "elevated": "#hex - elevated surfaces"
      },
      "text": {
        "primary": "#hex - main text",
        "secondary": "#hex - secondary text",
        "muted": "#hex - muted/disabled text",
        "inverse": "#hex - text on dark/light backgrounds"
      }
    },
    "typography": {
      "fontFamily": {
        "sans": "string - e.g., 'Inter, system-ui, sans-serif'",
        "serif": "string - e.g., 'Playfair Display, Georgia, serif'",
        "mono": "string - e.g., 'JetBrains Mono, monospace'",
        "display": "string - for headlines"
      },
      "fontSize": {
        "xs": "0.75rem",
        "sm": "0.875rem",
        "base": "1rem",
        "lg": "1.125rem",
        "xl": "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem"
      },
      "fontWeight": {
        "light": 300,
        "normal": 400,
        "medium": 500,
        "semibold": 600,
        "bold": 700,
        "extrabold": 800
      },
      "lineHeight": {
        "tight": 1.1,
        "snug": 1.25,
        "normal": 1.5,
        "relaxed": 1.625,
        "loose": 1.75
      },
      "letterSpacing": {
        "tighter": "-0.05em",
        "tight": "-0.025em",
        "normal": "0em",
        "wide": "0.025em",
        "wider": "0.05em"
      }
    },
    "spacing": {
      "px": "1px", "0": "0", "0.5": "0.125rem", "1": "0.25rem", "1.5": "0.375rem",
      "2": "0.5rem", "2.5": "0.625rem", "3": "0.75rem", "3.5": "0.875rem", "4": "1rem",
      "5": "1.25rem", "6": "1.5rem", "7": "1.75rem", "8": "2rem", "9": "2.25rem",
      "10": "2.5rem", "11": "2.75rem", "12": "3rem", "14": "3.5rem", "16": "4rem",
      "20": "5rem", "24": "6rem", "28": "7rem", "32": "8rem", "36": "9rem",
      "40": "10rem", "44": "11rem", "48": "12rem", "52": "13rem", "56": "14rem",
      "60": "15rem", "64": "16rem", "72": "18rem", "80": "20rem", "96": "24rem"
    },
    "borderRadius": {
      "none": "0",
      "sm": "0.125rem",
      "base": "0.25rem",
      "md": "0.375rem",
      "lg": "0.5rem",
      "xl": "0.75rem",
      "2xl": "1rem",
      "3xl": "1.5rem",
      "full": "9999px"
    },
    "shadows": {
      "sm": "valid CSS box-shadow",
      "base": "valid CSS box-shadow",
      "md": "valid CSS box-shadow",
      "lg": "valid CSS box-shadow",
      "xl": "valid CSS box-shadow",
      "2xl": "valid CSS box-shadow",
      "inner": "valid CSS box-shadow",
      "glow": "valid CSS box-shadow for glow effect using primary color",
      "none": "none"
    },
    "animation": {
      "duration": {
        "instant": "0ms",
        "fast": "150ms",
        "normal": "300ms",
        "slow": "500ms",
        "slower": "700ms"
      },
      "easing": {
        "linear": "linear",
        "easeIn": "cubic-bezier(0.4, 0, 1, 1)",
        "easeOut": "cubic-bezier(0, 0, 0.2, 1)",
        "easeInOut": "cubic-bezier(0.4, 0, 0.2, 1)",
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
      },
      "keyframes": {
        "fadeIn": "@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }",
        "fadeOut": "@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }",
        "slideUp": "@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }",
        "slideDown": "@keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }",
        "scaleIn": "@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }",
        "float": "@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }",
        "pulse": "@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }",
        "shimmer": "@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }"
      }
    },
    "glassmorphism": {
      "blur": {
        "sm": "4px",
        "base": "8px",
        "md": "12px",
        "lg": "16px",
        "xl": "24px"
      },
      "background": {
        "light": "rgba(255, 255, 255, 0.1)",
        "medium": "rgba(255, 255, 255, 0.15)",
        "dark": "rgba(0, 0, 0, 0.2)"
      },
      "border": {
        "light": "rgba(255, 255, 255, 0.1)",
        "medium": "rgba(255, 255, 255, 0.2)"
      }
    },
    "gradients": {
      "primary": "linear-gradient using primary colors",
      "secondary": "linear-gradient using secondary colors",
      "accent": "linear-gradient using accent colors",
      "aurora": "multi-stop gradient for aurora effect",
      "mesh": "radial-gradient for mesh effect",
      "radial": "radial-gradient from center"
    },
    "components": {
      "button": {
        "primary": {
          "background": "gradient or solid color",
          "color": "#hex",
          "hoverBackground": "gradient or solid color",
          "padding": "CSS padding",
          "borderRadius": "CSS border-radius",
          "shadow": "CSS box-shadow"
        },
        "secondary": {
          "background": "color or transparent",
          "color": "#hex",
          "border": "CSS border",
          "hoverBackground": "color",
          "padding": "CSS padding",
          "borderRadius": "CSS border-radius"
        },
        "ghost": {
          "background": "transparent",
          "color": "#hex",
          "hoverBackground": "color with alpha",
          "padding": "CSS padding"
        }
      },
      "card": {
        "background": "color or glass effect",
        "border": "CSS border",
        "borderRadius": "CSS border-radius",
        "shadow": "CSS box-shadow",
        "padding": "CSS padding"
      },
      "input": {
        "background": "#hex",
        "border": "CSS border",
        "focusBorder": "CSS border",
        "borderRadius": "CSS border-radius",
        "padding": "CSS padding",
        "placeholder": "#hex color for placeholder"
      },
      "badge": {
        "background": "#hex or gradient",
        "color": "#hex",
        "padding": "CSS padding",
        "borderRadius": "CSS border-radius"
      }
    }
  },
  "preview": {
    "html": "Complete HTML for a beautiful preview page showcasing the design system. Include: hero section with headline, feature cards in bento/grid layout, a form section, and footer. Use inline styles with the design tokens. Make it 100% self-contained. Include realistic placeholder content. The HTML should be minified (no newlines).",
    "css": "Additional CSS including keyframe animations, hover states, responsive adjustments. Keep it concise but complete.",
    "description": "Brief description of what the preview showcases",
    "sections": ["list", "of", "section", "names"]
  },
  "vibePrompt": "A detailed prompt that could be used with AI coding tools to recreate this design. Include specific colors, fonts, spacing philosophy, component styles, and the overall aesthetic approach. This should be comprehensive enough that another AI could recreate the design."
}

Remember: Output ONLY valid JSON. No markdown code blocks. No explanations. Just the JSON object.
`;

  try {
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: userPrompt }
    ]);

    const response = result.response;
    const text = response.text();
    
    // Clean the response - remove any markdown formatting if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.slice(7);
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    const parsed = JSON.parse(cleanedText);
    
    return {
      designSystem: parsed.designSystem as DesignSystem,
      preview: parsed.preview as GeneratedPage,
      vibePrompt: parsed.vibePrompt,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Generation error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate design');
  }
}

function getMoodDescription(mood: DesignMood): string {
  const descriptions: Record<DesignMood, string> = {
    professional: 'trustworthiness, competence, and corporate sophistication',
    playful: 'energy, fun, and approachable friendliness',
    elegant: 'luxury, refinement, and timeless sophistication',
    bold: 'confidence, impact, and commanding presence',
    minimal: 'clarity, focus, and intentional simplicity',
    futuristic: 'innovation, cutting-edge technology, and forward-thinking',
    organic: 'natural warmth, sustainability, and human connection',
    retro: 'nostalgia, character, and vintage charm',
  };
  return descriptions[mood];
}

function getStyleDescription(style: DesignStyle): string {
  const descriptions: Record<DesignStyle, string> = {
    glassmorphism: 'frosted glass effects with backdrop blur, transparency, and subtle borders',
    neubrutalism: 'bold black borders, raw aesthetic, high contrast, intentionally unpolished feel',
    bento: 'asymmetric grid layouts with varied card sizes like Apple/Figma',
    'gradient-heavy': 'rich gradients throughout, aurora effects, mesh gradients',
    'dark-mode': 'dark backgrounds (#0a0a0a to #1a1a1a), light text, subtle colored accents',
    'light-mode': 'clean white/light backgrounds, dark text, subtle shadows',
    duotone: 'two primary colors used creatively throughout the design',
    monochrome: 'single color with full range of shades and tints',
  };
  return descriptions[style];
}

// Export utilities
export function generateCSSVariables(designSystem: DesignSystem): string {
  const { colors, typography, spacing, borderRadius, shadows, animation, gradients } = designSystem;
  
  let css = ':root {\n';
  
  // Colors
  Object.entries(colors).forEach(([colorName, shades]) => {
    if (typeof shades === 'object' && shades !== null) {
      if ('50' in shades) {
        Object.entries(shades).forEach(([shade, value]) => {
          css += `  --color-${colorName}-${shade}: ${value};\n`;
        });
      } else {
        Object.entries(shades).forEach(([key, value]) => {
          css += `  --color-${colorName}-${key}: ${value};\n`;
        });
      }
    }
  });
  
  // Typography
  Object.entries(typography.fontFamily).forEach(([key, value]) => {
    css += `  --font-${key}: ${value};\n`;
  });
  Object.entries(typography.fontSize).forEach(([key, value]) => {
    css += `  --text-${key}: ${value};\n`;
  });
  
  // Spacing
  Object.entries(spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value};\n`;
  });
  
  // Border radius
  Object.entries(borderRadius).forEach(([key, value]) => {
    css += `  --radius-${key}: ${value};\n`;
  });
  
  // Shadows
  Object.entries(shadows).forEach(([key, value]) => {
    css += `  --shadow-${key}: ${value};\n`;
  });
  
  // Animation
  Object.entries(animation.duration).forEach(([key, value]) => {
    css += `  --duration-${key}: ${value};\n`;
  });
  Object.entries(animation.easing).forEach(([key, value]) => {
    css += `  --easing-${key}: ${value};\n`;
  });
  
  // Gradients
  Object.entries(gradients).forEach(([key, value]) => {
    css += `  --gradient-${key}: ${value};\n`;
  });
  
  css += '}\n\n';
  
  // Add keyframes
  Object.values(animation.keyframes).forEach(keyframe => {
    css += keyframe + '\n\n';
  });
  
  return css;
}

export function generateTailwindConfig(designSystem: DesignSystem): string {
  const { colors, typography, borderRadius, shadows } = designSystem;
  
  const config = {
    theme: {
      extend: {
        colors: {
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
          neutral: colors.neutral,
        },
        fontFamily: typography.fontFamily,
        fontSize: typography.fontSize,
        borderRadius: borderRadius,
        boxShadow: shadows,
      },
    },
  };
  
  return `// tailwind.config.js
module.exports = ${JSON.stringify(config, null, 2)}`;
}

export function generateFigmaTokens(designSystem: DesignSystem): string {
  const tokens = {
    color: designSystem.colors,
    typography: designSystem.typography,
    spacing: designSystem.spacing,
    borderRadius: designSystem.borderRadius,
    shadow: designSystem.shadows,
  };
  
  return JSON.stringify(tokens, null, 2);
}
