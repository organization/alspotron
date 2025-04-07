import { createEffect, createSignal } from 'solid-js';
import { createMediaQuery } from '@solid-primitives/media';
import { JSX } from 'solid-js/jsx-runtime';

import { darkThemeClass } from './dark.css';
import { lightThemeClass } from './light.css';

export const [themeMode, setThemeMode] = createSignal<'system' | 'light' | 'dark'>('system');

export type ThemeProviderProps = {
  children: JSX.Element;
};
export const ThemeProvider = (props: ThemeProviderProps) => {
  document.body.classList.add(lightThemeClass);

  const matches = createMediaQuery('(prefers-color-scheme: dark)');

  const saved = localStorage.getItem('theme') ?? 'system';
  if (['system', 'light', 'dark'].includes(saved)) {
    setThemeMode(saved as 'system' | 'light' | 'dark');
  }

  createEffect(() => {
    if (themeMode() === 'system') {
      if (matches()) {
        document.body.classList.remove(lightThemeClass);
        document.body.classList.add(darkThemeClass);
      } else {
        document.body.classList.remove(darkThemeClass);
        document.body.classList.add(lightThemeClass);
      }
    } else {
      if (themeMode() === 'dark') {
        document.body.classList.remove(lightThemeClass);
        document.body.classList.add(darkThemeClass);
      }
      if (themeMode() === 'light') {
        document.body.classList.remove(darkThemeClass);
        document.body.classList.add(lightThemeClass);
      }
    }

    localStorage.setItem('theme', themeMode());
  });

  return props.children;
};
