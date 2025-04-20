// tailwind.config.js
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: "#F5EEDC",
        primary: "#27548A",
        secondary: "#183B4E",
        accent: "#DDA853",
        dark: {
          bg: "#1A1A1A",
          text: "#E0E0E0",
          primary: "#3A7BCC",
          accent: "#FFC470",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
    },
  },
};