// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{html,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      black: "#000",
      white: "#fff",
      text: "#413F54",
      red: colors.red,
      blue: colors.blue,
      violet: colors.violet,
      pink: colors.pink,
      green: colors.green,
      yellow: colors.yellow,
      cyan: colors.cyan,
      purple: colors.purple,
      teal: colors.teal,
      gray: {
        ...colors.gray,
        50: "#F6F6FF",
      },
      orange: {
        50: "rgba(255, 129, 67, 0.05)",
        100: "rgba(255, 129, 67, 0.1)",
        200: "rgba(255, 129, 67, 0.2)",
        300: "rgba(255, 129, 67, 0.3)",
        400: "rgba(255, 129, 67, 0.4)",
        500: "rgba(255, 129, 67, 0.5)",
        600: "rgba(255, 129, 67, 0.6)",
        700: "rgba(255, 129, 67, 0.7)",
        800: "rgba(255, 129, 67, 0.8)",
        900: "rgba(255, 129, 67, 1)",
      },
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
      },
      boxShadow: {
        modal: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      borderColor: {
        "default": "rgba(192, 192, 216, 0.4)",
        "control-normal": "#DADADD",
        "control-hover": "#9898BF",
        "control-focused": "#9898BF",
        "control-disabled": "#DADAEE",
        "control-error": "#F17070",
        "control-success": "#88CA7F",
      },
      backgroundColor: {
        "control-disabled": "rgba(227, 229, 254, 0.5)",
      },
      textColor: {
        default: "#413F54",
        primary: "#FF7A49",
        secondary: "rgba(65, 63, 84, 0.6)",
        error: "#FF5151",
        success: "#88CA7F",
        disabled: "#AEAEC5",
      },
      borderRadius: {
        large: "2rem",
        big: "1.5rem",
        medium: "1rem",
        small: "0.75rem",
      },
      backgroundImage: {
        "primary-gradient-normal": "linear-gradient(270deg, rgba(255, 71, 71, 0.93) 0%, rgba(255, 128, 73, 0.93) 100%)",
        "primary-gradient-hover": "linear-gradient(270deg, rgba(255, 71, 71, 0.78) 0%, rgba(255, 128, 73, 0.78) 100%)",
        "primary-gradient-focused": "linear-gradient(270deg, rgba(255, 71, 71, 0.9) 0%, rgba(255, 128, 73, 0.9) 100%)",
        "primary-gradient-light-normal": "linear-gradient(270deg, rgba(255, 145, 71, 0.97) 0%, rgba(255, 122, 73, 0.97) 100%)",
        "primary-gradient-light-hover": "linear-gradient(270deg, rgba(255, 145, 71, 0.8) 0%, rgba(255, 122, 73, 0.8) 100%)",
        "primary-gradient-light-focused": "linear-gradient(270deg, rgba(255, 145, 71, 0.9) 0%, rgba(255, 122, 73, 0.9) 100%)",
      }
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      backgroundColor: ["checked", "focus", "disabled"],
      backgroundImage: ["checked", "hover", "focus", "disabled"],
      borderColor: ["checked", "hover", "focus", "disabled"],
      inset: ["checked"],
      zIndex: ["hover", "active"],
      fontWeight: ["hover"],
      cursor: ["hover"],
    }
  },
  extend: {
    animation: {
      spin: "spin 0.3 infinite"
    }
  },
  plugins: [],
}
