import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
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
  plugins: [
    '@tailwindcss/typography'
  ],
}; 