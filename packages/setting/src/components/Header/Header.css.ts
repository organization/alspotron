import { style } from '@vanilla-extract/css';
import { vars } from '@alspotron/ui/css-runtime';

export const containerStyle = style({
  width: '100%',

  marginTop: '38px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: vars.space.sm,

  // marginLeft: '76px', // only in macOS

  WebkitUserSelect: 'none',
  // @ts-ignore: electron only rule
  WebkitAppRegion: 'drag',
});

export const logoStyle = style({
  width: '1.2rem',
  height: '1.2rem',

  userSelect: 'none',
});

export const titleStyle = style({
  userSelect: 'none',
  flex: 1,
});
