import { vars, createTheme, alpha } from '@alspotron/ui/css-runtime';

export const {
  dark: darkTheme,
  light: lightTheme,
} = createTheme({
  light: {
    shadow: {
      none: 'none',
      xs: `0 1px 1px 0 ${alpha(vars.color.gray[700], 0.05)}`,
      sm: `0 1px 2px 0 ${alpha(vars.color.gray[900], 0.05)}`,
      md: `0 2px 4px 0 ${alpha(vars.color.gray[900], 0.05)}`,
      lg: `0 3px 8px 0 ${alpha(vars.color.gray[900], 0.05)}`,
      xl: `0 4px 12px 0 ${alpha(vars.color.gray[900], 0.05)}`,
    },
    role: {
      primary: {
        default: vars.color.blue[500],
        text: vars.color.gray[50],
        container: vars.color.blue[100],
        hover: vars.color.blue[600],
      },
      secondary: {
        default: vars.color.gray[200],
        text: vars.color.gray[900],
        container: vars.color.gray[50],
        hover: vars.color.gray[300],
      },
      surface: {
        default: alpha(vars.color.gray[50], 0.4),
        text: vars.color.gray[950],
        high: alpha(vars.color.gray[100], 0.2),
        highest: alpha(vars.color.gray[200], 0.2),
      },
      text: {
        default: vars.color.gray[950],
        caption: vars.color.gray[400],
      },
    },
  },
  dark: {
    shadow: {
      none: 'none',
      xs: `0 1px 1px 0 ${alpha(vars.color.gray[900], 0.1)}`,
      sm: `0 1px 2px 0 ${alpha(vars.color.gray[950], 0.2)}`,
      md: `0 2px 4px 0 ${alpha(vars.color.gray[950], 0.2)}`,
      lg: `0 3px 8px 0 ${alpha(vars.color.gray[950], 0.2)}`,
      xl: `0 4px 12px 0 ${alpha(vars.color.gray[950], 0.2)}`,
    },
    role: {
      primary: {
        default: vars.color.blue[500],
        text: vars.color.gray[50],
        container: vars.color.blue[900],
        hover: vars.color.blue[400],
      },
      secondary: {
        default: vars.color.gray[700],
        text: vars.color.gray[50],
        container: vars.color.gray[900],
        hover: vars.color.gray[600],
      },
      surface: {
        default: alpha(vars.color.gray[950], 0.4),
        text: vars.color.gray[50],
        high: alpha(vars.color.gray[900], 0.2),
        highest: alpha(vars.color.gray[800], 0.2),
      },
      text: {
        default: vars.color.gray[50],
        caption: vars.color.gray[600],
      },
    },
  },
});
