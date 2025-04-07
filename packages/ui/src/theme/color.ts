import { vars } from './vars.css';

type ColorTheme = typeof vars.color;
type ColorName = keyof ColorTheme;
type ColorShades = keyof ColorTheme[keyof ColorTheme];
type CSSVarFunction = `var(--${string})` | `var(--${string}, ${string | number})`;
export type ColorMapKey = `${ColorName}.${ColorShades}`;
export type ColorMap = {
  [Key in ColorMapKey]: CSSVarFunction;
}

export const colors = (
  Object.entries(vars.color)
    .flatMap(([path, palette]) => Object.entries(palette)
      .map(([key, value]) => ({
        [`${path}.${key}`]: value
      }))
    )
    .reduce((acc, curr) => ({ ...acc, ...curr }), {})
) as ColorMap;
