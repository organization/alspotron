import { createEffect, createSignal } from 'solid-js';
import { createMediaQuery } from '@solid-primitives/media';
import { JSX } from 'solid-js/jsx-runtime';

import { lightThemeClass, darkThemeClass } from './vars.css';

const [isDarkTheme, setIsDarkTheme] = createSignal(false);
export const [themeMode, setThemeMode] = createSignal<'system' | 'light' | 'dark'>('system');

export type ThemeProviderProps = {
  light?: string;
  dark?: string;
  children: JSX.Element;
};
export const ThemeProvider = (props: ThemeProviderProps) => {
  const matches = createMediaQuery('(prefers-color-scheme: dark)');

  const saved = localStorage.getItem('theme') ?? 'system';
  if (['system', 'light', 'dark'].includes(saved)) {
    setThemeMode(saved as 'system' | 'light' | 'dark');
  }

  const light = () => props.light ?? lightThemeClass;
  const dark = () => props.dark ?? darkThemeClass;

  createEffect(() => {
    if (themeMode() === 'system') {
      if (matches()) {
        document.body.classList.remove(light());
        document.body.classList.add(dark());
        setIsDarkTheme(true);
      } else {
        document.body.classList.remove(dark());
        document.body.classList.add(light());
        setIsDarkTheme(false);
      }
    } else {
      if (themeMode() === 'dark') {
        document.body.classList.remove(light());
        document.body.classList.add(dark());
        setIsDarkTheme(true);
      }
      if (themeMode() === 'light') {
        document.body.classList.remove(dark());
        document.body.classList.add(light());
        setIsDarkTheme(false);
      }
    }

    localStorage.setItem('theme', themeMode());
  });

  return props.children;
};

export {
  isDarkTheme,
};
