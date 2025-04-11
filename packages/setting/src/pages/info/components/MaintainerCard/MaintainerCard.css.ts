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
  width: '100%',
  height: '100%',
  minWidth: '2.4rem',
  minHeight: '2.4rem',
  maxWidth: '7.2rem',
  maxHeight: '7.2rem',

  aspectRatio: '1 / 1',
  borderRadius: '50%',
});

export const buttonStyle = style({
  position: 'absolute',
  top: vars.space.md,
  right: vars.space.md,
});
