import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        // Legacy palette support (mapping to new system where possible)
        obsidian: {
          900: "#1A1A1A", 
          800: "#2A2A2A",
          700: "#3A3A3A",
          glass: "rgba(26, 26, 26, 0.6)",
        },
        gold: {
          100: "#F9F1D8",
          200: "#F0DEAA",
          300: "#E6CB7D",
          400: "#DDB753",
          500: "#D4AF37", // Matching new accent
          600: "#AA8222",
          700: "#80621A",
          800: "#554111",
          900: "#2B2009",
          glow: "rgba(212, 175, 55, 0.5)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.25em', // Editorial tracking
      },
      lineHeight: {
        'extra-tight': '0.9',
      },
      backgroundImage: {
        'noise': "url('https://grainy-gradients.vercel.app/noise.svg')",
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '2000': '2000ms', // For slow cinematic images
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.02)',
        'lifted': '0 8px 32px rgba(0,0,0,0.12)',
        'inner-border': 'inset 0 0 0 1px rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-out',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
