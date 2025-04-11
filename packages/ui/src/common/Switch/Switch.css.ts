import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../theme';

const baseContainerStyle = style({
  width: '4.2rem',
  height: '2.4rem',

  padding: vars.space.xs,
  borderRadius: '2.4rem',

  cursor: 'pointer',
  transition: 'box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
});

export const containerStyle = styleVariants({
  on: [baseContainerStyle, {
    boxShadow: `0 0 0 1.2rem ${vars.role.surface.highest} inset`,
  }],
  off: [baseContainerStyle, {
    boxShadow: `0 0 0 ${vars.line.md} ${vars.role.surface.highest} inset`,
  }],
});

export const inputStyle = style({
  display: 'none',
});

const baseThumbStyle = style({
  width: '1.6rem',
  height: '1.6rem',
  borderRadius: '1.6rem',

  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
});
export const thumbStyle = styleVariants({
  on: [baseThumbStyle, {
    backgroundColor: vars.role.primary.default,
    translate: '1.6rem 0',

  }],
  off: [baseThumbStyle, {
    scale: '0.9',
    backgroundColor: vars.role.surface.highest,
  }],
});