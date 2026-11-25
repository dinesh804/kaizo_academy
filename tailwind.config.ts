import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: {
    bg: "#080808", bg2: "#171717", card: "#1c1c1c",
    cyan: "#FFD700", violet: "#D4AF37", magenta: "#F5E6B8", muted: "#B8B8B8" },
    fontFamily: { display: ["var(--font-display)"], body: ["var(--font-body)"] } } },
  plugins: [],
} satisfies Config;
