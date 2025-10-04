import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          "baby-blue": "#B1EAFF",
          "bright-blue": "#017EFA",
          "light-bright-blue": "#017EFB",
          "bright-cyan": "#51CBFF",
          "cool-grey": "#82858E",
          coral: "#FD717A",
          "egg-blue": "#A3AED0",
          lavender: "#DAD7FE",
          "light-blue": "#808BC5",
          "light-grey": "#D0D1D4",
          "light-pink": "#FED7ED",
          "light-yellow": "#FFF29C",
          mint: "#0DDFA4",
          "pale blue-2": "#E6F2FE",
          "pale-blue": "#B6E9FF",
          "pale-green": "#D7FEE7",
          "pale-pink": "#FFAFAF",
          "peri-winkle": "#AFBCFF",
          "powder-blue": "#E7EDFC",
          "royal-blue": "#5671FF",
          white: "#FFFFFF",
        },
        background: {
          dashboard: "#f3f2ef",
        },
        secondary: {
          blue: "#4318FF",
          aqua: "#0DDFA4",
          white: "#FAFAFA",
        },
      },
    },
  },
  plugins: [],
};
export default config;
