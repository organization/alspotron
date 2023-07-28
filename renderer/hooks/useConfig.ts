import { createSignal, onMount } from 'solid-js';

import { Config } from '../../src/config';

const useConfig = () => {
  const [config, setConfig] = createSignal<Config | null>(null);

  onMount(() => {
    if (config()) return;

    const result = window.ipcRenderer.sendSync('get-config') as Config;

    setConfig(result);
  });

  window.ipcRenderer.on('config', (_, data: Config) => {
    setConfig(data);
  });

  const setPublicConfig = async (newMapper: DeepPartial<Config>) => {
    await window.ipcRenderer.invoke('set-config', newMapper);
  };

  return [config, setPublicConfig] as const;
};

export default useConfig;
