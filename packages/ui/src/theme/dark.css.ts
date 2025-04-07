import { createTheme, globalStyle } from '@vanilla-extract/css';

import { vars } from './vars.css';

import { alpha } from './util';

const space = {
  none: '0',
  xxs: '0.2rem',
  xs: '0.4rem',
  sm: '0.8rem',
  md: '1.2rem',
  lg: '1.6rem',
  xl: '3.2rem',
  xxl: '6.4rem',
};

const line = {
  none: '0',
  light: '0.5px',
  md: '1px',
  bold: '2px',
};

const size = {
  none: '0',
  full: '100%',
  half: '50%',
};

const shadow = {
  none: 'none',
  xs: `0 1px 1px 0 ${alpha(vars.color.gray[700], 0.1)}`,
  sm: `0 1px 2px 0 ${alpha(vars.color.gray[900], 0.1)}`,
  md: `0 2px 4px 0 ${alpha(vars.color.gray[900], 0.1)}`,
  lg: `0 3px 8px 0 ${alpha(vars.color.gray[900], 0.1)}`,
  xl: `0 4px 12px 0 ${alpha(vars.color.gray[900], 0.1)}`,
};

const color = {
  red: {
    950: 'oklch(0.971 0.013 17.38)',
    900: 'oklch(0.936 0.032 17.717)',
    800: 'oklch(0.885 0.062 18.334)',
    700: 'oklch(0.808 0.114 19.571)',
    600: 'oklch(0.704 0.191 22.216)',
    500: 'oklch(0.637 0.237 25.331)',
    400: 'oklch(0.577 0.245 27.325)',
    300: 'oklch(0.505 0.213 27.518)',
    200: 'oklch(0.444 0.177 26.899)',
    100: 'oklch(0.396 0.141 25.723)',
    50: 'oklch(0.258 0.092 26.042)',
  },
  orange: {
    950: 'oklch(0.98 0.016 73.684)',
    900: 'oklch(0.954 0.038 75.164)',
    800: 'oklch(0.901 0.076 70.697)',
    700: 'oklch(0.837 0.128 66.29)',
    600: 'oklch(0.75 0.183 55.934)',
    500: 'oklch(0.705 0.213 47.604)',
    400: 'oklch(0.646 0.222 41.116)',
    300: 'oklch(0.553 0.195 38.402)',
    200: 'oklch(0.47 0.157 37.304)',
    100: 'oklch(0.408 0.123 38.172)',
    50: 'oklch(0.266 0.079 36.259)',
  },
  amber: {
    950: 'oklch(0.987 0.022 95.277)',
    900: 'oklch(0.962 0.059 95.617)',
    800: 'oklch(0.924 0.12 95.746)',
    700: 'oklch(0.879 0.169 91.605)',
    600: 'oklch(0.828 0.189 84.429)',
    500: 'oklch(0.769 0.188 70.08)',
    400: 'oklch(0.666 0.179 58.318)',
    300: 'oklch(0.555 0.163 48.998)',
    200: 'oklch(0.473 0.137 46.201)',
    100: 'oklch(0.414 0.112 45.904)',
    50: 'oklch(0.279 0.077 45.635)',
  },
  yellow: {
    950: 'oklch(0.987 0.026 102.212)',
    900: 'oklch(0.973 0.071 103.193)',
    800: 'oklch(0.945 0.129 101.54)',
    700: 'oklch(0.905 0.182 98.111)',
    600: 'oklch(0.852 0.199 91.936)',
    500: 'oklch(0.795 0.184 86.047)',
    400: 'oklch(0.681 0.162 75.834)',
    300: 'oklch(0.554 0.135 66.442)',
    200: 'oklch(0.476 0.114 61.907)',
    100: 'oklch(0.421 0.095 57.708)',
    50: 'oklch(0.286 0.066 53.813)',
  },
  lime: {
    950: 'oklch(0.986 0.031 120.757)',
    900: 'oklch(0.967 0.067 122.328)',
    800: 'oklch(0.938 0.127 124.321)',
    700: 'oklch(0.897 0.196 126.665)',
    600: 'oklch(0.841 0.238 128.85)',
    500: 'oklch(0.768 0.233 130.85)',
    400: 'oklch(0.648 0.2 131.684)',
    300: 'oklch(0.532 0.157 131.589)',
    200: 'oklch(0.453 0.124 130.933)',
    100: 'oklch(0.405 0.101 131.063)',
    50: 'oklch(0.274 0.072 132.109)',
  },
  green: {
    950: 'oklch(0.982 0.018 155.826)',
    900: 'oklch(0.962 0.044 156.743)',
    800: 'oklch(0.925 0.084 155.995)',
    700: 'oklch(0.871 0.15 154.449)',
    600: 'oklch(0.792 0.209 151.711)',
    500: 'oklch(0.723 0.219 149.579)',
    400: 'oklch(0.627 0.194 149.214)',
    300: 'oklch(0.527 0.154 150.069)',
    200: 'oklch(0.448 0.119 151.328)',
    100: 'oklch(0.393 0.095 152.535)',
    50: 'oklch(0.266 0.065 152.934)',
  },
  emerald: {
    950: 'oklch(0.979 0.021 166.113)',
    900: 'oklch(0.95 0.052 163.051)',
    800: 'oklch(0.905 0.093 164.15)',
    700: 'oklch(0.845 0.143 164.978)',
    600: 'oklch(0.765 0.177 163.223)',
    500: 'oklch(0.696 0.17 162.48)',
    400: 'oklch(0.596 0.145 163.225)',
    300: 'oklch(0.508 0.118 165.612)',
    200: 'oklch(0.432 0.095 166.913)',
    100: 'oklch(0.378 0.077 168.94)',
    50: 'oklch(0.262 0.051 172.552)',
  },
  teal: {
    950: 'oklch(0.984 0.014 180.72)',
    900: 'oklch(0.953 0.051 180.801)',
    800: 'oklch(0.91 0.096 180.426)',
    700: 'oklch(0.855 0.138 181.071)',
    600: 'oklch(0.777 0.152 181.912)',
    500: 'oklch(0.704 0.14 182.503)',
    400: 'oklch(0.6 0.118 184.704)',
    300: 'oklch(0.511 0.096 186.391)',
    200: 'oklch(0.437 0.078 188.216)',
    100: 'oklch(0.386 0.063 188.416)',
    50: 'oklch(0.277 0.046 192.524)',
  },
  cyan: {
    950: 'oklch(0.984 0.019 200.873)',
    900: 'oklch(0.956 0.045 203.388)',
    800: 'oklch(0.917 0.08 205.041)',
    700: 'oklch(0.865 0.127 207.078)',
    600: 'oklch(0.789 0.154 211.53)',
    500: 'oklch(0.715 0.143 215.221)',
    400: 'oklch(0.609 0.126 221.723)',
    300: 'oklch(0.52 0.105 223.128)',
    200: 'oklch(0.45 0.085 224.283)',
    100: 'oklch(0.398 0.07 227.392)',
    50: 'oklch(0.302 0.056 229.695)',
  },
  sky: {
    950: 'oklch(0.977 0.013 236.62)',
    900: 'oklch(0.951 0.026 236.824)',
    800: 'oklch(0.901 0.058 230.902)',
    700: 'oklch(0.828 0.111 230.318)',
    600: 'oklch(0.746 0.16 232.661)',
    500: 'oklch(0.685 0.169 237.323)',
    400: 'oklch(0.588 0.158 241.966)',
    300: 'oklch(0.5 0.134 242.749)',
    200: 'oklch(0.443 0.11 240.79)',
    100: 'oklch(0.391 0.09 240.876)',
    50: 'oklch(0.293 0.066 243.157)',
  },
  blue: {
    950: 'oklch(0.97 0.014 254.604)',
    900: 'oklch(0.932 0.032 255.585)',
    800: 'oklch(0.882 0.059 254.128)',
    700: 'oklch(0.809 0.105 251.813)',
    600: 'oklch(0.707 0.165 254.624)',
    500: 'oklch(0.623 0.214 259.815)',
    400: 'oklch(0.546 0.245 262.881)',
    300: 'oklch(0.488 0.243 264.376)',
    200: 'oklch(0.424 0.199 265.638)',
    100: 'oklch(0.379 0.146 265.522)',
    50: 'oklch(0.282 0.091 267.935)',
  },
  indigo: {
    950: 'oklch(0.962 0.018 272.314)',
    900: 'oklch(0.93 0.034 272.788)',
    800: 'oklch(0.87 0.065 274.039)',
    700: 'oklch(0.785 0.115 274.713)',
    600: 'oklch(0.673 0.182 276.935)',
    500: 'oklch(0.585 0.233 277.117)',
    400: 'oklch(0.511 0.262 276.966)',
    300: 'oklch(0.457 0.24 277.023)',
    200: 'oklch(0.398 0.195 277.366)',
    100: 'oklch(0.359 0.144 278.697)',
    50: 'oklch(0.257 0.09 281.288)',
  },
  violet: {
    950: 'oklch(0.969 0.016 293.756)',
    900: 'oklch(0.943 0.029 294.588)',
    800: 'oklch(0.894 0.057 293.283)',
    700: 'oklch(0.811 0.111 293.571)',
    600: 'oklch(0.702 0.183 293.541)',
    500: 'oklch(0.606 0.25 292.717)',
    400: 'oklch(0.541 0.281 293.009)',
    300: 'oklch(0.491 0.27 292.581)',
    200: 'oklch(0.432 0.232 292.759)',
    100: 'oklch(0.38 0.189 293.745)',
    50: 'oklch(0.283 0.141 291.089)',
  },
  purple: {
    950: 'oklch(0.977 0.014 308.299)',
    900: 'oklch(0.946 0.033 307.174)',
    800: 'oklch(0.902 0.063 306.703)',
    700: 'oklch(0.827 0.119 306.383)',
    600: 'oklch(0.714 0.203 305.504)',
    500: 'oklch(0.627 0.265 303.9)',
    400: 'oklch(0.558 0.288 302.321)',
    300: 'oklch(0.496 0.265 301.924)',
    200: 'oklch(0.438 0.218 303.724)',
    100: 'oklch(0.381 0.176 304.987)',
    50: 'oklch(0.291 0.149 302.717)',
  },
  fuchsia: {
    950: 'oklch(0.977 0.017 320.058)',
    900: 'oklch(0.952 0.037 318.852)',
    800: 'oklch(0.903 0.076 319.62)',
    700: 'oklch(0.833 0.145 321.434)',
    600: 'oklch(0.74 0.238 322.16)',
    500: 'oklch(0.667 0.295 322.15)',
    400: 'oklch(0.591 0.293 322.896)',
    300: 'oklch(0.518 0.253 323.949)',
    200: 'oklch(0.452 0.211 324.591)',
    100: 'oklch(0.401 0.17 325.612)',
    50: 'oklch(0.293 0.136 325.661)',
  },
  pink: {
    950: 'oklch(0.971 0.014 343.198)',
    900: 'oklch(0.948 0.028 342.258)',
    800: 'oklch(0.899 0.061 343.231)',
    700: 'oklch(0.823 0.12 346.018)',
    600: 'oklch(0.718 0.202 349.761)',
    500: 'oklch(0.656 0.241 354.308)',
    400: 'oklch(0.592 0.249 0.584)',
    300: 'oklch(0.525 0.223 3.958)',
    200: 'oklch(0.459 0.187 3.815)',
    100: 'oklch(0.408 0.153 2.432)',
    50: 'oklch(0.284 0.109 3.907)',
  },
  rose: {
    950: 'oklch(0.969 0.015 12.422)',
    900: 'oklch(0.941 0.03 12.58)',
    800: 'oklch(0.892 0.058 10.001)',
    700: 'oklch(0.81 0.117 11.638)',
    600: 'oklch(0.712 0.194 13.428)',
    500: 'oklch(0.645 0.246 16.439)',
    400: 'oklch(0.586 0.253 17.585)',
    300: 'oklch(0.514 0.222 16.935)',
    200: 'oklch(0.455 0.188 13.697)',
    100: 'oklch(0.41 0.159 10.272)',
    50: 'oklch(0.271 0.105 12.094)',
  },
  gray: {
    950: 'oklch(0.985 0 0)',
    900: 'oklch(0.967 0.001 286.375)',
    800: 'oklch(0.92 0.004 286.32)',
    700: 'oklch(0.871 0.006 286.286)',
    600: 'oklch(0.705 0.015 286.067)',
    500: 'oklch(0.552 0.016 285.938)',
    400: 'oklch(0.442 0.017 285.786)',
    300: 'oklch(0.37 0.013 285.805)',
    200: 'oklch(0.274 0.006 286.033)',
    100: 'oklch(0.21 0.006 285.885)',
    50: 'oklch(0.141 0.005 285.823)',
  },
};

export const darkThemeClass = createTheme(vars, {
  space,
  size,
  color,
  line,
  shadow,
});

globalStyle(`:where(.${darkThemeClass} *)`, {
  color: vars.color.gray[900],
});
