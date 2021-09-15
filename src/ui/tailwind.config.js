const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        "drip-purple": {
          50: "#c3a1f8",
          100: "#aa83e8",
          200: "#9265d8",
          300: "#7948c8",
          400: "#612ab8",
          500: "#480ca8",
          600: "#36097e",
          700: "#250655",
          800: "#13032b",
          900: "#010001",
        },
        "drip-pink": {
          100: "#fdc9e1",
          200: "#fb92c2",
          300: "#f95ca4",
          400: "#f72585",
          500: "#da1e74",
          600: "#bd1863",
          700: "#a01153",
          800: "#830b42",
          900: "#660431",
        },
      },
      fontFamily: {
        logo: ["Candy Flavor"],
        sans: ["Nunito", ...defaultTheme.fontFamily.sans],
      },
      gridTemplateColumns: {
        label: "auto 1fr",
      },
      flex: {
        2: "2 2 0%",
        3: "3 3 0%",
      },
      spacing: {
        108: "28rem",
      },
    },
  },
  variants: {
    extend: {
      dropShadow: ["hover", "focus"],
      translate: ["group-hover"],
      rotate: ["group-hover"],
      borderWidth: ["hover", "focus"],
      display: ["group-hover", "hover", "focus"],
      visibility: ["group-hover", "hover", "focus"],
      pointerEvents: ["group-hover", "hover", "focus"],
      ringWidth: ["hover", "active"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
