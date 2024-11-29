import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "drop-input-gradient":
          "linear-gradient(90deg, silver, gray, silver, gray)",
      },
      backgroundSize: {
        large: "400% 100%",
      },
      keyframes: {
        blink: {
          "0%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0",
            transform: "scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        glow: {
          "0%": {
            boxShadow: "0 0 10px rgba(78, 115, 223, 0.8)",
          },
          "50%": {
            boxShadow:
              "0 0 20px rgba(78, 115, 223, 1.5), 0 0 30px rgba(78, 115, 223, 0.7)" /* Stronger glow */,
          },
          "100%": {
            boxShadow: "0 0 10px rgba(78, 115, 223, 0.8)",
          },
        },
        textGlow: {
          "0%": {
            textShadow: "0 0 5px rgba(78, 115, 223, 0.8)",
          },
          "50%": {
            textShadow:
              "0 0 15px rgba(78, 115, 223, 1.5), 0 0 25px rgba(78, 115, 223, 0.8)" /* Stronger glow */,
          },
          "100%": {
            textShadow: " 0 0 5px rgba(78, 115, 223, 0.8)",
          },
        },
        backgroundMove: {
          "0%": { "background-position": "100% 0" },
          "50%": { "background-position": "0 0" },
          "100%": { "background-position": "100% 0" },
        },
        scale: {
          "0%": { opacity: "0" },
          "50%": { transform: "scale(0.5)" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        blink: "blink 1s ease-in-out infinite",
        glow: "glow 1.5s ease-in-out infinite",
        textGlow: "textGlow 1.5s ease-in-out infinite",
        backgroundMove: "backgroundMove 10s ease-out infinite",
        backgroundDeleter: "backgroundMove 3s ease-out forwards",
        scale: "scale 0.2s ease-in-out ",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
