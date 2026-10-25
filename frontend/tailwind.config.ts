import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        navy: {
          DEFAULT: "#163A70",
          50: "#F0F4FA",
          100: "#E1E9F5",
          200: "#C2D3EB",
          300: "#94B2DC",
          400: "#5D8BCA",
          500: "#2F65B2",
          600: "#214E94",
          700: "#1B4380",
          800: "#163A70",
          900: "#0F2850",
          950: "#0A1B38",
        },
        surface: {
          DEFAULT: "#F5F7FA",
          50: "#FFFFFF",
          100: "#F5F7FA",
          200: "#EBEFF5",
          300: "#DDE3ED",
        },
        accent: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
