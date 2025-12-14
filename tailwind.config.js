/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/ui/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Linear-inspired light-blue primary palette
        linear: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        // Light mode surface colors
        surface: {
          primary: "#fafcff",
          secondary: "#f0f7ff",
          tertiary: "#e8f1fb",
          elevated: "#ffffff",
        },
        // Dark mode surface colors
        "surface-dark": {
          primary: "#0a0f1a",
          secondary: "#111827",
          tertiary: "#1e293b",
          elevated: "#1a2234",
        },
      },
      boxShadow: {
        linear:
          "0 1px 3px 0 rgba(14, 165, 233, 0.1), 0 1px 2px -1px rgba(14, 165, 233, 0.1)",
        "linear-md":
          "0 4px 6px -1px rgba(14, 165, 233, 0.1), 0 2px 4px -2px rgba(14, 165, 233, 0.1)",
        "linear-lg":
          "0 10px 15px -3px rgba(14, 165, 233, 0.1), 0 4px 6px -4px rgba(14, 165, 233, 0.1)",
        "linear-glow": "0 0 20px rgba(14, 165, 233, 0.15)",
        "linear-glow-lg": "0 0 40px rgba(14, 165, 233, 0.2)",
        glass: "0 8px 32px rgba(14, 165, 233, 0.08)",
      },
      backgroundImage: {
        "gradient-linear":
          "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #ffffff 100%)",
        "gradient-linear-dark":
          "linear-gradient(135deg, #0a0f1a 0%, #111827 50%, #1e293b 100%)",
        "gradient-btn": "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
        "gradient-btn-hover":
          "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "slide-down": "slideDown 0.3s ease-out forwards",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "spin-slow": "spin 1.5s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(14, 165, 233, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(14, 165, 233, 0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
