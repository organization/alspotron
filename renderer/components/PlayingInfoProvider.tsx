import { FlatMap } from 'tstl/experimental';
import alsong from 'alsong';
import {
  Accessor,
  createContext,
  createDeferred,
  createEffect,
  createSignal,
  JSX,
  on,
  onCleanup,
  onMount,
  useContext,
} from 'solid-js';

import useLyricMapper from '../hooks/useLyricMapper';
import { UpdateData } from '../types';
import { ConfigLyricMode } from '../../common/constants';

export type Lyric = Awaited<ReturnType<typeof alsong.getLyricById>>;
export type Status = 'idle' | 'playing' | 'stopped';
export type LyricMode = 'auto' | 'manual' | 'player' | 'none';
export type PlayingInfo = {
  progress: Accessor<number>;
  duration: Accessor<number>;
  title: Accessor<string>;
  artist: Accessor<string>;
  status: Accessor<Status>;
  coverUrl: Accessor<string | undefined>;
  lyrics: Accessor<FlatMap<number, string[]> | null>;
  playerLyrics: Accessor<Record<number, string[]> | undefined>;
  originalData: Accessor<UpdateData | null>;
  originalLyric: Accessor<LyricInfo | null>;
  lyricMode: Accessor<LyricMode>;
};

export type LyricInfo =
  | { useMapper: boolean, kind: 'alsong', data: Lyric }
  | { useMapper: boolean, kind: 'default', data: UpdateData & { lyric: Record<number, string[]> } };

const PlayingInfoContext = createContext<PlayingInfo>({
  progress: () => 0,
  duration: () => 0,
  title: () => 'Not Playing' as const,
  artist: () => 'N/A' as const,
  status: () => 'idle' as const,
  coverUrl: () => undefined,
  lyrics: () => null,
  playerLyrics: () => undefined,
  originalData: () => null,
  originalLyric: () => null,
  lyricMode: () => 'auto' as const,
});
const PlayingInfoProvider = (props: { children: JSX.Element }) => {
  const [progress, setProgress] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [title, setTitle] = createSignal('Not Playing');
  const [artist, setArtist] = createSignal('N/A');
  const [status, setStatus] = createSignal<Status>('idle');
  const [coverUrl, setCoverUrl] = createSignal<string>();
  const [lyrics, setLyrics] = createSignal<FlatMap<number, string[]> | null>(null);
  const [playerLyrics, setPlayerLyrics] = createSignal<Record<number, string[]>>();
  const [originalData, setOriginalData] = createSignal<UpdateData | null>(null);
  const [originalLyric, setOriginalLyric] = createSignal<LyricInfo | null>(null);

  const [lyricMapper] = useLyricMapper();

  const lyricMode = () => {
    const data = originalData();
    const mapper = lyricMapper();

    if (!data) return 'auto';

    const mode: number | undefined = mapper[`${data.title}:${data.cover_url ?? 'unknown'}`];
    if (mode === undefined) return 'auto';
    if (mode === ConfigLyricMode.NONE) return 'none';
    if (mode === ConfigLyricMode.PLAYER) return 'player';

    return 'manual';
  };

  const onUpdate = (_event: unknown, message: { data: UpdateData }) => {
    const data: UpdateData = message.data;

    setOriginalData(data);

    if (typeof data.title === 'string') {
      setTitle(data.title);
    }

    if (['idle', 'playing', 'stopped'].includes(data.status)) {
      setStatus(data.status as Status);
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

    if (typeof data.cover_url === 'string' && /^(?:file|https?):\/\//.exec(data.cover_url)) {
      setCoverUrl(data.cover_url);
    } else {
      setCoverUrl(undefined);
    }

    if (typeof data.lyrics === 'object') {
      setPlayerLyrics(data.lyrics);
    }
  };

  const getLyric = async (data: UpdateData): Promise<Lyric> => {
    if (!Array.isArray(data.artists) || !data.title) return {} as Lyric;

    const artist = data?.artists?.join(', ') ?? '';
    const title = data?.title ?? '';

    const metadata = await alsong(artist, title, { playtime: data?.duration }).catch(() => []);
    if (metadata.length <= 0) return {} as Lyric;

    return await alsong.getLyricById(metadata[0].lyricId).catch(() => ({ lyric: data.lyrics } as Lyric));
  };

  window.ipcRenderer.on('update', onUpdate);
  window.ipcRenderer.invoke('get-last-update').then((update?: { data: UpdateData }) => {
    if (update) {
      onUpdate(null, update);
    }
  });

  onMount(() => {
    setInterval(() => {
      if (status() === 'playing') {
        setProgress(progress() + 100);
      }
    }, 100);
  });

  onCleanup(() => window.ipcRenderer.off('update', originalData));

  createEffect(on([createDeferred(() => title() || coverUrl()), lyricMapper], async () => {
    const data = originalData();
    const mapper = lyricMapper();

    if (!data) return;
    const coverDataURL = data.cover_url ?? 'unknown';

    const id: number | undefined = mapper[`${data.title}:${coverDataURL}`];

    let lyricInfo: LyricInfo | null = null;
    if (id === ConfigLyricMode.NONE) {
      setLyrics(null);
    } else if (id === ConfigLyricMode.PLAYER) {
      const lyricsFromPlayer = playerLyrics();
      if (lyricsFromPlayer) {
        lyricInfo = {
          useMapper: !!id,
          kind: 'default',
          data: {
            ...data,
            lyric: lyricsFromPlayer,
          },
        } satisfies LyricInfo;
      }
    } else {
      const alsongLyric = id
        ? await alsong.getLyricById(id).catch(() => null)
        : await getLyric(data);

      if (alsongLyric) {
        lyricInfo = {
          useMapper: !!id,
          kind: 'alsong',
          data: alsongLyric,
        } satisfies LyricInfo;
      } else if (data.lyrics) {
        lyricInfo = {
          useMapper: !!id,
          kind: 'default',
          data: {
            ...data,
            lyric: data.lyrics,
          },
        } satisfies LyricInfo;
      }
    }

    setOriginalLyric(lyricInfo);
    if (lyricInfo?.data?.lyric) {
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
    playerLyrics,
    originalData,
    originalLyric,
    lyricMode,
  } satisfies PlayingInfo;

  return (
    <PlayingInfoContext.Provider value={playingInfo}>
      {props.children}
    </PlayingInfoContext.Provider>
  );
};

export default PlayingInfoProvider;
export const usePlayingInfo = () => useContext(PlayingInfoContext);
