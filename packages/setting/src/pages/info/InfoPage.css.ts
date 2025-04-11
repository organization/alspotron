import { vars } from '@alspotron/ui/css-runtime';

import { style } from '@vanilla-extract/css';

export const logoStyle = style({
  width: '9.6rem',
  height: '9.6rem',
});

export const profileStyle = style({
  width: '2.4rem',
  height: '2.4rem',
  borderRadius: '50%',
});

export const maintainerContainerStyle = style({
  overflow: 'auto',
  margin: `calc(-1 * ${vars.space.xl})`,
  padding: vars.space.xl,

  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});
