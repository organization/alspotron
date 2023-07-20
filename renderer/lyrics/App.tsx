import { For, Show, createSignal, createEffect, on, startTransition } from 'solid-js';

import SideBar from './SideBar';

import Card from '../components/Card';
import Layout from '../components/Layout';
import PlayingInfoProvider, { usePlayingInfo } from '../components/PlayingInfoProvider';
import Spinner from '../components/Spinner';
import UserCSS from '../components/UserCSS';
import useLyricMapper from '../hooks/useLyricMapper';
import { formatTime } from '../utils/formatTime';

import type alsong from 'alsong';

type LyricMetadata = Awaited<ReturnType<typeof alsong.getLyricListByArtistName>>[number];

const LyricsMapEditor = () => {
  const { title: playingTitle, artist: playingArtist, originalData, status } = usePlayingInfo();

  const [title, setTitle] = createSignal(playingTitle());
  const [artist, setArtist] = createSignal(playingArtist());

  const [loading, setLoading] = createSignal(false);
  const [lyricMetadata, setLyricMetadata] = createSignal<LyricMetadata[]>([]);
  const [, setLyricMapper] = useLyricMapper();

  createEffect(on([playingTitle, playingArtist, status], async () => {
    if (status() !== 'idle' && status() !== 'stopped') {
      setTitle(playingTitle().trim());
      setArtist(playingArtist().trim());
      await startTransition(async () => await onSearch());
    }
  }));

  const onSearch = async () => {
    setLoading(true);
    const result = await window.ipcRenderer.invoke('search-lyric', {
      title: title(),
      artist: artist(),
    }) as LyricMetadata[] & { registerDate: string };

    setLyricMetadata(result);
    setLoading(false);
  };

  const onSelect = async (metadata: LyricMetadata) => {
    const data = originalData();
    if (!data?.title || !data?.cover_url) return;

    setLoading(true);

    const newMapper = {
      [`${data.title}:${data.cover_url}`]: metadata.lyricId,
    };

    await setLyricMapper(newMapper);
    setLoading(false);
  };

  return (
    <Layout>
      <div
        class={`
          w-full h-full
          flex flex-row justify-start items-stretch gap-0
          text-white
        `}
      >
        <PlayingInfoProvider>
          <SideBar />
        </PlayingInfoProvider>
        <div class={'min-w-0 flex-1 flex flex-col justify-start items-center gap-1 pt-4'}>
          <form
            class={'w-full flex gap-2 mb-4 px-4'}
            onSubmit={(event) => {
              event.preventDefault();
              onSearch();
            }}
          >
            <input
              class={'input'}
              placeholder={'아티스트 명'}
              value={artist()}
              onInput={(event) => setArtist(event.target.value)}
            />
            <input
              class={'input flex-1'}
              placeholder={'제목'}
              value={title()}
              onInput={(event) => setTitle(event.target.value)}
            />
            <button type={'submit'} class={'btn-text btn-icon !min-w-0'}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fill="#ffffff" />
              </svg>
            </button>
          </form>
          <div class={'w-full flex flex-col justify-start items-center gap-1 fluent-scrollbar px-4 pb-4'}>
            <Show when={loading()}>
              <Spinner class={'w-8 h-8 stroke-primary-500'} />
            </Show>
            <Show when={!loading() && lyricMetadata().length === 0}>
              <div class={'text-white/30'}>
                검색결과가 없습니다.
              </div>
            </Show>
            <For each={lyricMetadata()}>
              {(metadata) => (
                <Card class={'flex flex-row justify-start items-center gap-1'} onClick={() => onSelect(metadata)}>
                  <div class={'flex flex-col justify-center items-start'}>
                    <div class={'h-fit text-xs text-white/50'}>
                      ID: {metadata.lyricId}
                    </div>
                    <div class={''}>
                      {metadata.title}
                    </div>
                    <div class={'text-sm'}>
                      {metadata.artist}
                    </div>
                  </div>
                  <div class={'flex-1'} />
                  <div class={'flex flex-col justify-end items-end mr-3 self-center'}>
                    <div class={'w-[140px] text-sm text-right text-white/50'}>
                      {metadata.registerDate ? new Date(metadata.registerDate).toLocaleString(undefined, {
                        timeZone: 'Asia/Seoul',
                        hour12: false,
                        dateStyle: 'medium',
                        timeStyle: 'medium',
                      }) : 'Invalid Date'}
                    </div>
                    <Show when={metadata.playtime >= 0}>
                      <div class={'h-fit text-sm text-right text-white/50'}>
                        재생시간: {formatTime(metadata.playtime)}
                      </div>
                    </Show>
                  </div>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class={'self-center'}>
                    <path d="M8.293 4.293a1 1 0 0 0 0 1.414L14.586 12l-6.293 6.293a1 1 0 1 0 1.414 1.414l7-7a1 1 0 0 0 0-1.414l-7-7a1 1 0 0 0-1.414 0Z" fill="#ffffff"/>
                  </svg>
                </Card>
              )}
            </For>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const App = () => (
  <PlayingInfoProvider>
    <LyricsMapEditor />
    <UserCSS />
  </PlayingInfoProvider>
);

export default App;
