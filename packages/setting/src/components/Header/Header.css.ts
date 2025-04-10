import { style } from '@vanilla-extract/css';
import { alpha, vars } from '@alspotron/ui/css-runtime';

export const containerStyle = style({
  position: 'relative',

  width: '100%',
  height: '3.6rem',

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: vars.space.xs,

  WebkitUserSelect: 'none',
  // @ts-ignore: electron only rule
  WebkitAppRegion: 'drag',
});

export const titleContainerStyle = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});

export const logoStyle = style({
  width: '1.2rem',
  height: '1.2rem',

  userSelect: 'none',
});

export const titleStyle = style({
  userSelect: 'none',
});

export const buttonStyle = style({
  // @ts-ignore: electron only rule
  WebkitAppRegion: 'no-drag',
});

export const closeButtonStyle = style({
  selectors: {
    '&:hover': {
      backgroundColor: `${alpha(vars.color.red[500], 0.2)} !important`,
    },
  },
});
