import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        orbit: {
          ink: "#111111",
          muted: "#8d9890",
          line: "#edf0ec",
          bg: "#f1f2f1",
          wash: "#f7f8f6",
          primary: "#0f6b42",
          primaryDark: "#064123",
          mid: "#168252",
          green: "#238b57",
          orange: "#c46d17",
          red: "#c43d3d",
          blue: "#3c63d8",
        },
        // Retarget the default Tailwind scales used throughout the
        // dashboard (green-700, amber-50, blue-600, red-500, ...) to the
        // brief's deep-emerald soft-minimal palette, so every existing
        // utility class renders the correct brand color.
        green: {
          50: "#eef6f1",
          100: "#d7ece0",
          200: "#b0d9c2",
          300: "#82c0a0",
          400: "#4fa47a",
          500: "#238b57",
          600: "#168252",
          700: "#0f6b42",
          800: "#0c5636",
          900: "#064123",
          950: "#032414",
        },
        amber: {
          50: "#fdf2e4",
          100: "#fae0bd",
          200: "#f4c583",
          300: "#eba649",
          400: "#d68a24",
          500: "#c46d17",
          600: "#ad5f13",
          700: "#8f4d10",
          800: "#6a390c",
        },
        blue: {
          50: "#eef1fc",
          100: "#d7ddf8",
          200: "#b0bdf1",
          300: "#8296e8",
          400: "#5c74e0",
          500: "#3c63d8",
          600: "#3151b8",
          700: "#2a459a",
        },
        red: {
          50: "#fbeceb",
          100: "#f6d2cf",
          200: "#eba7a1",
          300: "#de7972",
          400: "#cf554d",
          500: "#c43d3d",
          600: "#ac3232",
          700: "#8a2828",
          800: "#6a1f1f",
        },
      },
      boxShadow: {
        soft: "0 16px 45px rgba(17, 17, 17, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
