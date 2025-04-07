import { createVar, fallbackVar, style, styleVariants } from '@vanilla-extract/css';

import { vars } from '../../theme';

export const hoverBackgroundStyle = createVar();
export const containerStyle = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: vars.space.md,

  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.space.sm,
  overflow: 'hidden',
  flexShrink: 0,
});
export const clickableContainerStyle = style({
  userSelect: 'none',
  cursor: 'pointer',

  ':hover': {
    background: fallbackVar(hoverBackgroundStyle, vars.color.gray['100']),
  }
});

export const disabledStyle = style({
  color: vars.color.gray['400'],
  cursor: 'default',

  ':hover': {
    background: 'none',
  }
});

export const textGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: vars.space.xs,

  flex: 1,
});

export const textStyle = styleVariants({
  default: {
    fontSize: '1.4rem',
  },
  caption: {
    fontSize: '1.2rem',
    color: vars.color.gray['400'],
  }
});
