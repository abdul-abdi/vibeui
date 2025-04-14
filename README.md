# VibeUI

<div align="center">
  
  <svg width="100" height="100" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="gradient-circle">
      <circle cx="16" cy="16" r="15" fill="url(#gradient)" strokeWidth="2"/>
      <path d="M10 16.5L14 20.5L22 12.5" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
      <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FF5757"/>
        <stop offset="25%" stop-color="#FFBD59"/>
        <stop offset="50%" stop-color="#4CD471"/>
        <stop offset="75%" stop-color="#5E8AF7"/>
        <stop offset="100%" stop-color="#C061F7"/>
      </linearGradient>
    </defs>
  </svg>
  
  **The Ultimate UI Design Inspiration Platform**
  
  [Features](#key-features) | [Getting Started](#getting-started) | [Documentation](#documentation)
  
</div>

## 🌟 Overview

VibeUI is a dynamic design system and UI inspiration platform that helps designers and developers discover new interface styles and aesthetics. It generates unique design "vibes" that can be customized, explored, and applied to your own projects.

With VibeUI, you can:
- Explore different design aesthetics from minimal to playful
- Generate design themes with a single click
- See live previews of UI components with your chosen vibe
- Experience smooth animations and transitions between themes

<div align="center">
  <img src="public/screenshot.png" alt="VibeUI Screenshot" width="800" />
</div>

## ✨ Key Features

- **Dynamic Vibe Generation** - Create and explore unlimited design styles
- **Real-time Preview** - See how components look with different vibes
- **Responsive Design** - Works on all devices from mobile to desktop
- **Performance Optimized** - Adaptive performance based on device capabilities
- **Dark/Light Mode** - Each vibe works with both dark and light color schemes
- **Animation Control** - Smooth transitions between different design states
- **Modern UI Components** - Showcase design across various interface elements

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/vibeui.git
cd vibeui
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and visit `http://localhost:3000`

## 📖 Documentation

### Project Structure

```
vibeui/
├── public/          # Static assets including SVG logo
├── src/             # Source code
│   ├── components/  # UI components
│   ├── lib/         # Utilities and helper functions including vibe engine
│   ├── pages/       # Application pages
│   ├── hooks/       # Custom React hooks
│   └── styles/      # Global styles
```

### Vibe Engine

The core of VibeUI is the vibe engine, which generates and applies design themes. The engine consists of:

- `vibe-engine.tsx` - Context provider for vibe state
- `vibe-controls.tsx` - UI controls for manipulating vibes
- `vibe-demo-elements.tsx` - Showcase components for each vibe

### Component Showcase

VibeUI includes a comprehensive showcase of components that demonstrate each design vibe:

- Basic elements (buttons, cards, typography)
- Navigation and headers
- Interactive animations
- Layout examples

## 🔧 Usage Guide

### Generating New Vibes

1. Click the "Generate New Vibe" button to create a random design theme
2. See real-time updates on all components
3. Experience smooth transitions between different vibes

### Exploring Features

1. Scroll through the interface to see different component examples
2. Toggle between light and dark mode to see adaptability
3. Resize your browser to test responsive behavior

## 🛠️ Technologies Used

- **React** - UI framework
- **TypeScript** - Type safety
- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **shadcn/ui** - Component foundations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for the component library foundations
- [Framer Motion](https://www.framer.com/motion/) for the animation library
- [Tailwind CSS](https://tailwindcss.com/) for the utility CSS framework
- [Next.js](https://nextjs.org/) for the React framework

---

<div align="center">
  Made with ❤️ by the VibeUI Team
</div>
