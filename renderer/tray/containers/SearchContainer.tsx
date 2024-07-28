import { createEffect, createSignal, For, on, Show, startTransition } from 'solid-js';

import alsong from 'alsong';

import { Marquee } from '@suyongs/solid-utility';

import Card from '../../components/Card';
import useLyricMapper from '../../hooks/useLyricMapper';
import usePluginOverride from '../../hooks/usePluginOverride';
import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import Spinner from '../../components/Spinner';
import { useTransContext } from '@jellybrick/solid-i18next';

type LyricMetadata = Awaited<ReturnType<typeof alsong.getLyricListByArtistName>>[number];

export const SearchContainer = () => {
  const {
    originalLyric
    , title: playingTitle, artist: playingArtist, originalData, status
  } = usePlayingInfo();
  const [, setLyricMapper] = useLyricMapper();
  const [t] = useTransContext();

  const [title, setTitle] = createSignal(playingTitle());
  const artist = () => {
    const provided = playingTitle().trim();

    if (title() !== provided) return '';
    return playingArtist();
  };
  const [searchList, setSearchList] = createSignal<LyricMetadata[]>([]);
  const [loading, setLoading] = createSignal(false);
  const currentLyricID = () => Number(originalLyric()?.id);

  createEffect(on([playingTitle, playingArtist, status], async () => {
    if (status() !== 'idle' && status() !== 'stopped') {
      setTitle(playingTitle().trim());
      await startTransition(async () => await onSearch());
    }
  }));

  const onSearch = async () => {
    setLoading(true);

    await usePluginOverride('search-lyrics', async (artist, title, options) => {
      const result = await alsong(artist, title, options).catch((e) => {
        console.error(e);
        return [];
      });

      setSearchList(result);
    }, artist(), title(), { playtime: originalData()?.duration });

    setLoading(false);
  };
  const onSelect = async (metadata: LyricMetadata) => {
    const data = originalData();
    if (!data?.title) return;

    setLoading(true);

    let coverUrl = data.cover_url;
    if (!coverUrl) coverUrl = 'unknown';

    const newMapper = {
      [`${data.title}:${coverUrl}`]: {
        mode: {
          type: 'provider' as const,
          id: metadata.lyricId.toString(),
        },
      },
    };

    await setLyricMapper(newMapper);
    setLoading(false);
  };

  return (
    <div
      class={'w-full flex-1 flex flex-col justify-start items-stretch overflow-hidden'}>
      <form
        class={'w-full flex justify-start items-center gap-2 p-4'}
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
        <button type={'submit'} class={'btn-text btn-icon'}>
          <svg class={'w-[16px] h-[16px] fill-none'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
              class={'fill-black dark:fill-white'}
            />
          </svg>
        </button>
      </form>
      <div class={'w-full flex flex-col justify-start items-stretch gap-2 flex-1 fluent-scrollbar p-4 pt-0'}>
        <Show when={loading()}>
          <div class={'w-full h-full flex justify-center items-center p-4'}>
            <Spinner class={'w-8 h-8 stroke-primary-500'}/>
          </div>
        </Show>
        <For each={searchList()}>
          {(item) => (
            <Card
              class={`
              flex flex-row justify-start items-center gap-1
              ${currentLyricID() === item.lyricId ? '!bg-primary-100 dark:!bg-primary-800 hover:!bg-primary-200 hover:dark:!bg-primary-700' : ''}
            `}
              onClick={() => onSelect(item)}
            >
              <div class={'w-full flex flex-col justify-center items-start overflow-hidden'}>
                <div class={'h-fit text-xs text-black/50 dark:text-white/50'}>
                  ID: {item.lyricId}
                </div>
                <Marquee class={'w-full'} gap={16}>
                  {item.title}
                </Marquee>
                <div class={'text-sm'}>
                  {item.artist}
                </div>
              </div>
              <Show
                when={currentLyricID() !== item.lyricId}
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
    </div>
  );
};