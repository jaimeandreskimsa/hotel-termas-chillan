import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          primary: "#1B4332",
          dark: "#13311F",
          medium: "#2D6A4F",
          light: "#52B788",
          pale: "#D8F3DC",
        },
        cream: {
          DEFAULT: "#F5F0E8",
          light: "#FFFDF6",
          dark: "#EDE6D8",
          border: "#E0D8CC",
        },
        brown: {
          text: "#3D2B1F",
          muted: "#7B6354",
          light: "#A08070",
        },
        alert: "#D4722A",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 2px 16px rgba(0,0,0,0.08)",
        "card-hover": "0 4px 24px rgba(0,0,0,0.14)",
        header: "0 2px 8px rgba(0,0,0,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
