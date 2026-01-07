# ✨ VibeUI

> AI-powered design system generator that transforms your vision into complete, production-ready design systems.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)

## 🎯 What is VibeUI?

VibeUI lets you describe your design vision in plain English and instantly generates a complete design system including:

- **🎨 Color Palettes** — Primary, secondary, accent, and neutral color scales with full shade ranges (50-950)
- **📝 Typography** — Font families, type scale, line heights, and letter spacing
- **🧩 Components** — Live preview of your design system in action
- **📦 Export Options** — CSS variables, Tailwind config, and design tokens (Figma-compatible)

Powered by **Gemini 3 Pro Preview** for intelligent design generation.

## 🚀 Features

- **Natural Language Input** — Just describe what you want: *"A SaaS dashboard for analytics with a dark professional feel"*
- **Instant Preview** — See your design system come to life in a real browser preview
- **Dark/Light Mode** — Beautiful theme switching with smooth transitions
- **One-Click Export** — Download CSS variables, Tailwind config, or design tokens
- **Inspiration Gallery** — Pre-built prompts to spark your creativity
- **Responsive Design** — Works beautifully on all screen sizes

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org) | React framework with App Router |
| [React 19](https://react.dev) | UI library |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion) | Animations & transitions |
| [Google Gemini AI](https://ai.google.dev) | Design system generation |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark/light mode |
| [Zustand](https://zustand-demo.pmnd.rs) | State management |
| [Lucide Icons](https://lucide.dev) | Beautiful icons |

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vibeui.git
cd vibeui

# Install dependencies
bun install
# or
npm install
# or
pnpm install

# Start the development server
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 API Key Setup

VibeUI requires a Google Gemini API key to generate design systems.

1. Get your API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. When you first use the app, you'll be prompted to enter your API key
3. Your key is stored locally in your browser — never sent to our servers

## 📁 Project Structure

```
vibeui/
├── app/
│   ├── globals.css      # Design system & CSS variables
│   ├── layout.tsx       # Root layout with theme provider
│   └── page.tsx         # Main application page
├── components/
│   ├── ApiKeyModal.tsx      # API key input modal
│   ├── DesignExplorer.tsx   # Generated design system viewer
│   ├── FloatingOrbs.tsx     # Animated background orbs
│   ├── GenerationProgress.tsx # Loading progress indicator
│   ├── Header.tsx           # Site header with navigation
│   ├── InspirationGallery.tsx # Pre-built prompt cards
│   ├── PromptInput.tsx      # Main input for design prompts
│   ├── ThemeProvider.tsx    # next-themes provider
│   └── ThemeToggle.tsx      # Dark/light mode toggle
├── lib/
│   ├── gemini.ts        # Gemini AI integration & prompts
│   ├── presets.ts       # Inspiration presets
│   ├── store.ts         # Zustand state management
│   ├── theme-utils.ts   # Theme utility functions
│   └── types.ts         # TypeScript type definitions
└── public/              # Static assets
```

## 🎨 Design System

VibeUI uses a dual-accent color system:

- **Warm Accent** (Violet) — Primary interactive elements
- **Cool Accent** (Cyan) — Secondary highlights

The design features:
- Playful spring animations with pronounced bounces
- Floating orbs that adapt to the current theme
- Glass-morphism effects with subtle transparency
- Smooth theme transitions

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun lint` | Run ESLint |

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/vibeui)

### Other Platforms

```bash
# Build the application
bun run build

# Start the production server
bun start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with 💜 and AI
</p>
