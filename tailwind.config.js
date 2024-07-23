/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#98EB5D", // Replace with your Figma color
        neutral: "#313131", // Replace with your Figma color
        background: "#242424", // Replace with your Figma color
        secondary: "#2340F0", // Replace with your Figma color
        // Add more custom colors as needed
      },
    },
  },
  plugins: [],
};
