import { createSignal } from 'solid-js';

import type { PartialDeep } from 'type-fest';
import { Config } from '../../../../common/schema';

export const useConfig = () => {
  const [config, setConfig] = createSignal<Config | null>(window.ipcRenderer.sendSync('get-config') as Config);

  window.ipcRenderer.on('config', (_, data: Config) => {
    setConfig(data);
  });

  const setPublicConfig = async (newMapper: PartialDeep<Config>) => {
    await window.ipcRenderer.invoke('set-config', newMapper);
  };

  return [config, setPublicConfig] as const;
};
