/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary_color: "#1c1e29",
        primary_color_1: "#282a36",
        secondary_color: "#4aed88",
      },
    },
  },
  plugins: [],
};
