import { createSignal } from 'solid-js';

import { Config } from '../../../../common/schema';
import { PartialDeep } from 'type-fest';

export const useConfig = () => {
  const [config, setConfig] = createSignal<Config | null>(window.ipcRenderer.sendSync('get-config') as Config);

  window.ipcRenderer.on('config', (_, data: Config) => {
    setConfig(data);
  });

  const setPublicConfig = async (newMapper: PartialDeep<Config>) => {
    console.log('setPublicConfig', newMapper);
    await window.ipcRenderer.invoke('set-config', newMapper);
  };

  return [config, setPublicConfig] as const;
};
