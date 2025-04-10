import { vars } from '@alspotron/ui/css-runtime';
import { style } from '@vanilla-extract/css';

export const logoStyle = style({
  width: '1.6rem',
  height: '1.6rem',
  // margin: '0.2rem',

  userSelect: 'none',
});

export const containerStyle = style({
  width: '100%',
  height: '100%',

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'stretch',

  padding: vars.space.xs,
  paddingTop: 0,
  paddingLeft: 0,
});
