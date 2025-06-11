import { createSignal } from 'solid-js';

import { createIpcListener } from './createIpcListener';

import { GameList } from '../../common/schema';

const useGameList = () => {
  const [gameList, setGameList] = createSignal<GameList>({});

  (async () => {
    const result = await window.ipcRenderer.invoke('get-game-list');

    setGameList(result || {});
  })();

  createIpcListener(
    () => 'game-list',
    (_, data) => {
      setGameList(data as GameList);
    },
  );

  const setList = async (newMapper: Partial<GameList>, useFallback = true) => {
    await window.ipcRenderer.invoke('set-game-list', newMapper, useFallback);
  };

  return [gameList, setList] as const;
};

export default useGameList;
