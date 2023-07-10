import { createMemo, createSignal } from 'solid-js';

const usePlayingGame = () => {
  const [gameList, setGameList] = createSignal<number[]>([]);

  void (async () => {
    const result = await window.ipcRenderer.invoke('get-registered-process-list');

    setGameList(result || []);
  })();

  window.ipcRenderer.on('registered-process-list', (_, data: number[]) => {
    setGameList(data);
  });

  return createMemo(() => {
    const processList = gameList();

    const allProcessList = window.hmc.getProcessList();

    return allProcessList.filter((process) => processList.some((it) => Number(it) === Number(process.pid)));
  });
};

export default usePlayingGame;
