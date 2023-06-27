import colors from 'tailwindcss/colors';

delete colors.lightBlue;
delete colors.warmGray;
delete colors.trueGray;
delete colors.coolGray;
delete colors.blueGray;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./renderer/index.html",
    "./renderer/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      ...colors,
      primary: colors.cyan,
      secondary: colors.emerald,
      success: colors.green,
      error: colors.red,
      warn: colors.yellow,
    },
  },
  plugins: [],
}

