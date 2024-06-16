const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./_site/**/*.{html,js}", "./_site/project/*"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        serif: ["Roboto Slab", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        background: "#eee",
        primary: "#444",
        'dark-background': "#0d1117",
        'dark-primary': "#c9d1d9",
      },
      typography: {
        DEFAULT: {
          css: {
            pre: false,
            code: false,
            "pre code": false,
            "code::before": false,
            "code::after": false,
          },
        },
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
