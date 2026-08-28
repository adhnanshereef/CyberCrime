/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#8c3600",
        "primary-container": "#b34700",
        "on-primary": "#ffffff",
        "background": "#FDFCF9",
        "on-background": "#1f1b16",
        "surface": "#FFFFFF",
        "on-surface": "#1f1b16",
        "surface-container": "#f6ece4",
        "surface-container-low": "#fcf2e9",
        "surface-container-highest": "#eae1d8",
        "border": "#E4E0D8",
        "outline": "#8b7267",
        "text-secondary": "#5B564C",
        "urgent": "#C1121F"
      },
      fontFamily: {
        "primary": ["var(--font-primary)", "serif"],
        "sans": ["system-ui", "sans-serif"]
      }
    },
  },
  plugins: [],
}
