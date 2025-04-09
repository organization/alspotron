import { style, styleVariants } from '@vanilla-extract/css';

import { vars } from '../../theme';

export const baseContainerStyle = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: vars.space.xs,

  fontSize: '1.4rem',
  cursor: 'text',

  border: 'none',
});

export const containerStyle = styleVariants({
  default: [baseContainerStyle, {
    backgroundColor: vars.role.surface.default,
    color: vars.role.surface.text,

    borderStyle: 'solid',
    borderWidth: vars.line.md,
    borderColor: vars.role.surface.highest,
    borderRadius: vars.space.sm,
    padding: `${vars.space.sm} ${vars.space.md}`,
    boxShadow: vars.shadow.xs,

    ':hover': {
      borderColor: vars.role.surface.high,
    },
    ':focus-visible': {
      outlineStyle: 'solid',
      outlineOffset: vars.line.md,
      outlineColor: vars.color.gray[900],
      outlineWidth: vars.line.bold,
    },
    ':focus-within': {
    },
  }],
});

export const inputStyle = style({
  width: '100%',

  fontSize: '1.4rem',
  outline: 'none',
  border: 'none',

  selectors: {
    '&::placeholder': {
      color: vars.role.text.caption,
    }
  }
});
