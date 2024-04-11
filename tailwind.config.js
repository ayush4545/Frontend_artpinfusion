/** @type {import('tailwindcss').Config} */
export default {
  darkMode:"class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0px 0px 35px -4px rgba(0,0,0,0.5);',
      },
      aspectRatio:{
        "9/16":"9/16"
      }

    }
  },
  plugins: [],
}