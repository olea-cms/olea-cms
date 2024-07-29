/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.{html,pug}", // don't forget to add other files and directories
    "./src/**/*.{js,ts,jsx,tsx,pug}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
