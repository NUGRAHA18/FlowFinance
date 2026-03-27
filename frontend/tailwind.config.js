/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f4f1",
          100: "#d2ded3",
          200: "#a5c8a7",
          300: "#84a585",
          400: "#628263",
          500: "#628263",
          600: "#4d684e",
          700: "#3a4f3b",
          800: "#273528",
          900: "#141b14",
        },
        surface: {
          DEFAULT: "#eaeee9",
          card: "#ffffff",
          hover: "#f9fafb",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
