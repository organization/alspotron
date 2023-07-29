import { For, JSX, Show, createEffect, createSignal } from 'solid-js';
import { Trans } from '@jellybrick/solid-i18next';

import Card from '../../components/Card';
import Marquee from '../../components/Marquee';
import useGameList from '../../hooks/useGameList';

export interface GameListContainerProps {
  onBack?: () => void;
}

interface GameList {
  path: string;
  name: string;
  icon: string;
}

const GameListContainer = (props: GameListContainerProps) => {
  const [availableGameList, setAvailableGameList] = createSignal<GameList[]>([]);
  const [gameList, setGameList] = useGameList();

  const updateAvailableGameList = async () => {
    const gamePathList = Object.entries(gameList())
      .map(([path, name]) => ({ path, name }));

    const result = await Promise.all(
      gamePathList.map(async (data) => {
        const icon = await window.ipcRenderer.invoke('get-icon', data.path) as string;
        return { ...data, icon } as GameList;
      }),
    );

    setAvailableGameList(result);
  };

  createEffect(() => {
    updateAvailableGameList();
  });

  const onRemoveGame = (path: string) => {
    const list = { ...gameList() };
    delete list[path];

    setGameList(list, false);
  };

  const onSelectGame: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> = (event) => {
    if (!event.target.files) return;

    const file = event.target.files.item(0);
    const isEXE = file?.path && /\.(exe)$/i.test(file.path);
    if (!isEXE || !file) return;

    setGameList({
      [file.path]: file.name,
    });
  };

  return (
    <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 p-4 fluent-scrollbar'}>
      <div class={'text-3xl mb-1 flex justify-start items-center gap-2'}>
        <span class={'text-3xl opacity-80 hover:opacity-100 '} onClick={() => props.onBack?.()}>
          <Trans key={'setting.title.game-overlay'} />
        </span>
        <svg class={'w-4 h-4'} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.47 4.22a.75.75 0 0 0 0 1.06L15.19 12l-6.72 6.72a.75.75 0 1 0 1.06 1.06l7.25-7.25a.75.75 0 0 0 0-1.06L9.53 4.22a.75.75 0 0 0-1.06 0Z" class={'fill-white'} />
        </svg>
        <span class={'text-3xl'}>
          <Trans key={'setting.game.list-of-registered-games'} />
        </span>
      </div>
      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.game.registered-game-list.description'} />
      </div>
      <For each={availableGameList()}>
        {(game) => (
          <Card class={'w-full flex justify-start items-center gap-4'}>
            <Show when={!!game.icon} fallback={<div class={'w-6 h-6 aspect-square'} />}>
              <img src={game.icon} class={'w-6 h-6 object-cover'} alt={'Game Icon'}/>
            </Show>
            <div class={'w-0 flex flex-col justify-center items-stretch flex-1'}>
              <div class={'w-full'}>
                {game.name}
              </div>
              <Marquee class={'text-sm text-gray-400'} gap={18}>
                {game.path}
              </Marquee>
            </div>
            <button class={'btn-text'} onClick={() => onRemoveGame(game.path)}>
              <Trans key={'setting.game.unregister-game'} />
            </button>
          </Card>
        )}
      </For>
      <label for={'game-selector'} class={'btn-primary text-center'}>
        <Trans key={'setting.game.registered-game-list.adding-manually'} />
        <input
          id={'game-selector'}
          type={'file'}
          accept={'.exe'}
          class={'hidden'}
          onInput={onSelectGame}
        />
      </label>
    </div>
  );
};

export default GameListContainer;
