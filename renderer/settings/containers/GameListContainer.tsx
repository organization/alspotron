import { createEffect, createSignal, For, JSX } from 'solid-js';
import { Trans } from '@jellybrick/solid-i18next';

import { t } from 'i18next';
import { useNavigate } from '@solidjs/router';

import useGameList from '../../hooks/useGameList';
import useConfig from '../../hooks/useConfig';

import GameCard from '../components/GameCard';
import Modal from '../../components/Modal';
import Card from '../../components/Card';

interface GameList {
  path: string;
  name: string;
  icon: string;
  theme: string;
}

const GameListContainer = () => {
  const navigate = useNavigate();
  const [gameList, setGameList] = useGameList();
  const [config] = useConfig();

  const [fileInput, setFileInput] = createSignal<HTMLInputElement | null>(null);
  const [availableGameList, setAvailableGameList] = createSignal<GameList[]>(
    [],
  );
  const [gameOpen, setGameOpen] = createSignal(false);
  const [target, setTarget] = createSignal<string | null>(null);
  const [file, setFile] = createSignal<File | null>(null);

  const updateAvailableGameList = async () => {
    const result: GameList[] = [];

    Object.entries(gameList()).forEach(([theme, value]) => {
      value.forEach(({ name, path }) => {
        result.push({
          path,
          name,
          icon: '',
          theme,
        });
      });
    });

    await Promise.all(
      result.map(async (data) => {
        data.icon = (await window.ipcRenderer.invoke(
          'get-icon',
          data.path,
        )) as string;
      }),
    );

    setAvailableGameList(result);
  };

  createEffect(() => {
    updateAvailableGameList();
  });

  const onRemoveGame = (path: string) => {
    const list = { ...gameList() };

    const key = Object.keys(list).find((key) =>
      list[key].some((it) => it.path === path),
    );
    if (!key) return;

    const index = list[key].findIndex((it) => it.path === path);
    if (index < 0) return;

    list[key].splice(index, 1);
    setGameList(list, false);
  };

  const onSelectGame: JSX.InputEventHandlerUnion<
    HTMLInputElement,
    InputEvent
  > = (event) => {
    if (!event.target.files) return;

    const file = event.target.files.item(0);
    const isEXE = file?.path && /\.(exe)$/i.test(file.path);
    if (!isEXE || !file) return;

    setFile(file);
    setTimeout(() => {
      setGameOpen(true);
    }, 0);
  };
  const onAddGame = (viewName: string) => {
    const data = file();

    if (!data) return;

    const list = { ...gameList() };
    if (!list[viewName]) {
      list[viewName] = [
        {
          name: data.name,
          path: data.path,
        },
      ];
    } else {
      list[viewName].push({
        name: data.name,
        path: data.path,
      });
    }

    setGameList(list, false);
    setFile(null);
    setGameOpen(false);
    const input = fileInput();
    if (input) input.value = '';
  };
  const onApplyTheme = (viewName: string) => {
    const path = target();
    if (!path) return;

    const list = { ...gameList() };
    const key = Object.keys(list).find((key) =>
      list[key].some((it) => it.path === path),
    );
    if (!key) return;

    const index = list[key].findIndex((it) => it.path === path);
    if (index < 0) return;

    const value = list[key][index];
    list[key].splice(index, 1);
    list[viewName] ??= [];
    list[viewName].push(value);

    setGameList(list, false);
    setTarget(null);
  };
  const onGamePage = () => {
    navigate('/game-overlay');
  };

  return (
    <div
      class={
        'flex-1 flex flex-col justify-start items-stretch gap-1 p-4 fluent-scrollbar'
      }
    >
      <div class={'text-3xl mb-1 flex justify-start items-center gap-2'}>
        <span
          class={'text-3xl opacity-80 hover:opacity-100 '}
          onClick={onGamePage}
        >
          <Trans key={'setting.title.game-overlay'} />
        </span>
        <svg
          class={'w-4 h-4'}
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.47 4.22a.75.75 0 0 0 0 1.06L15.19 12l-6.72 6.72a.75.75 0 1 0 1.06 1.06l7.25-7.25a.75.75 0 0 0 0-1.06L9.53 4.22a.75.75 0 0 0-1.06 0Z"
            class={'fill-black dark:fill-white'}
          />
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
          <GameCard icon={game.icon} name={game.name} path={game.path}>
            <button class={'btn-text'} onClick={() => setTarget(game.path)}>
              <div class={'flex flex-col justify-center items-center'}>
                <span class={'text-sm text-gray-400'}>적용된 테마</span>
                <span>{game.theme}</span>
              </div>
            </button>
            <button
              class={'btn-error h-full'}
              onClick={() => onRemoveGame(game.path)}
            >
              <Trans key={'setting.game.unregister-game'} />
            </button>
          </GameCard>
        )}
      </For>
      <label for={'game-selector'} class={'btn-primary text-center'}>
        <Trans key={'setting.game.registered-game-list.adding-manually'} />
        <input
          ref={setFileInput}
          id={'game-selector'}
          type={'file'}
          accept={'.exe'}
          class={'hidden'}
          onInput={onSelectGame}
        />
      </label>
      <Modal
        open={gameOpen()}
        onClose={() => setGameOpen(false)}
        class={'max-w-[500px]'}
      >
        <div class={'text-white text-xl mb-2'}>
          {t('setting.game.select-view-to-show-game-overlay')}
        </div>
        <For each={config()?.views}>
          {(view) => (
            <Card
              class={'flex flex-row justify-start items-center gap-4'}
              onClick={() => onAddGame(view.name)}
            >
              <div class={'w-6 h-6'} />
              <div class={'text-md'}>{view.name}</div>
              <div class={'flex-1'} />
            </Card>
          )}
        </For>
      </Modal>
      <Modal
        open={target() !== null}
        onClose={() => setTarget(null)}
        class={'max-w-[500px]'}
      >
        <div class={'text-white text-xl mb-2'}>
          {t('setting.game.select-view-to-show-game-overlay')}
        </div>
        <For each={config()?.views}>
          {(view) => (
            <Card
              class={'flex flex-row justify-start items-center gap-4'}
              onClick={() => onApplyTheme(view.name)}
            >
              <div class={'w-6 h-6'} />
              <div class={'text-md'}>{view.name}</div>
              <div class={'flex-1'} />
            </Card>
          )}
        </For>
      </Modal>
    </div>
  );
};

export default GameListContainer;
