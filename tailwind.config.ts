import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: {
    bg: "rgb(var(--color-background-rgb) / <alpha-value>)", bg2: "rgb(var(--color-background-secondary-rgb) / <alpha-value>)", card: "rgb(var(--color-card-rgb) / <alpha-value>)",
    crimson: "rgb(var(--color-crimson-rgb) / <alpha-value>)", neon: "rgb(var(--color-neon-rgb) / <alpha-value>)", "crimson-soft": "rgb(var(--color-crimson-soft-rgb) / <alpha-value>)", muted: "rgb(var(--color-muted-rgb) / <alpha-value>)" },
    fontFamily: { display: ["var(--font-display)"], body: ["var(--font-body)"] } } },
  plugins: [],
} satisfies Config;
