import { createSignal } from 'solid-js';

import { GameList } from '../../src/config';

const useGameList = () => {
  const [gameList, setGameList] = createSignal<GameList>({});

  (async () => {
    const result = await window.ipcRenderer.invoke('get-game-list') as GameList;

    setGameList(result || {});
  })();

  window.ipcRenderer.on('game-list', (_, data: GameList) => {
    setGameList(data);
  });

  const setList = async (newMapper: Partial<GameList>, useFallback = true) => {
    await window.ipcRenderer.invoke('set-game-list', newMapper, useFallback);
  };

  return [gameList, setList] as const;
};

export default useGameList;
