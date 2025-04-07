import { createEffect, createSignal, For, type JSX, on, Show, startTransition } from 'solid-js';

import { useTransContext } from '@jellybrick/solid-i18next';

import { Marquee } from '@suyongs/solid-utility';

import Card from '../../components/Card';
import useLyricMapper from '../../hooks/useLyricMapper';
import usePluginOverride from '../../hooks/usePluginOverride';
import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import { useLyricProvider } from '../../hooks/useLyricProvider';
import type { LyricMetadata } from '../../../common/provider';

export const SearchContainer = () => {
  const { lyricData, title: playingTitle, artist: playingArtist, duration, status, id } = usePlayingInfo();
  const [, setLyricMapper] = useLyricMapper();
  const [t] = useTransContext();
  const provider = useLyricProvider();

  const [open, setOpen] = createSignal(false);
  const [title, setTitle] = createSignal(playingTitle());
  const [artist, setArtist] = createSignal(playingArtist());

  const [searchList, setSearchList] = createSignal<LyricMetadata[]>([]);
  const [loading, setLoading] = createSignal(false);
  const currentLyricID = () => lyricData()?.id;

  createEffect(
    on([playingTitle, playingArtist, status], async () => {
      if (status() !== 'idle' && status() !== 'paused') {
        setTitle(playingTitle().trim());
        setArtist(playingArtist().trim());
        await startTransition(async () => await onSearch());
      }
    }),
  );

  const onSearch = async () => {
    setLoading(true);

    const lyricProvider = provider();
    await usePluginOverride(
      'search-lyrics',
      async (_, artist, title, __, options) => {
        const result = await lyricProvider
          .searchLyrics({
            artist,
            title,
            playtime: options?.playtime,
          })
          .catch(() => []);

        setSearchList(result);
      },
      'default',
      artist(),
      title(),
      '',
      { playtime: duration() },
    );

    setLoading(false);
  };
  const onSelect = async (metadata: LyricMetadata) => {
    const newMapper = {
      [id()]: {
        mode: {
          type: 'provider' as const,
          id: metadata.id,
        },
      },
    };

    await setLyricMapper(newMapper);
    setLoading(false);
  };
  const onArtist: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (event) => {
    event.preventDefault();

    setOpen(true);
  };
  const onArtistChange = () => {
    setArtist(artist().trim());
    setOpen(false);
    onSearch();
  };

  return (
    <div class={'w-full flex-1 flex flex-col justify-start items-stretch overflow-hidden'}>
      <form
        class={'w-full flex justify-start items-center gap-2 p-4 pt-2'}
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        <input
          class={'input flex-1 basis-0 w-8'}
          placeholder={t('lyrics.title')}
          value={title()}
          onInput={(event) => setTitle(event.target.value)}
        />
        <button
          type={'submit'}
          class={'btn-text btn-icon'}
        >
          <svg
            class={'w-[16px] h-[16px] fill-none'}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
              class={'fill-black dark:fill-white'}
            />
          </svg>
        </button>
        <button
          class={'btn-text btn-icon'}
          onClick={onArtist}
        >
          <svg
            class={'w-[16px] h-[16px] fill-none'}
            viewBox="0 -960 960 960"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M740-560h140v80h-80v220q0 42-29 71t-71 29q-42 0-71-29t-29-71q0-42 29-71t71-29q8 0 18 1.5t22 6.5v-208ZM120-160v-112q0-35 17.5-63t46.5-43q62-31 126-46.5T440-440q42 0 83.5 6.5T607-414q-20 12-36 29t-28 37q-26-6-51.5-9t-51.5-3q-57 0-112 14t-108 40q-9 5-14.5 14t-5.5 20v32h321q2 20 9.5 40t20.5 40H120Zm320-320q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T520-640q0-33-23.5-56.5T440-720q-33 0-56.5 23.5T360-640q0 33 23.5 56.5T440-560Zm0-80Zm0 400Z"
              class={'fill-black dark:fill-white'}
            />
          </svg>
        </button>
      </form>
      <div
        class={'w-full flex flex-col justify-start items-stretch gap-2 flex-1 overflow-auto remove-scrollbar p-4 pt-0'}
      >
        <Show when={loading()}>
          <div class={'w-full h-full flex justify-center items-center p-4'}>
            <Spinner class={'w-8 h-8 stroke-primary-500'} />
          </div>
        </Show>
        <For each={searchList()}>
          {(item) => (
            <Card
              class={`
              flex flex-row justify-start items-center gap-1
              ${currentLyricID() === item.id ? '!bg-primary-100 dark:!bg-primary-800 hover:!bg-primary-200 hover:dark:!bg-primary-700' : ''}
            `}
              onClick={() => onSelect(item)}
            >
              <div class={'w-full flex flex-col justify-center items-start overflow-hidden'}>
                <div class={'h-fit text-xs text-black/50 dark:text-white/50'}>ID: {item.id}</div>
                <Marquee
                  class={'w-full'}
                  gap={16}
                >
                  {item.title}
                </Marquee>
                <div class={'text-sm'}>{item.artist}</div>
              </div>
              <Show
                when={currentLyricID() !== item.id}
                fallback={
                  <svg
                    class={'w-[24px] h-[24px] fill-none self-center flex-shrink-0'}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                  >
                    <path
                      d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"
                      class={'fill-green-500'}
                    />
                  </svg>
                }
              >
                <svg
                  class={'w-[16px] h-[16px] fill-none self-center flex-shrink-0'}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.293 4.293a1 1 0 0 0 0 1.414L14.586 12l-6.293 6.293a1 1 0 1 0 1.414 1.414l7-7a1 1 0 0 0 0-1.414l-7-7a1 1 0 0 0-1.414 0Z"
                    class={'fill-black dark:fill-white'}
                  />
                </svg>
              </Show>
            </Card>
          )}
        </For>
      </div>
      <Modal
        open={open()}
        onClose={() => setOpen(false)}
        buttons={[
          {
            type: 'positive',
            name: t('common.okay'),
            onClick: onArtistChange,
          },
        ]}
      >
        <div class={'text-black dark:text-white text-xl mb-2'}>{t('lyrics.artist')}</div>
        <input
          class={'input'}
          value={artist()}
          onInput={(event) => setArtist(event.target.value)}
        />
      </Modal>
    </div>
  );
};
