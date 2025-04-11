import { vars } from '@alspotron/ui/css-runtime';
import { style, styleVariants } from '@vanilla-extract/css';

export const containerStyle = styleVariants({
  default: {},
  hasGroup: {
    ':hover': {
      backgroundColor: vars.role.surface.high,
    },
    ':active': {
      backgroundColor: vars.role.surface.highest,
    },
  },
});

export const withGroupStyle = style({
  paddingBottom: vars.space.sm,
});

export const itemGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',

  marginLeft: `calc(1.0rem + ${vars.space.md})`,
  paddingTop: vars.space.lg,
  paddingBottom: vars.space.lg,
});

export const itemStyle = style({
  borderLeft: `${vars.line.bold} solid ${vars.role.surface.highest}`,

  selectors: {
    '&:first-child': {
      paddingTop: 0,
    },
    '&:last-child': {
      paddingBottom: 0,
    },
  },
});

export const expandStyle = styleVariants({
  default: {
    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  expand: {
    transform: 'rotate(180deg)',
    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  },
});