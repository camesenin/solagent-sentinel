/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        solana: {
          green: "#14F195",
          purple: "#9945FF",
          dark: "#0C0D14",
          card: "#151722",
          border: "#252836",
          danger: "#FF4757",
          warning: "#FFA502",
          safe: "#2ED573"
        }
      }
    },
  },
  plugins: [],
};
