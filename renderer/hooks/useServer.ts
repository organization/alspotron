import { createSignal } from 'solid-js';

const useServer = () => {
  const [state, setState] = createSignal<'start' | 'close'>('start');

  (async () => {
    setState(await window.ipcRenderer.invoke('source-provider-state'));
  })();

  window.ipcRenderer.on('source-provider-state', (_, state: 'start' | 'close' | 'error') => {
    if (state === 'start') {
      setState('start');
    } else {
      setState('close');
    }
  });

  const restart = async () => {
    await window.ipcRenderer.invoke('restart-source-provider');
  };

  return [state, restart] as const;
};

export default useServer;
