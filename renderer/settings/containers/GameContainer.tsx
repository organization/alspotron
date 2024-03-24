import { createEffect, createSignal, For, Show } from 'solid-js';
import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { Marquee } from '@suyongs/solid-utility';

import { useNavigate } from '@solidjs/router';

import Card from '../../components/Card';
import useGameList from '../../hooks/useGameList';
import usePlayingGame from '../../hooks/usePlayingGame';
import GameCard from '../components/GameCard';
import Modal from '../../components/Modal';
import useConfig from '../../hooks/useConfig';
import { t } from 'i18next';

interface ProcessData {
  name: string;
  pid: number;
  path: string;
  title?: string;
  icon?: string;
}

const GameContainer = () => {
  const [showOnlyAvailable, setShowOnlyAvailable] = createSignal(true);
  const [processList, setProcessList] = createSignal<ProcessData[]>([]);
  const [target, setTarget] = createSignal<ProcessData | null>(null);

  const navigate = useNavigate();
  const [gameList, setGameList] = useGameList();
  const playingGame = usePlayingGame();
  const [t] = useTransContext();
  const [config] = useConfig();

  const gameCount = () => Object.values(gameList()).flat().length;

  createEffect(() => {
    updateProcessList(showOnlyAvailable());
  });

  const updateProcessList = async (isAvailable = true) => {
    const availableWindows = window.hmc.getAllWindowsHandle(true);
    const availableWindowsPID = availableWindows.map((it) => window.hmc.getHandleProcessID(it));

    const result = await Promise.all(
      window.hmc.getDetailsProcessList()
        .filter((process) => !isAvailable || availableWindowsPID.includes(process.pid))
        .map(async (data) => {
          if (data.path.toLowerCase().startsWith(window.systemRoot.toLowerCase())) return null;
          const icon = await window.ipcRenderer.invoke('get-icon', data.path) as string;

          return { ...data, icon } as ProcessData;
        }),
    );

    setProcessList(result.filter(Boolean));
  };
  updateProcessList();

  const onAddGame = async (viewName: string) => {
    const data = target();
    if (!data) return;

    const list = { ...gameList() };
    if (!list[viewName]) {
      list[viewName] = [{
        name: data.name,
        path: data.path,
      }];
    } else {
      list[viewName].push({
        name: data.name,
        path: data.path,
      });
    }

    await setGameList(list, false);
    setTarget(null);
    window.ipcRenderer.invoke('inject-overlay-to-process', data.pid, data.name, data.path);
  };
  const onRemoveGame = (path: string) => {
    const list = { ...gameList() };

    const key = Object.keys(list).find((key) => list[key].some((it) => it.path === path));
    if (!key) return;

    const index = list[key].findIndex((it) => it.path === path);
    if (index < 0) return;

    list[key].splice(index, 1);
    setGameList(list, false);
  };
  const onGameListPage = () => {
    navigate('/game-overlay/list');
  };

  return (
    <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 p-4 fluent-scrollbar'}>
      <div class={'text-3xl mb-1'}>
        <Trans key={'setting.title.game-overlay'}/>
      </div>
      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.game.current-playing-game'}/>
      </div>
      <For each={playingGame()}>
        {(game) => (
          <Card class={'w-full flex justify-start items-center gap-4'}>
            <div class={'w-0 flex flex-col justify-center items-stretch flex-1'}>
              <div class={'w-full'}>
                {game.name}
              </div>
              <Marquee class={'text-sm text-gray-400'} gap={18}>
                {game.path}
              </Marquee>
            </div>
          </Card>
        )}
      </For>
      <Show when={playingGame().length === 0}>
        <Card class={'w-full flex justify-start items-center gap-4'}>
          <Trans key={'setting.game.not-detected'}/>
        </Card>
      </Show>
      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.game.list-of-registered-games'}/>
      </div>
      <Card class={'w-full flex justify-start items-center gap-4'} onClick={onGameListPage}>
        <div class={'w-0 flex flex-col justify-center items-start flex-1'}>
          <div class={'w-full'}>
            <Trans key={'setting.game.registered-games'}/>
          </div>
          <div class={'text-sm text-gray-400'}>
            <Trans key={'setting.game.registered-games-count'}
                   options={{ count: gameCount() }}/>
          </div>
        </div>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.47 4.22a.75.75 0 0 0 0 1.06L15.19 12l-6.72 6.72a.75.75 0 1 0 1.06 1.06l7.25-7.25a.75.75 0 0 0 0-1.06L9.53 4.22a.75.75 0 0 0-1.06 0Z"
            class={'fill-black dark:fill-white'}/>
        </svg>
      </Card>
      <div class={'flex mt-4 mb-1 gap-1'}>
        <span class={'text-md'}>
          <Trans key={'setting.game.search-game'}/>
        </span>
        <button class={'hover:!bg-white/[7.5%] rounded'} onClick={() => updateProcessList()}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
              class={'fill-black dark:fill-white'}/>
          </svg>
        </button>
      </div>

      <For each={processList()}>
        {(process) => (
          <GameCard
            icon={process.icon}
            name={process.name}
            path={process.path}
          >
            <Show
              when={gameList()[process.path]}
              fallback={(
                <button class={'btn-primary'} onClick={() => setTarget(process)}>
                  <Trans key={'setting.game.register-game'}/>
                </button>
              )}
            >
              <button class={'btn-text'} onClick={() => onRemoveGame(process.path)}>
                <Trans key={'setting.game.unregister-game'}/>
              </button>
            </Show>
          </GameCard>
        )}
      </For>
      <button
        class={'btn-text flex justify-center items-center gap-1'}
        onClick={() => setShowOnlyAvailable(!showOnlyAvailable())}
      >
        <svg
          class={'w-4 h-4'}
          classList={{
            'rotate-180': !showOnlyAvailable(),
          }}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.22 8.47a.75.75 0 0 1 1.06 0L12 15.19l6.72-6.72a.75.75 0 1 1 1.06 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L4.22 9.53a.75.75 0 0 1 0-1.06Z"
            class={'fill-black dark:fill-white'}/>
        </svg>
        {
          showOnlyAvailable() ?
            t('setting.game.show-all-programs-running-in-the-background') :
            t('setting.game.show-only-programs-running-in-the-foreground')
        }
      </button>
      <Modal
        open={!!target()}
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
              onClick={() => onAddGame(view.name)}
            >
              <div class={'w-6 h-6'}/>
              <div class={'text-md'}>
                {view.name}
              </div>
              <div class={'flex-1'}/>
            </Card>
          )}
        </For>
      </Modal>
    </div>
  );
};

export default GameContainer;
