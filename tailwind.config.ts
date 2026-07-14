import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        orbit: {
          ink: "#25212a",
          muted: "#6f6878",
          line: "#e5e1ea",
          wash: "#f7f6f9",
          primary: "#635bff",
          primaryDark: "#473fd1",
          green: "#238b57",
          orange: "#c46d17",
          red: "#c43d3d",
          blue: "#3c63d8",
        },
      },
      boxShadow: {
        soft: "0 16px 45px rgba(44, 38, 55, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
