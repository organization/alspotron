import { style } from '@vanilla-extract/css';

import { vars } from '@alspotron/ui/css-runtime';

export const toolContainerStyle = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const toolStyle = style({
  flex: 1,
  flexShrink: 0,
  whiteSpace: 'nowrap',
});
