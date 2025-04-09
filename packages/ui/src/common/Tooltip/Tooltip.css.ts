import { style } from '@vanilla-extract/css';

import { vars } from '../../theme';

export const containerStyle = style({
  color: vars.role.surface.text,
  backgroundColor: vars.role.surface.default,

  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.space.xs,
  fontSize: '1.2rem',
});
