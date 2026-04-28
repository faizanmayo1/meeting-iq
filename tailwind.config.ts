import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1440px" } },
    extend: {
      colors: {
        canvas: "hsl(var(--canvas) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        subtle: "hsl(var(--subtle) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        border: {
          soft: "hsl(var(--border-soft) / <alpha-value>)",
          DEFAULT: "hsl(var(--border-default) / <alpha-value>)",
          strong: "hsl(var(--border-strong) / <alpha-value>)",
        },
        ink: {
          primary: "hsl(var(--ink-primary) / <alpha-value>)",
          secondary: "hsl(var(--ink-secondary) / <alpha-value>)",
          muted: "hsl(var(--ink-muted) / <alpha-value>)",
          disabled: "hsl(var(--ink-disabled) / <alpha-value>)",
          invert: "hsl(var(--ink-invert) / <alpha-value>)",
        },
        brand: {
          50: "hsl(var(--brand-50) / <alpha-value>)",
          100: "hsl(var(--brand-100) / <alpha-value>)",
          300: "hsl(var(--brand-300) / <alpha-value>)",
          500: "hsl(var(--brand-500) / <alpha-value>)",
          600: "hsl(var(--brand-600) / <alpha-value>)",
          700: "hsl(var(--brand-700) / <alpha-value>)",
          900: "hsl(var(--brand-900) / <alpha-value>)",
        },
        success: {
          50: "hsl(var(--success-50) / <alpha-value>)",
          500: "hsl(var(--success-500) / <alpha-value>)",
          700: "hsl(var(--success-700) / <alpha-value>)",
        },
        warning: {
          50: "hsl(var(--warning-50) / <alpha-value>)",
          500: "hsl(var(--warning-500) / <alpha-value>)",
          700: "hsl(var(--warning-700) / <alpha-value>)",
        },
        danger: {
          50: "hsl(var(--danger-50) / <alpha-value>)",
          500: "hsl(var(--danger-500) / <alpha-value>)",
          700: "hsl(var(--danger-700) / <alpha-value>)",
        },
        accent: {
          50: "hsl(var(--accent-50) / <alpha-value>)",
          500: "hsl(var(--accent-500) / <alpha-value>)",
          700: "hsl(var(--accent-700) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["InterVariable", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Newsreader"', "ui-serif", "Georgia", "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "Menlo", "monospace"],
      },
      fontSize: {
        "display": ["2.5rem", { lineHeight: "2.85rem", letterSpacing: "-0.02em", fontWeight: "500" }],
        "h1": ["2rem", { lineHeight: "2.4rem", letterSpacing: "-0.015em", fontWeight: "500" }],
        "h2": ["1.5rem", { lineHeight: "1.95rem", letterSpacing: "-0.01em", fontWeight: "500" }],
        "h3": ["1.125rem", { lineHeight: "1.625rem", fontWeight: "600" }],
        "body-lg": ["1rem", { lineHeight: "1.55rem" }],
        "body": ["0.875rem", { lineHeight: "1.45rem" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.3rem" }],
        "caption": ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.06em", fontWeight: "500" }],
        "kpi": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.02em", fontWeight: "500" }],
        "kpi-sm": ["1.5rem", { lineHeight: "1.85rem", letterSpacing: "-0.01em", fontWeight: "500" }],
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.625rem",
        xl: "0.875rem",
        "2xl": "1rem",
      },
      boxShadow: {
        "elev-1": "0 1px 2px rgba(15,23,42,0.04), 0 1px 1px rgba(15,23,42,0.03)",
        "elev-2": "0 8px 24px -8px rgba(15,23,42,0.12)",
        "elev-3": "0 24px 48px -16px rgba(15,23,42,0.18)",
      },
      backgroundImage: {
        "grid-soft":
          "linear-gradient(to right, hsl(var(--border-soft) / 0.5) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border-soft) / 0.5) 1px, transparent 1px)",
        "ai-edge":
          "linear-gradient(135deg, hsl(var(--brand-500) / 0.4), hsl(var(--accent-500) / 0.4))",
      },
      backgroundSize: { "grid-soft": "24px 24px" },
      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ping-soft": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "75%, 100%": { transform: "scale(2.4)", opacity: "0" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "slide-up": "slide-up 240ms ease-out",
        "ping-soft": "ping-soft 1.8s cubic-bezier(0,0,0.2,1) infinite",
        "shimmer": "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [animate],
};
export default config;
