import { createVar, fallbackVar, style } from '@vanilla-extract/css';

import { popoverAnimation } from './animation';

export const x = createVar();
export const y = createVar();
export const maxWidth = createVar();
export const maxHeight = createVar();
export const popoverStyle = style({
  position: 'absolute',
  top: fallbackVar(y, '0'),
  left: fallbackVar(x, '0'),

  maxWidth: maxWidth,
  maxHeight: maxHeight,

  overflow: 'visible',
});

export const placementX = createVar();
export const placementY = createVar();
export const animationStyle = style({
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  maxHeight: '100%',

  transition: '0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  transformOrigin: `calc(100% * ${fallbackVar(placementX, '0')}) calc(100% * ${fallbackVar(placementY, '0')})`,
});

export const defaultAnimation = popoverAnimation({
  enter: {
    opacity: '0',
    transform: `scale(0.9)`,

  },
  exit: {
    opacity: '0',
    transform: `scale(0.9)`,
  },
});
