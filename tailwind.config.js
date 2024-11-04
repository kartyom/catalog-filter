/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    animation: {
      loading: "loading 1s ease-out infinite",
      spin: "spin 1s infinite linear",
    },
    keyframes: {
      loading: {
        "0%": {
          opacity: 0.4,
          transform: "translateY(-3px)",
        },
        "50%": {
          opacity: 1,
          transform: "translateY(3px)",
        },
        "100%": {
          opacity: 0.4,
          transform: "translateY(-3px)",
        },
      },
      spin: {
        from: {
          transform: "rotate(0deg)",
        },
        to: {
          transform: "rotate(360deg)",
        },
      },
    },

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
