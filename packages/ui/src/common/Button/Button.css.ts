import { style, styleVariants } from '@vanilla-extract/css';

import { alpha, layered, l2Layer, vars } from '../../theme';

const baseButtonStyle = style(layered({
  width: 'fit-content',

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',

  fontSize: '1.4rem',
  fontWeight: '500',
  cursor: 'pointer',

  border: 'none',

  ':focus-visible': {
    outlineStyle: 'solid',
    outlineOffset: vars.line.md,
    outlineColor: vars.color.gray[900],
    outlineWidth: vars.line.bold,
  },
}, l2Layer));
export const buttonStyle = styleVariants({
  default: [baseButtonStyle, {
    backgroundColor: vars.role.surface.default,
    color: vars.role.surface.text,

    borderStyle: 'solid',
    borderWidth: vars.line.md,
    borderColor: vars.role.surface.highest,
    borderRadius: vars.space.sm,
    padding: `${vars.space.sm} ${vars.space.md}`,
    boxShadow: vars.shadow.xs,

    ':hover': {
      backgroundColor: vars.role.surface.high,
    },
    ':active': {
      backgroundColor: vars.role.surface.highest,
    }
  }],
  primary: [baseButtonStyle, {
    borderRadius: vars.space.sm,
    padding: `${vars.space.sm} ${vars.space.md}`,
    boxShadow: vars.shadow.sm,

    backgroundColor: vars.role.primary.default,
    color: vars.role.primary.text,

    ':hover': {
      boxShadow: vars.shadow.md,
      backgroundColor: vars.role.primary.hover,
    }
  }],
  text: [baseButtonStyle, {
    color: vars.role.surface.text,
    backgroundColor: 'transparent',
    padding: `${vars.space.sm} ${vars.space.md}`,
    borderRadius: vars.space.sm,

    ':hover': {
      backgroundColor: alpha(vars.role.surface.text, 0.05),
    }
  }],
  icon: [baseButtonStyle, {
    backgroundColor: 'transparent',
    padding: vars.space.sm,
    borderRadius: vars.space.sm,

    ':hover': {
      backgroundColor: alpha(vars.role.surface.text, 0.05),
    }
  }],
});
