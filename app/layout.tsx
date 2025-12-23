import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";

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
        <Header />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}