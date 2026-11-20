import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cyber: {
          950: "#04060a",
          900: "#070a12",
          850: "#0c111d",
          800: "#111726",
          700: "#1b243b",
          600: "#273454",
        },
        neon: {
          cyan: "#00f2fe",
          violet: "#a855f7",
          purple: "#7c3aed",
          blue: "#38bdf8",
          emerald: "#10b981",
          rose: "#f43f5e",
          amber: "#f59e0b",
        },
        verdict: {
          supported: "#10b981",
          refuted: "#f43f5e",
          mixed: "#f59e0b",
          unverified: "#94a3b8",
        },
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px)",
        "radial-glow": "radial-gradient(circle at 50% 0%, rgba(0, 242, 254, 0.15), transparent 70%)",
        "radial-purple": "radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.15), transparent 60%)",
      },
      boxShadow: {
        "neon-cyan": "0 0 25px -5px rgba(0, 242, 254, 0.35)",
        "neon-violet": "0 0 25px -5px rgba(168, 85, 247, 0.35)",
        "neon-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.35)",
        "neon-rose": "0 0 25px -5px rgba(244, 63, 94, 0.35)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan": "scan 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        scan: {
          "0%, 100%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          from: { opacity: "0.6" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
