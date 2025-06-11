import { createSignal, onMount } from 'solid-js';

import { createIpcListener } from './createIpcListener';

import type { PartialDeep } from 'type-fest';
import type { StyleConfig, ThemeList } from '../../common/schema';

const useThemeList = () => {
  const [themeList, setThemeList] = createSignal<Required<ThemeList>>({});

  createIpcListener(
    () => 'theme-list',
    (_, data: ThemeList) => {
      setRequiredList(data);
    },
  );

  const setRequiredList = (data: ThemeList) => {
    const requiredData = Object.entries(data).reduce((prev, [key, value]) => {
      if (!value) return prev;

      return {
        ...prev,
        [key]: value,
      };
    }, {});

    setThemeList(requiredData);
  };

  onMount(async () => {
    const result = (await window.ipcRenderer.invoke(
      'get-theme-list',
    )) as Record<string, StyleConfig>;

    setRequiredList(result || {});
  });

  const setList = async (
    name: string,
    newTheme: PartialDeep<StyleConfig> | null,
    useFallback = true,
  ) => {
    await window.ipcRenderer.invoke('set-theme', name, newTheme, useFallback);
  };

  return [themeList, setList] as const;
};

export default useThemeList;
