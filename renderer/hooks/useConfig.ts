import { createSignal } from 'solid-js';

import { Config } from '../../src/config';

const useConfig = () => {
  const [config, setConfig] = createSignal<Config | null>(null);

  (async () => {
    if (config()) return;

    const result = await window.ipcRenderer.invoke('get-config') as Config;

    setConfig(result);
  })();

  window.ipcRenderer.on('config', (_, data: Config) => {
    setConfig(data);
  });

  const setPublicConfig = async (newMapper: DeepPartial<Config>) => {
    await window.ipcRenderer.invoke('set-config', newMapper);
  };

  return [config, setPublicConfig] as const;
};

export default useConfig;
