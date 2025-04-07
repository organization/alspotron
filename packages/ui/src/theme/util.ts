import { ComplexStyleRule } from '@vanilla-extract/css';

import { l1Layer } from './layer.css';

export const map = <T extends Record<PropertyKey, unknown>, K>(
  record: T,
  map: (value: T[keyof T], key: keyof T) => K
): Record<keyof T, K> => {
  return Object.entries(record)
    .map(([key, value]) => ({
      [key]: map(value as T[keyof T], key)
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {}) as Record<keyof T, K>;
};

export const variant = <T extends string[]>(
  ...values: T
): { [Key in T[number]]: string } => values.reduce((acc, value) => ({
  ...acc,
  [value]: value
}), {} as { [Key in T[number]]: string });

export const alpha = (color: string, alpha: number): string => {
  // TODO: disable until farmfe support relative color syntax
  return color;
  // return `oklch(from ${color} l c h / ${alpha})`;
};

export const layered = (
  rules: ComplexStyleRule,
  layer = l1Layer,
) => {
  return {
    '@layer': {
      [layer]: rules,
    },
  } as ComplexStyleRule;
};