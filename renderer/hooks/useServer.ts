import { createSignal } from 'solid-js';

const useServer = () => {
  const [state, setState] = createSignal<'start' | 'close'>('start');

  (async () => {
    setState(await window.ipcRenderer.invoke('get-current-source-provider-state'));
  })();

  window.ipcRenderer.on('current-source-provider-state', (_, state: 'start' | 'close' | 'error') => {
    console.log('current-source-provider-state', state);
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
