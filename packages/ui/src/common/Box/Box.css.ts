import { recipe, RecipeVariants } from '@vanilla-extract/recipes';
import { createVar, fallbackVar, style } from '@vanilla-extract/css';

import { colors, map, vars, layered } from '../../theme';

export const width = createVar();
export const height = createVar();
export const fontSize = createVar();
export const boxSizeStyle = style({
  width: fallbackVar(width, 'auto'),
  height: fallbackVar(height, 'auto'),
  fontSize: fallbackVar(fontSize, 'auto'),
});
export const boxStyle = recipe({
  base: {
    display: 'flex',
  },

  variants: {
    // layout
    direction: {
      row: layered({ flexDirection: 'row' }),
      column: layered({ flexDirection: 'column' }),
    },
    justify: {
      'flex-start': layered({ justifyContent: 'flex-start' }),
      'flex-end': layered({ justifyContent: 'flex-end' }),
      'center': layered({ justifyContent: 'center' }),
      'space-between': layered({ justifyContent: 'space-between' }),
      'space-around': layered({ justifyContent: 'space-around' }),
      'space-evenly': layered({ justifyContent: 'space-evenly' }),
    },
    align: {
      'flex-start': layered({ alignItems: 'flex-start' }),
      'flex-end': layered({ alignItems: 'flex-end' }),
      'center': layered({ alignItems: 'center' }),
      'baseline': layered({ alignItems: 'baseline' }),
      'stretch': layered({ alignItems: 'stretch' }),
    },
    wrap: {
      nowrap: layered({ flexWrap: 'nowrap' }),
      wrap: layered({ flexWrap: 'wrap' }),
      'wrap-reverse': layered({ flexWrap: 'wrap-reverse' }),
    },
    gap: map(vars.space, (gap) => layered({ gap })),

    // spaces
    p: map(vars.space, (padding) => layered({ padding })),
    px: map(vars.space, (paddingX) => layered({ paddingLeft: paddingX, paddingRight: paddingX })),
    py: map(vars.space, (paddingY) => layered({ paddingTop: paddingY, paddingBottom: paddingY })),
    m: map(vars.space, (margin) => layered({ margin })),
    mx: map(vars.space, (marginX) => layered({ marginLeft: marginX, marginRight: marginX })),
    my: map(vars.space, (marginY) => layered({ marginTop: marginY, marginBottom: marginY })),
    r: map(vars.space, (borderRadius) => layered({ borderRadius })),

    // colors
    bg: map(colors, (background) => layered({ background })),
    c: map(colors, (color) => layered({ color })),
    bc: map(colors, (borderColor) => layered({ borderColor })),
    shadow: map(vars.shadow, (boxShadow) => layered({ boxShadow })),

    // layout
    bd: map(vars.line, (borderWidth) => layered({
      borderWidth,
      borderStyle: 'solid'
    })),
  },

  defaultVariants: {
    direction: 'column',
  },
});

export type BoxStyleType = RecipeVariants<typeof boxStyle>;
