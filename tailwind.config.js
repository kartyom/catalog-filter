/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      "mobile+": "640px",
      tablet: "768px",
      "tablet+": "1024px",
      desktop: "1224px",
      "desktop+": "1536px",
    },

    fontWeight: {
      400: 400,
      500: 500,
      600: 600,
      700: 700,
      800: 800,
    },

    extend: {},
  },
  plugins: [],
};
