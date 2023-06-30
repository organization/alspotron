import colors from 'tailwindcss/colors';

delete colors.lightBlue;
delete colors.warmGray;
delete colors.trueGray;
delete colors.coolGray;
delete colors.blueGray;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './renderer/index.html',
    './renderer/**/*.{js,ts,jsx,tsx}',
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
    fontSize: {
      'xs': '0.75rem',
      'sm': '0.875rem',
      'base': '0.875rem',
      'lg': '1rem',
      'xl': '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    },
  },
  plugins: [],
}

