# VibeUI

<div align="center">
  <img src="public/favicon.svg" alt="VibeUI Logo" width="150" />
</div>
  
  **The Ultimate UI Design Inspiration Platform**
  
  [Features](#key-features) | [Getting Started](#getting-started) | [Documentation](#documentation)
  
</div>

## 🌟 Overview

VibeUI is a dynamic design system and UI inspiration platform built with Next.js (using the Pages Router for the main UI and the App Router for API endpoints) and TypeScript. It helps designers and developers discover new interface styles and aesthetics by generating unique design "vibes".

With VibeUI, you can:
- Explore different design aesthetics from minimal to playful
- Generate design themes with a single click, using keywords, or via detailed AI prompts powered by Google's Gemini model.
- See live previews of UI components with your chosen vibe
- Experience smooth animations and transitions between themes
- Leverage Supabase Edge Functions for AI generation and potentially other backend features.

<div align="center">
  <img src="public/screenshot.png" alt="VibeUI Screenshot" width="800" />
</div>

## ✨ Key Features

- **Dynamic Vibe Generation** - Create and explore unlimited design styles. Includes:
    - Predefined presets
    - Random generation
    - AI-powered generation using Google Gemini via Supabase Edge Functions (accepts basic theme/mood keywords or advanced detailed prompts)
- **Real-time Preview** - See how components look with different vibes instantly
- **Responsive Design** - Works on all devices from mobile to desktop
- **Performance Optimized** - Adaptive performance based on device capabilities
- **Animation Control** - Smooth transitions between different design states using `Framer Motion`
- **Modern UI Components** - Showcase design across various interface elements built with `shadcn/ui` and `Radix UI`

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended, based on Next.js 15)
- npm, yarn, or bun
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/vibeui.git
cd vibeui
```

2. Install dependencies (choose your preferred package manager):

```bash
npm install
# or
yarn install
# or
bun install
```

3. Set up environment variables:
    - Copy `.env.example` to `.env.local`.
    - Fill in your Supabase project details:
      ```
      NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
      NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
      ```
    - **Crucially:** Set your Google AI API Key as a secret in your Supabase project dashboard:
        - Go to Project Settings > Edge Functions > Add New Secret.
        - Secret Name: `GOOGLE_AI_API_KEY`
        - Secret Value: `Your-Google-AI-API-Key`

4. Deploy the Supabase Edge Function:
    - Ensure you have the [Supabase CLI installed and configured](https://supabase.com/docs/guides/cli).
    - Run the deployment command from the project root:
      ```bash
      supabase functions deploy generate-vibe
      ```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
bun run dev
```

4. Open your browser and visit `http://localhost:3000`

### Available Scripts

- `dev`: Starts the development server.
- `build`: Creates a production build.
- `start`: Starts the production server.
- `lint`: Lints the codebase using ESLint.
- `analyze`: Analyzes the bundle size after build.
- `lighthouse`: Runs Lighthouse audit on `http://localhost:3000`.

## 📖 Documentation

### Project Structure

```
vibeui/
├── public/                # Static assets (favicon, images)
├── src/                   # Source code
│   ├── app/               # Next.js App Router (primarily API routes)
│   │   └── api/           # API routes (e.g., /api/generate-vibe)
│   ├── components/        # Reusable UI components (built with shadcn/ui)
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # Third-party integrations (e.g., Supabase client setup)
│   ├── lib/               # Core logic, utilities, and Vibe Engine
│   │   ├── vibe-engine/   # Vibe generation logic, context, presets, AI interaction
│   │   ├── performance.ts # Performance utilities
│   │   └── utils.ts       # General utility functions
│   ├── pages/             # Next.js Pages Router (main application UI)
│   │   ├── index.tsx      # Main application page
│   │   ├── _app.tsx       # Custom App component
│   │   ├── _document.tsx  # Custom Document component
│   │   └── ...            # Other pages (e.g., 404)
│   ├── styles/            # Global styles (likely unused if using Tailwind exclusively)
│   └── index.css          # Global CSS (Tailwind base/imports)
├── supabase/              # Supabase specific files
│   └── functions/         # Supabase Edge Functions (e.g., generate-vibe)
├── .env.local             # Local environment variables (Gitignored)
├── .env.example           # Example environment variables
├── .eslintrc.json         # ESLint configuration
├── .gitignore             # Files and directories ignored by Git
├── components.json        # shadcn/ui configuration
├── next.config.js         # Next.js configuration
├── package.json           # Project dependencies and scripts
├── postcss.config.js      # PostCSS configuration (for Tailwind)
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vercel.json            # Vercel deployment configuration
├── README.md              # This file
└── DEPLOYMENT.md          # Detailed deployment instructions (likely for Vercel)
```

