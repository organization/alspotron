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
    backgroundColor: 'transparent',
    color: 'inherit',

    borderStyle: 'solid',
    borderWidth: vars.line.md,
    borderColor: vars.color.gray[200],
    borderRadius: vars.space.sm,
    padding: `${vars.space.sm} ${vars.space.md}`,
    boxShadow: vars.shadow.xs,

    ':hover': {
      backgroundColor: alpha(vars.color.gray[900], 0.025),
    },
    ':active': {
      backgroundColor: vars.color.gray[200],
    }
  }],
  primary: [baseButtonStyle, {
    borderRadius: vars.space.sm,
    padding: `${vars.space.sm} ${vars.space.md}`,
    boxShadow: vars.shadow.sm,

    backgroundColor: vars.color.blue[500],
    color: vars.color.gray[50],

    ':hover': {
      boxShadow: vars.shadow.md,
      backgroundColor: vars.color.blue[600],
    }
  }],
  text: [baseButtonStyle, {
    backgroundColor: 'transparent',
    padding: `${vars.space.sm} ${vars.space.md}`,
    borderRadius: vars.space.sm,

    ':hover': {
      backgroundColor: alpha(vars.color.gray[900], 0.05),
    }
  }],
  icon: [baseButtonStyle, {
    backgroundColor: 'transparent',
    padding: vars.space.sm,
    borderRadius: vars.space.sm,

    ':hover': {
      backgroundColor: alpha(vars.color.gray[900], 0.05),
    }
  }],
});
