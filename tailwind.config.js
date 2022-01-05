const colors = require('tailwindcss/colors');

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: "transparent",
      black: "#000",
      white: "#fff",
      red: colors.red,
      blue: colors.blue,
      orange: colors.orange,
      violet: colors.violet,
      pink: colors.pink,
      green: colors.green,
      yellow: colors.yellow,
      cyan: colors.cyan,
      purple: colors.purple,
      teal: colors.teal,
      gray: {
        50: "#fafafa",
        100: "#f5f5f5",
        200: "#E6E6E6",
        300: "#a7acb4", // placeholder color
        400: "#767f8a", // label color
        500: "#71717a",
        600: "#52525b",
        700: "#3f3f46",
        800: "#27272a",
        900: "#3C4248", // text color
      },
      custom: {
        "pink-100": "#FEFAFF", // wallet background
        "pink-200": "#F9E0FF", // wallet border
        "pink-300": "#f394ff", // gradient 2d color
        "purple-100": "#EFEDFA", // tabs
        "purple-300": "#a855f7", // gradient 1st color
        "purple-200": "#d893ff", // primary, link
      }
    },
    extend: {
      spacing: {
        "0.75": "0.1875rem",
        "1.25": "0.3125rem",
        "1.75": "0.4375rem",
        "2.25": "0.5625rem",
        "2.75": "0.6875rem",
        "3.25": "0.8125rem",
        "3.75": "0.9375rem",
        "4.25": "1.0625rem",
        "4.5": "1.125rem",
      },
      fontSize: {
        "xxs": "0.625rem",
        "2xl": "1.625rem",
      }
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      backgroundColor: ["checked"],
      borderColor: ["checked"],
      inset: ["checked"],
      zIndex: ["hover", "active"],
    }
  },
  plugins: [],
}
