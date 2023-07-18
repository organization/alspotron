import { FlatMap } from 'tstl/experimental';
import alsong from 'alsong';
import { Accessor, createContext, createEffect, createSignal, JSX, on, onCleanup, onMount, useContext } from 'solid-js';

import IconMusic from '../../assets/icon_music.png';
import useLyricMapper from '../hooks/useLyricMapper';
import { UpdateData } from '../types';

type Lyric = Awaited<ReturnType<typeof alsong.getLyricById>>;
type PlayingInfo = {
  progress: Accessor<number>;
  duration: Accessor<number>;
  title: Accessor<string>;
  artist: Accessor<string>;
  status: Accessor<'idle' | 'playing' | 'stopped'>;
  coverUrl: Accessor<string>;
  lyrics: Accessor<FlatMap<number, string[]> | null>;
  originalData: Accessor<UpdateData | null>;
  originalLyric: Accessor<LyricInfo | null>;
};

type LyricInfo =
  | { useMapper: boolean, kind: 'alsong', data: Lyric }
  | { useMapper: boolean, kind: 'default', data: UpdateData };

const PlayingInfoContext = createContext<PlayingInfo>({
  progress: () => 0,
  duration: () => 0,
  title: () => 'Not Playing' as const,
  artist: () => 'N/A' as const,
  status: () => 'idle' as const,
  coverUrl: () => IconMusic,
  lyrics: () => null,
  originalData: () => null,
  originalLyric: () => null,
});
const PlayingInfoProvider = (props: { children: JSX.Element }) => {
  const [progress, setProgress] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [title, setTitle] = createSignal('Not Playing');
  const [artist, setArtist] = createSignal('N/A');
  const [status, setStatus] = createSignal('idle');
  const [coverUrl, setCoverUrl] = createSignal<string>();
  const [lyrics, setLyrics] = createSignal<FlatMap<number, string[]> | null>(null);
  const [originalData, setOriginalData] = createSignal<UpdateData | null>(null);
  const [originalLyric, setOriginalLyric] = createSignal<LyricInfo | null>(null);

  const [lyricMapper] = useLyricMapper();

  const onUpdate = (_event: unknown, message: { data: UpdateData }) => {
    const data: UpdateData = message.data;

    setOriginalData(data);
    setStatus(data.status);

    if (typeof data.title === 'string') {
      setTitle(data.title);
    }

    if (Array.isArray(data.artists)) {
      setArtist(data.artists.join(', '));
    }

    if (typeof data.progress === 'number') {
      setProgress(data.progress);
    }
    if (typeof data.duration === 'number') {
      setDuration(data.duration);
    }
    if (typeof data.cover_url === 'string' && data.cover_url.match(/^(?:file|https?):\/\//)) {
      setCoverUrl(data.cover_url);
    } else {
      setCoverUrl(IconMusic);
    }
  };

  window.ipcRenderer.on('update', onUpdate);
  onMount(() => {
    setInterval(() => {
      if (status() === 'playing') {
        setProgress(progress() + 100);
      }
    }, 100);
  });

  onCleanup(() => window.ipcRenderer.off('update', originalData));

  createEffect(on([title, coverUrl, lyricMapper], async () => {
    const data = originalData();
    const mapper = lyricMapper();

    if (!data) return;

    const id: number | undefined = mapper[`${data.title}:${data.cover_url}`];
    const lyricInfo = await (async () => {
      const alsongLyric = (
        id
          ? await window.ipcRenderer.invoke('get-lyric-by-id', id) as (Lyric | null)
          : await window.ipcRenderer.invoke('get-lyric', data) as Lyric
      );

      if (alsongLyric) {
        return { useMapper: !!id, kind: 'alsong', data: alsongLyric } as const;
      }

      if (data.lyric) {
        return { useMapper: !!id, kind: 'default', data } as const;
      }

      return null;
    })();

    setOriginalLyric(lyricInfo);
    if (lyricInfo?.data.lyric) {
      const treeMap = new FlatMap<number, string[]>();

      for (const key in lyricInfo.data.lyric) {
        treeMap.emplace(~~key, lyricInfo.data.lyric[key]);
      }

      setLyrics(treeMap);
    } else {
      setLyrics(null);
    }
  }));

  const playingInfo = {
    title,
    artist,
    progress,
    duration,
    status,
    coverUrl,
    lyrics,
    originalData,
    originalLyric,
  } as PlayingInfo;

  return (
    <PlayingInfoContext.Provider value={playingInfo}>
      {props.children}
    </PlayingInfoContext.Provider>
  );
};

export default PlayingInfoProvider;
export const usePlayingInfo = () => useContext(PlayingInfoContext);
