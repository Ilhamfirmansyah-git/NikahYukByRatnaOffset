import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8B5E3C",
          50: "#FDF8F4",
          100: "#F5E6D3",
          200: "#E8C9A8",
          300: "#D4A97D",
          400: "#C08B5A",
          500: "#8B5E3C",
          600: "#7A5235",
          700: "#65432B",
          800: "#503521",
          900: "#3B2718",
        },
        cream: {
          DEFAULT: "#F5E6D3",
          50: "#FEFCF9",
          100: "#FBF5EC",
          200: "#F5E6D3",
          300: "#EDD0B0",
          400: "#E0B88A",
        },
        warm: {
          50: "#FDF8F4",
          100: "#F9EDE0",
          200: "#F0D5B8",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