### Vibe Engine (`src/lib/vibe-engine/`)

The core of VibeUI is the vibe engine, which generates and applies design themes. Key files include:

- `vibe-context.tsx`: React Context provider for managing the current vibe state.
- `vibe-utils.ts`: Utility functions for generating, manipulating, and applying vibe styles.
- `vibe-presets.ts`: Predefined vibe configurations.
- `ai-vibes.ts`: Logic related to AI-powered vibe generation, interacting with the `/api/generate-vibe` route.
- `types.ts`: TypeScript types related to the vibe engine.

*Note: The API route (`src/app/api/generate-vibe/route.ts`) handles requests and invokes the Supabase Edge Function (`supabase/functions/generate-vibe/index.ts`) which contains the core Gemini API interaction logic.*

### Component Showcase

VibeUI includes a comprehensive showcase of components (primarily in `src/pages/index.tsx` and potentially `src/components/`) that demonstrate each design vibe, built using `shadcn/ui`.

## 🔧 Usage Guide

### Generating New Vibes

1. Interact with the UI controls (e.g., "Generate New Vibe" button) to create random AI-generated design themes.
2. Observe real-time updates across all showcased components.
3. Experience smooth transitions powered by `Framer Motion`.

### Exploring Features

1. Scroll through the main page (`/`) to see different component examples under the current vibe.
3. Resize your browser to test responsive behavior.

## 🛠️ Technologies Used

- **Framework:** [Next.js](https://nextjs.org/) (v15+, using Pages Router primarily)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (built on [Radix UI](https://www.radix-ui.com/))
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **State Management:** React Context, potentially [@tanstack/react-query](https://tanstack.com/query/latest) for server state
- **Forms:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) (for validation)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Theming:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Backend/DB (Optional):** [Supabase](https://supabase.com/) (Edge Functions for AI, Auth/DB optional)
- **AI Model:** [Google Gemini](https://ai.google.dev/) (specifically gemini-1.5-flash-latest via API)
- **Utilities:** clsx, tailwind-merge, date-fns, recharts, sonner, vaul, cmdk, etc.
- **Linting/Formatting:** ESLint

## ☁️ Deployment

This project is configured for deployment on [Vercel](https://vercel.com/).

**Important:** Before or after deploying to Vercel, ensure your Supabase Edge Function (`generate-vibe`) is deployed using the Supabase CLI:

```bash
supabase functions deploy generate-vibe
```

Also ensure your Vercel project has the necessary environment variables set (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) and that the `GOOGLE_AI_API_KEY` secret is configured in your Supabase project settings.

See `vercel.json` and potentially `DEPLOYMENT.md` for more Vercel-specific details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details (assuming one exists, otherwise specify).

## 🙏 Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) team and contributors
- [Radix UI](https://www.radix-ui.com/) team for the unstyled primitives
- [Framer Motion](https://www.framer.com/motion/) team for the animation library
- [Tailwind CSS](https://tailwindcss.com/) team
- [Next.js](https://nextjs.org/) team / Vercel

---

<div align="center">
  Made with ❤️ by the VibeUI Team
</div>
