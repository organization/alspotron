import { createSignal } from 'solid-js';

import { createIpcListener } from './createIpcListener';

const useServer = () => {
  const [state, setState] = createSignal<'start' | 'close'>('start');

  (async () => {
    setState(
      await window.ipcRenderer.invoke('get-current-source-provider-state'),
    );
  })();

  createIpcListener(
    () => 'current-source-provider-state',
    (_, state: 'start' | 'close' | 'error') => {
      if (state === 'start') setState('start');
      else setState('close');
    },
  );

  const restart = async () => {
    await window.ipcRenderer.invoke('restart-source-provider');
  };

  return [state, restart] as const;
};

export default useServer;
