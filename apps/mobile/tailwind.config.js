/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0a0a0f",
          card: "#12121a",
          border: "#1e1e2e",
        },
        primary: "#e4e4ed",
        muted: "#8888a0",
        accent: "#ff6b35",
        success: "#10b981",
      },
    },
  },
  plugins: [],
};
