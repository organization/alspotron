import type { JSX } from 'solid-js/jsx-runtime';

export const cl = (obj?: Record<string, boolean | undefined>): string => {
  if (!obj) return '';

  const result: string[] = [];

  Object.entries(obj).forEach(([className, value]) => {
    if (value) result.push(className);
  });

  return result.join(' ');
};

export const cx = (...classNames: unknown[]): string => classNames.filter(Boolean).join(' ');
export const sx = <Element extends HTMLElement>(
  ...styles: JSX.HTMLAttributes<Element>['style'][]
): string => {
  let result: string[] = [];

  styles.forEach((style) => {
    if (!style) return;

    if (typeof style === 'string') {
      result.push(style);
    } else if (Array.isArray(style)) {
      result.push(sx(...style));
    } else if (typeof style === 'object') {
      Object.keys(style).forEach((key) => {
        result.push(`${key}: ${style[key as keyof typeof style]}`);
      });
    }
  });

  return result.map((it) => it[it.length - 1] === ';' ? it.trim() : `${it.trim()};`).join('\n');
};
