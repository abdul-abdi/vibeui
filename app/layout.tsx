import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibeUI — AI-Powered Design Inspiration",
  description: "Describe your vision and watch AI craft a complete design system—colors, typography, components, and a live preview—all in seconds. Powered by Gemini 3 Pro Preview.",
  keywords: ["UI design", "UX design", "design system", "AI", "Gemini", "color palette", "typography", "glassmorphism", "design inspiration"],
  authors: [{ name: "VibeUI" }],
  openGraph: {
    title: "VibeUI — AI-Powered Design Inspiration",
    description: "Generate complete design systems with AI. Colors, typography, components, and live previews.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeUI — AI-Powered Design Inspiration",
    description: "Generate complete design systems with AI. Colors, typography, components, and live previews.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
