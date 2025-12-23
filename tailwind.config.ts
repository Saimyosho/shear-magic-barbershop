import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Minimal: Deep, quiet backgrounds
        background: "#0A0A0A",
        foreground: "#F5F5F5",

        // Muted tones for subtle layering
        muted: {
          DEFAULT: "rgba(255, 255, 255, 0.03)",
          foreground: "rgba(255, 255, 255, 0.45)",
        },

        // Accent: A single stem of color - used sparingly
        accent: {
          DEFAULT: "#C9A227", // Aged gold, more muted
          foreground: "#0A0A0A",
          muted: "rgba(201, 162, 39, 0.15)",
        },

        // Surface colors for depth
        surface: {
          DEFAULT: "#111111",
          elevated: "#161616",
        },

        // Border: Nearly invisible structure
        border: "rgba(255, 255, 255, 0.06)",
      },

      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },

      // Generous spacing for breathing room
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '36': '9rem',
        '44': '11rem',
        '52': '13rem',
      },

      letterSpacing: {
        tight: '-0.02em',
        normal: '0em',
        wide: '0.05em',
        wider: '0.1em',
        widest: '0.2em',
      },

      lineHeight: {
        'tight': '1.1',
        'snug': '1.25',
        'relaxed': '1.75',
      },

      // Precision timing - like quality mechanical movements
      transitionDuration: {
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },

      transitionTimingFunction: {
        'precision': 'cubic-bezier(0.16, 1, 0.3, 1)', // Smooth deceleration
        'gentle': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      boxShadow: {
        'soft': '0 1px 2px rgba(0,0,0,0.05)',
        'elevated': '0 4px 24px rgba(0,0,0,0.15)',
        'glow': '0 0 40px rgba(201, 162, 39, 0.08)',
      },

      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'reveal': 'reveal 1s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'float 20s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 8s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(0.5)', opacity: '0' },
          '50%': { transform: 'translateY(-80px) scale(1)', opacity: '0.6' },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.3' },
          '50%': { transform: 'scale(1.15)', opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
