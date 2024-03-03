import { createSignal, onMount } from 'solid-js';

import useConfig from './useConfig';
import useThemeList from './useThemeList';

import { DEFAULT_CONFIG } from '../../common/constants';

const useCurrent = () => {
  const [config] = useConfig();
  const [themeList] = useThemeList();

  const [index, setIndex] = createSignal(window.index);

  const view = () => config()?.views[index() ?? -1];
  const themeName = () => view()?.theme ?? DEFAULT_CONFIG.views[0].theme;
  const theme = () => themeList()[themeName()];

  onMount(() => {
    const interval = setInterval(() => {
      if (typeof window.index === 'number') {
        setIndex(window.index);
        clearInterval(interval);
      }
    }, 100);
  });

  return {
    view,
    theme,
    themeName,
  } as const;
};

export default useCurrent;

declare global {
  interface Window {
    index?: number;
  }
}
