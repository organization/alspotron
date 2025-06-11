import { createSignal } from 'solid-js';

import { createIpcListener } from './createIpcListener';

import type { PartialDeep } from 'type-fest';
import type { Config } from '../../common/schema';

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

  createIpcListener(
    () => 'config',
    (_, data) => {
      setConfig(data as Config);
    },
  );

  const setPublicConfig = async (newMapper: PartialDeep<Config>) => {
    await window.ipcRenderer.invoke('set-config', newMapper);
  };

  return [config, setPublicConfig] as const;
};

export default useConfig;
