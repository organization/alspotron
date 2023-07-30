import { For, Match, Show, Switch, createEffect, createSignal } from 'solid-js';
import { Trans, useTransContext } from '@jellybrick/solid-i18next';

import GameListContainer from './GameListContainer';

import Card from '../../components/Card';
import Marquee from '../../components/Marquee';
import useGameList from '../../hooks/useGameList';
import usePlayingGame from '../../hooks/usePlayingGame';

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
  const [pageState, setPageState] = createSignal('default');

  const [gameList, setGameList] = useGameList();
  const playingGame = usePlayingGame();
  const [t] = useTransContext();

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

  const onAddGame = (process: ProcessData) => {
    setGameList({
      [process.path]: process.name,
    }).then(() => window.ipcRenderer.invoke('inject-overlay-to-process', process.pid, process.name, process.path));
  };
  const onRemoveGame = (path: string) => {
    const list = { ...gameList() };
    delete list[path];

    setGameList(list, false);
  };

  return (
    <Switch>
      <Match when={pageState() === 'default'}>
        <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 p-4 fluent-scrollbar'}>
          <div class={'text-3xl mb-1'}>
            <Trans key={'setting.title.game-overlay'} />
          </div>
          <div class={'text-md mt-4 mb-1'}>
            <Trans key={'setting.game.current-playing-game'} />
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
              <Trans key={'setting.game.not-detected'} />
            </Card>
          </Show>
          <div class={'text-md mt-4 mb-1'}>
            <Trans key={'setting.game.list-of-registered-games'} />
          </div>
          <Card class={'w-full flex justify-start items-center gap-4'} onClick={() => setPageState('list')}>
            <div class={'w-0 flex flex-col justify-center items-start flex-1'}>
              <div class={'w-full'}>
                <Trans key={'setting.game.registered-games'} />
              </div>
              <div class={'text-sm text-gray-400'}>
                <Trans key={'setting.game.registered-games-count'} options={{ count: (Object.keys(gameList())?.length ?? 0) }} />
              </div>
            </div>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.47 4.22a.75.75 0 0 0 0 1.06L15.19 12l-6.72 6.72a.75.75 0 1 0 1.06 1.06l7.25-7.25a.75.75 0 0 0 0-1.06L9.53 4.22a.75.75 0 0 0-1.06 0Z" class={'fill-white'} />
            </svg>
          </Card>
          <div class={'flex mt-4 mb-1 gap-1'}>
            <span class={'text-md'}>
              <Trans key={'setting.game.search-game'} />
            </span>
            <button class={'hover:!bg-white/[7.5%] rounded'} onClick={() => updateProcessList()}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" class={'fill-white'}/>
              </svg>
            </button>
          </div>

          <For each={processList()}>
            {(process) => (
              <Card class={'w-full flex justify-start items-center gap-4'}>
                <Show when={!!process.icon} fallback={<div class={'w-6 h-6 aspect-square'} />}>
                  <img src={process.icon} class={'w-6 h-6 object-cover'} alt={'Icon'}/>
                </Show>
                <div class={'w-0 flex flex-col justify-center items-stretch flex-1'}>
                  <div class={'w-full'}>
                    {process.name}
                  </div>
                  <Marquee class={'text-sm text-gray-400'} gap={18}>
                    {process.path}
                  </Marquee>
                </div>
                <Show
                  when={gameList()[process.path]}
                  fallback={(
                    <button class={'btn-primary'} onClick={() => onAddGame(process)}>
                      <Trans key={'setting.game.register-game'} />
                    </button>
                  )}
                >
                  <button class={'btn-text'} onClick={() => onRemoveGame(process.path)}>
                    <Trans key={'setting.game.unregister-game'} />
                  </button>
                </Show>
              </Card>
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
              <path d="M4.22 8.47a.75.75 0 0 1 1.06 0L12 15.19l6.72-6.72a.75.75 0 1 1 1.06 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L4.22 9.53a.75.75 0 0 1 0-1.06Z" class={'fill-white'} />
            </svg>
            {
              showOnlyAvailable() ?
                t('setting.game.show-all-programs-running-in-the-background') :
                t('setting.game.show-only-programs-running-in-the-foreground')
            }
          </button>
        </div>
      </Match>
      <Match when={pageState() === 'list'}>
        <GameListContainer
          onBack={() => setPageState('default')}
        />
      </Match>
    </Switch>
  );
};

export default GameContainer;
