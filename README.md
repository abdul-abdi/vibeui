# VibeUI

<div align="center">
  
  ![VibeUI Logo](https://via.placeholder.com/150x150?text=VibeUI)
  
  **The Ultimate UI Design Inspiration Platform**
  
  [Demo](https://vibeui.vercel.app) | [Documentation](#documentation) | [Features](#key-features) | [Deploy](#deployment)
  
</div>

## 🌟 Overview

VibeUI is a dynamic design system and UI inspiration platform that helps designers and developers discover new interface styles and aesthetics. It generates unique design "vibes" that can be customized, exported, and applied to your own projects.

With VibeUI, you can:
- Explore different design aesthetics from minimal to playful
- Generate AI-powered design themes with a single click
- See live previews of UI components with your chosen vibe
- Export design tokens and styles for use in your own projects

<div align="center">
  
  ![VibeUI Screenshot](https://via.placeholder.com/800x450?text=VibeUI+Screenshot)
  
</div>

## ✨ Key Features

- **Dynamic Vibe Generation** - Create and explore unlimited design styles
- **Real-time Preview** - See how components look with different vibes
- **AI-powered Themes** - Generate custom themes based on keywords
- **Code Export** - Get ready-to-use CSS variables and design tokens
- **Theme History** - Save and revisit your favorite design vibes
- **Responsive Design** - Works on all devices from mobile to desktop
- **Dark/Light Mode** - Each vibe works with both dark and light color schemes

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

3. Set up environment variables:

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Update the values in `.env.local` with your own Supabase credentials.

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open your browser and visit `http://localhost:8080`

## 📖 Documentation

### Project Structure

```
vibeui/
├── public/          # Static assets
│   ├── components/  # UI components
│   ├── lib/         # Utilities and helper functions
│   ├── pages/       # Application pages
│   ├── hooks/       # Custom React hooks
│   ├── integrations/# Third-party integrations (Supabase)
│   └── main.tsx     # Application entry point
├── dist/            # Build output
└── supabase/        # Supabase configuration
```

### Vibe Engine

The core of VibeUI is the vibe engine, which generates and applies design themes. The engine consists of:

- `vibe-context.tsx` - Context provider for vibe state
- `vibe-presets.ts` - Collection of predefined vibes
- `vibe-utils.ts` - Utilities for applying vibes to the UI
- `ai-vibes.ts` - Integration with AI for dynamic vibe generation

### Component Gallery

VibeUI includes a comprehensive gallery of components that showcase each design vibe. These components include:

- Basic elements (buttons, inputs, cards)
- Layout components (navigation, sidebars)
- Interactive elements (modals, tooltips)
- Data visualization samples

## 🔧 Usage Guide

### Generating New Vibes

1. Click the "New Vibe" button to generate a random design theme
2. Use the lock button to prevent accidental changes
3. Navigate through your vibe history with the arrow buttons

### Customizing Vibes

1. Use the AI vibe generator to create a theme based on keywords
2. Adjust colors, typography, and spacing as needed
3. See real-time updates on the component showcase

### Exporting Vibes

1. Click the "Export" button in the vibe controls
2. Choose your desired format (CSS variables, Tailwind config, etc.)
3. Copy the code or download the configuration file

## 🛠️ Technologies Used

- **React** - UI framework
- **TypeScript** - Type safety
- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **shadcn/ui** - Component library
- **Supabase** - Backend and edge functions
- **React Query** - Data fetching
- **React Router** - Navigation

## 🚢 Deployment

VibeUI is optimized for deployment on Vercel. For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

Quick deployment steps:

1. Fork or clone this repository
2. Import your repository to Vercel
3. Set environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fvibeui)

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

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Framer Motion](https://www.framer.com/motion/) for the animation library
- [Lovable](https://lovable.dev/) for project support

---

<div align="center">
  Made with ❤️ by the VibeUI Team
</div>
