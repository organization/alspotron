import { createVar, fallbackVar, style } from '@vanilla-extract/css';

export const fill = createVar();
export const weight = createVar();
export const grade = createVar();
export const opticalSize = createVar();
export const iconStyle = style({
  userSelect: 'none',
  fontVariationSettings: [
    `'FILL' ${fallbackVar(fill, '0')}`,
    `'wght' ${fallbackVar(weight, '400')}`,
    `'GRAD' ${fallbackVar(grade, '0')}`,
    `'opsz' ${fallbackVar(opticalSize, '24')}`
  ].join(', ')
});
