import { style, styleVariants } from '@vanilla-extract/css';

import { vars } from '../../theme';

export const buttonStyle = style({
  minWidth: '20rem',

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: vars.space.md,


});
export const textStyle = styleVariants({
  default: {
    fontSize: '1.4rem',
  },
  placeholder: {
    fontSize: '1.4rem',
    color: vars.role.text.caption,
  },
  group: {
    fontSize: '1.2rem',
    color: vars.role.text.caption,
  }
});
export const inputStyle = style({
  display: 'none',
});
