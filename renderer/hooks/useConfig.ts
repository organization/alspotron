import { createSignal } from 'solid-js';

import type { PartialDeep } from 'type-fest';
import type { Config } from '../../common/types';

const useConfig = () => {
  const [config, setConfig] = createSignal<Config | null>(null);

  (() => {
    if (config()) {
      return;
    } else {
      const result = window.ipcRenderer.sendSync('get-config') as Config;
      setConfig(result);
    }
  })();

  window.ipcRenderer.on('config', (_, data: Config) => {
    setConfig(data);
  });

  const setPublicConfig = async (newMapper: PartialDeep<Config>) => {
    await window.ipcRenderer.invoke('set-config', newMapper);
  };

  return [config, setPublicConfig] as const;
};

export default useConfig;
