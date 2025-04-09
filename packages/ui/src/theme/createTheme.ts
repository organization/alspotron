import { createTheme as createBaseTheme } from '@vanilla-extract/css';
import { PartialDeep } from 'type-fest';
import { deepmerge } from 'deepmerge-ts';

import { defaultLightTheme, defaultDarkTheme, vars } from './vars.css';

type Map<Obj, Value> = {
  [Key in keyof Obj]: Obj[Key] extends Record<string, unknown> ? Map<Obj[Key], Value> : Value;
};
type ThemeVariableMap = PartialDeep<Map<typeof vars, string>>;
type CreateThemeOptions = {
  dark?: ThemeVariableMap;
  light?: ThemeVariableMap;
}
export const createTheme = (theme: CreateThemeOptions) => {
  const light = createBaseTheme(vars, deepmerge(defaultLightTheme, theme.light ?? {}));
  const dark = createBaseTheme(vars, deepmerge(defaultDarkTheme, theme.dark ?? {}));

  return { light, dark };
};
