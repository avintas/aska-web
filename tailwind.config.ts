import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enable class-based dark mode
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "primary-brand": "#10b981",
        navy: {
          900: "#0a192f", // Dark navy color for grid cells
        },
      },
    },
  },
  plugins: [],
};

export default config;
