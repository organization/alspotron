import { OrderedMap } from '@js-sdsl/ordered-map';
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
  lyrics: Accessor<OrderedMap<number, string[]> | null>;
  originalData: Accessor<UpdateData | null>;
  originalLyric: Accessor<LyricInfo | null>;
};

type LyricInfo =
  | { kind: 'alsong', data: Lyric }
  | { kind: 'default', data: UpdateData };

const PlayingInfoContext = createContext<PlayingInfo>();
const PlayingInfoProvider = (props: { children: JSX.Element }) => {
  const [progress, setProgress] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [title, setTitle] = createSignal('Not Playing');
  const [artist, setArtist] = createSignal('N/A');
  const [status, setStatus] = createSignal('idle');
  const [coverUrl, setCoverUrl] = createSignal<string>();
  const [lyrics, setLyrics] = createSignal<OrderedMap<number, string[]> | null>(null);
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

    setProgress(data.progress);
    setDuration(data.duration);
    setCoverUrl(
      data.cover_url.match(/^(?:file|https?):\/\//) ? data.cover_url : IconMusic,
    );
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
        typeof id === 'number'
          ? await window.ipcRenderer.invoke('get-lyric-by-id', id) as (Lyric | null)
          : await window.ipcRenderer.invoke('get-lyric', data) as Lyric
      );

      if (alsongLyric) {
        return { kind: 'alsong', data: alsongLyric } as const;
      }

      if (data.lyric) {
        return { kind: 'default', data } as const;
      }

      return null;
    })();

    setOriginalLyric(lyricInfo);
    if (lyricInfo?.data.lyric) {
      const treeMap = new OrderedMap<number, string[]>();
      const iter = treeMap.begin();

      for (const key in lyricInfo.data.lyric) {
        treeMap.setElement(~~key, lyricInfo.data.lyric[key], iter);
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
