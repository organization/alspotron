import { vars } from '@alspotron/ui/css-runtime';
import { style } from '@vanilla-extract/css';

export const cardStyle = style({
  position: 'relative',
  flex: '1',
  aspectRatio: '1 / 1',

  selectors: {
    '&::after': {
      // content: '""',
      padding: vars.space.md,
    },
  },
});

export const profileStyle = style({
  width: '7.2rem',
  height: '7.2rem',
  borderRadius: '50%',
});

export const buttonStyle = style({
  position: 'absolute',
  top: vars.space.md,
  right: vars.space.md,
});
