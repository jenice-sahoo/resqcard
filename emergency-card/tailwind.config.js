/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F7F6F3",
        ink: "#15191C",
        muted: "#5B6570",
        line: "#E1DFDA",
        trust: {
          DEFAULT: "#0B5D52",
          dark: "#083F38",
          light: "#E4F0EE",
        },
        alert: {
          DEFAULT: "#D64B37",
          dark: "#A9392A",
          light: "#FBEAE7",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "6px",
        lg: "10px",
      },
    },
  },
  plugins: [],
};
