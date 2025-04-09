import { createVar, fallbackVar, style, styleVariants } from '@vanilla-extract/css';

import { popoverAnimation } from './animation';

export const x = createVar();
export const y = createVar();
export const maxWidth = createVar();
export const maxHeight = createVar();
export const popoverStyle = style({
  position: 'absolute',
  top: fallbackVar(y, '0'),
  left: fallbackVar(x, '0'),

  display: 'flex',
  flexDirection: 'column',

  maxWidth: maxWidth,
  maxHeight: maxHeight,
  height: '100%',

  overflow: 'visible',
});
export const popoverXAlignStyle = styleVariants({
  0: {
    alignItems: 'flex-start',
  },
  0.5: {
    alignItems: 'center',
  },
  1: {
    alignItems: 'flex-end',
  },
});
export const popoverYAlignStyle = styleVariants({
  0: {
    justifyContent: 'flex-start',
  },
  0.5: {
    justifyContent: 'center',
  },
  1: {
    justifyContent: 'flex-end',
  },
});

export const placementX = createVar();
export const placementY = createVar();
export const animationStyle = style({
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  maxHeight: '100%',
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
