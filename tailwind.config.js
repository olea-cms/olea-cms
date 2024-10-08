/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.{html,pug}", // don't forget to add other files and directories
    "./src/**/*.{js,ts,jsx,tsx,pug}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    // themes: [
    //   {
    //     // olea_dark: {
    //     //   primary: "#769687",
    //     //   "primary-content": "#202020",
    //     //   secondary: "#505b55",
    //     //   "secondary-content": "#fcf9f1",
    //     //   accent: "#adaaa5",
    //     //   "accent-content": "#202020",
    //     //   neutral: "#202020",
    //     //   "neutral-content": "#adaaa5",
    //     //   "base-100": "#202020",
    //     //   "base-200": "#373c3a",
    //     //   "base-300": "#505b55",
    //     //   "base-content": "#fcf9f1",
    //     //   info: "#687c72",
    //     //   "info-content": "#fcf9f1",
    //     //   success: "#769687",
    //     //   "success-content": "#202020",
    //     //   warning: "#adaaa5",
    //     //   "warning-content": "#373c3a",
    //     //   error: "#505b55",
    //     //   "error-content": "#fcf9f1",
    //     // },
    //     // olea: {
    //     //   primary: "#769687",
    //     //   "primary-content": "#fcf9f1",
    //     //   secondary: "#505b55",
    //     //   "secondary-content": "#fcf9f1",
    //     //   accent: "#202020",
    //     //   "accent-content": "#fcf9f1",
    //     //   neutral: "#adaaa5",
    //     //   "neutral-content": "#202020",
    //     //   "base-100": "#687c72",
    //     //   "base-200": "#373c3a",
    //     //   "base-300": "#505b55",
    //     //   "base-content": "#fcf9f1",
    //     //   info: "#769687",
    //     //   "info-content": "#202020",
    //     //   success: "#687c72",
    //     //   "success-content": "#fcf9f1",
    //     //   warning: "#adaaa5",
    //     //   "warning-content": "#202020",
    //     //   error: "#505b55",
    //     //   "error-content": "#fcf9f1",
    //     // },
    //   },
    // ],
  },
};
