import { createSignal } from 'solid-js';

const useServer = () => {
  const [state, setState] = createSignal<'connected' | 'disconnected'>('disconnected');

  (async () => {
    setState(await window.ipcRenderer.invoke('server-state'));
  })();

  window.ipcRenderer.on('server-state', (_, state) => {
    if (state === 'connected') {
      setState('connected');
    } else {
      setState('disconnected');
    }
  });

  const restart = async () => {
    await window.ipcRenderer.invoke('restart-server');
  };

  return [state, restart] as const;
};

export default useServer;
