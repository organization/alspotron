import { createSignal } from 'solid-js';

import { StyleConfig } from '../../common/config';

const useThemeList = () => {
  const [themeList, setThemeList] = createSignal<Record<string, StyleConfig>>({});

  (async () => {
    const result = await window.ipcRenderer.invoke('get-theme-list') as Record<string, StyleConfig>;

    setThemeList(result || {});
  })();

  window.ipcRenderer.on('theme-list', (_, data: Record<string, StyleConfig>) => {
    setThemeList(data);
  });

  const setList = async (name: string, newTheme: DeepPartial<StyleConfig> | null, useFallback = true) => {
    await window.ipcRenderer.invoke('set-theme', name, newTheme, useFallback);
  };

  return [themeList, setList] as const;
};

export default useThemeList;
