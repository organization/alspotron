import { createMemo, createSignal, getOwner, runWithOwner } from 'solid-js';

import { createIpcListener } from './createIpcListener';

const usePlayingGame = () => {
  const [gameList, setGameList] = createSignal<number[]>([]);

  const owner = getOwner();
  (async () => {
    const result = await window.ipcRenderer.invoke(
      'get-registered-process-list',
    );

    runWithOwner(owner, () => {
      setGameList(result.map((it) => it.pid) || []);
    });
  })();

  createIpcListener(
    () => 'registered-process-list',
    (_, data: number[]) => {
      setGameList(data);
    },
  );

  const playingList = () => {
    const processList = gameList();

    const allProcessList = window.hmc.getDetailsProcessList();

    return allProcessList.filter((process) =>
      processList.some((it) => Number(it) === Number(process.pid)),
    );
  };

  return playingList;
};

export default usePlayingGame;
