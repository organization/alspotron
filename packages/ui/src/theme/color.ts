import { vars } from './vars.css';

type CSSVarFunction = `var(--${string})` | `var(--${string}, ${string | number})`;

type ColorTheme = typeof vars.color;
type ColorName = keyof ColorTheme;
type ColorShades = keyof ColorTheme[keyof ColorTheme];
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

type RoleTheme = typeof vars.role;
type RoleName = keyof RoleTheme;
type RoleMapKey = {
  [Key in RoleName]: `${Key}.${keyof RoleTheme[Key] extends string ? `${keyof RoleTheme[Key]}` : never}`
}[RoleName];
export type RoleMap = {
  [Key in RoleMapKey]: CSSVarFunction;
}
export const roles = (
  Object.entries(vars.role)
    .flatMap(([path, palette]) => Object.entries(palette)
      .map(([key, value]) => ({
        [`${path}.${key}`]: value
      }))
    )
    .reduce((acc, curr) => ({ ...acc, ...curr }), {})
) as RoleMap;

