import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "SHEAR MAGIC | Editorial Grooming",
  description: "Curated grooming in Johnstown, PA. A study in precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased scroll-smooth">
      <body
        className={cn(
          playfair.variable,
          inter.variable,
          GeistMono.variable,
          "bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-white font-sans"
        )}
      >
         {/* The Atmospheric Noise Layer - Subtle texture */}
         <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-noise mix-blend-multiply"></div>
        
         {/* Visible Grid Lines - Editorial Structure */}
         <div className="fixed inset-0 pointer-events-none z-[0] flex justify-between max-w-[1600px] mx-auto px-8 md:px-16 opacity-10">
            <div className="w-px h-full bg-foreground"></div>
            <div className="w-px h-full bg-foreground hidden md:block"></div>
            <div className="w-px h-full bg-foreground hidden md:block"></div>
            <div className="w-px h-full bg-foreground"></div>
         </div>

        {children}
      </body>
    </html>
  );
}