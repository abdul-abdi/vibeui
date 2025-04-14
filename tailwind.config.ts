
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			borderRadius: {
				lg: 'var(--radius-lg)',
				md: 'var(--radius-md)',
				sm: 'var(--radius-sm)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				"accordion-up": {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				"pulse-soft": {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
				},
				"float": {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				"spin-slow": {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				"glow": {
					'0%, 100%': { boxShadow: '0 0 5px 0px rgba(var(--primary-rgb), 0.3)' },
					'50%': { boxShadow: '0 0 20px 5px rgba(var(--primary-rgb), 0.6)' },
				},
				"slide-in-right": {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' },
				},
				"slide-in-left": {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' },
				},
				"slide-in-up": {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' },
				},
				"slide-in-down": {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(0)' },
				},
				"fade-in": {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				"bounce-subtle": {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
				"wave": {
					'0%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(10deg)' },
					'50%': { transform: 'rotate(0deg)' },
					'75%': { transform: 'rotate(-10deg)' },
					'100%': { transform: 'rotate(0deg)' },
				},
				"morph": {
					'0%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
					'50%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' },
					'100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
				},
				"gradient-pulse": {
					'0%, 100%': { backgroundSize: '100% 100%' },
					'50%': { backgroundSize: '200% 200%' },
				},
				"shimmer": {
					'0%': { backgroundPosition: '-1000px 0' },
					'100%': { backgroundPosition: '1000px 0' }
				},
				"spotlight": {
					'0%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
					'100%': { opacity: '1', transform: 'scale(1) translateY(0)' }
				},
				"pan-image": {
					'0%': { backgroundPosition: '0% 0%' },
					'25%': { backgroundPosition: '100% 0%' },
					'50%': { backgroundPosition: '100% 100%' },
					'75%': { backgroundPosition: '0% 100%' },
					'100%': { backgroundPosition: '0% 0%' }
				},
				"color-cycle": {
					'0%, 100%': { filter: 'hue-rotate(0deg)' },
					'50%': { filter: 'hue-rotate(30deg)' }
				},
				"heartbeat": {
					'0%': { transform: 'scale(1)' },
					'14%': { transform: 'scale(1.15)' },
					'28%': { transform: 'scale(1)' },
					'42%': { transform: 'scale(1.15)' },
					'70%': { transform: 'scale(1)' }
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"pulse-soft": "pulse-soft 3s ease-in-out infinite",
				"float": "float 6s ease-in-out infinite",
				"spin-slow": "spin-slow 10s linear infinite",
				"glow": "glow 2.5s ease-in-out infinite",
				"slide-in-right": "slide-in-right 0.5s ease-out",
				"slide-in-left": "slide-in-left 0.5s ease-out",
				"slide-in-up": "slide-in-up 0.5s ease-out",
				"slide-in-down": "slide-in-down 0.5s ease-out",
				"fade-in": "fade-in 0.5s ease-out",
				"bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
				"wave": "wave 2.5s ease-in-out infinite",
				"morph": "morph 8s ease-in-out infinite",
				"gradient-pulse": "gradient-pulse 4s ease-in-out infinite",
				"shimmer": "shimmer 3s linear infinite",
				"spotlight": "spotlight 0.7s ease-out forwards",
				"pan-image": "pan-image 30s ease-in-out infinite",
				"color-cycle": "color-cycle 10s ease-in-out infinite",
				"heartbeat": "heartbeat 1.5s ease-in-out infinite"
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: '100%',
					},
				},
			},
			backdropBlur: {
				xs: '2px',
			},
			transitionProperty: {
				'height': 'height',
				'spacing': 'margin, padding',
				'width': 'width',
				'rounded': 'border-radius',
				'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
				'filter': 'filter',
				'all': 'all',
			},
			transitionDuration: {
				'400': '400ms',
				'2000': '2000ms',
				'3000': '3000ms',
			},
			transitionTimingFunction: {
				'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
			}
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
