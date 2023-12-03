import { FlatMap } from 'tstl/experimental';
import {
  Accessor, batch,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  on,
  onCleanup,
  onMount,
  useContext,
} from 'solid-js';

import useLyricMapper from '../hooks/useLyricMapper';
import usePluginOverride from '../hooks/usePluginOverride';
import { UpdateData } from '../../common/schema';
import { ConfigLyricMode } from '../../common/constants';
import { useLyricProvider } from '../hooks/useLyricProvider';
import { LyricData, LyricMetadata } from '../../common/provider';

export type Status = 'idle' | 'playing' | 'stopped';
export type LyricMode = 'auto' | 'manual' | 'player' | 'none';
export type PlayingInfo = {
  progress: Accessor<number>;
  duration: Accessor<number>;
  title: Accessor<string>;
  artist: Accessor<string>;
  status: Accessor<Status>;
  coverUrl: Accessor<string | null>;
  lyrics: Accessor<FlatMap<number, string[]> | null>;
  playerLyrics: Accessor<Record<number, string[]> | null>;
  originalData: Accessor<UpdateData | null>;
  originalLyric: Accessor<LyricData | null>;
  lyricMode: Accessor<LyricMode>;
  isMapped: Accessor<boolean>;
};

const PlayingInfoContext = createContext<PlayingInfo>({
  progress: () => 0,
  duration: () => 0,
  title: () => 'Not Playing' as const,
  artist: () => 'N/A' as const,
  status: () => 'idle' as const,
  coverUrl: () => null,
  lyrics: () => null,
  playerLyrics: () => null,
  originalData: () => null,
  originalLyric: () => null,
  lyricMode: () => 'auto' as const,
  isMapped: () => false,
});
const PlayingInfoProvider = (props: { children: JSX.Element }) => {
  const [progress, setProgress] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [title, setTitle] = createSignal('Not Playing');
  const [artist, setArtist] = createSignal('N/A');
  const [status, setStatus] = createSignal<Status>('idle');
  const [coverUrl, setCoverUrl] = createSignal<string | null>(null);
  const [lyrics, setLyrics] = createSignal<FlatMap<number, string[]> | null>(null);
  const [playerLyrics, setPlayerLyrics] = createSignal<Record<number, string[]> | null>(null);
  const [originalData, setOriginalData] = createSignal<UpdateData | null>(null);
  const [originalLyric, setOriginalLyric] = createSignal<LyricData | null>(null);
  const [isMapped, setIsMapped] = createSignal(false);

  const provider = useLyricProvider();
  const [lyricMapper] = useLyricMapper();

  const lyricMode = createMemo(() => {
    const mapper = lyricMapper();

    const mode: number | undefined = mapper[`${title()}:${coverUrl() ?? 'unknown'}`];

    if (mode === undefined) return 'auto';
    if (mode === ConfigLyricMode.NONE) return 'none';
    if (mode === ConfigLyricMode.PLAYER) return 'player';

    return 'manual';
  });

  const onUpdate = (_event: unknown, data: UpdateData) => {
    setOriginalData(data);

    batch(() => {
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
        setCoverUrl(null);
      }

      if (typeof data.lyrics === 'object') {
        setPlayerLyrics(data.lyrics);
      }
    });
  };

  const getLyric = async (data: UpdateData): Promise<LyricData | null> => {
    const lyricProvider = provider();

    if (!lyricProvider) return null;
    if (!Array.isArray(data.artists) || !data.title) return null;

    const artist = data?.artists?.join(', ') ?? '';
    const title = data?.title ?? '';

    let metadata: LyricMetadata[] = [];
    await usePluginOverride('search-lyrics', async (artist, title, options) => {
      metadata = await lyricProvider.searchLyrics({
        artist,
        title,
        playtime: options?.playtime,
      }).catch(() => []);
    }, artist, title, { playtime: data?.duration });

    if (metadata.length <= 0) return null;

    const result = await provider()?.getLyricById(metadata[0].id);
    if (result) return result;
    if (data.lyrics) {
      return {
        id: 'auto',
        title: data.title ?? '',
        lyric: data.lyrics,
      } satisfies LyricData;
    }

    return null;
  };

  window.ipcRenderer.on('update', onUpdate);
  window.ipcRenderer.invoke('get-last-update').then((update) => {
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


  onCleanup(() => window.ipcRenderer.removeListener('update', originalData));

  const onLyricChange = async () => {
    const data = originalData();
    const mapper = lyricMapper();
    const lyricProvider = provider();

    if (!data || !lyricProvider) return;

    const coverDataURL = data.cover_url ?? 'unknown';
    const id: number | undefined = mapper[`${data.title}:${coverDataURL}`];

    let lyricData: LyricData | null = null;
    switch (id) {
      case ConfigLyricMode.NONE: {
        setLyrics(null);
        break;
      }
      case ConfigLyricMode.PLAYER: {
        const lyricsFromPlayer = playerLyrics();
        if (lyricsFromPlayer) {
          lyricData = {
            id: 'player',
            title: data.title ?? '',
            lyric: lyricsFromPlayer,
          } satisfies LyricData;
        }
        break;
      }
      default: { // AUTO
        const providerLyric = id
          ? await provider()?.getLyricById(String(id)).catch(() => null)
          : await getLyric(data) ?? null;

        if (providerLyric) {
          lyricData = providerLyric;
        } else if (data.lyrics) {
          lyricData = {
            id: 'auto',
            title: data.title ?? '',
            lyric: data.lyrics,
          } satisfies LyricData;
        }
      }
    }

    setIsMapped(!!id);
    setOriginalLyric(lyricData);
    if (lyricData) {
      const treeMap = new FlatMap<number, string[]>();

      for (const key in lyricData.lyric) {
        treeMap.emplace(~~key, lyricData.lyric[key]);
      }

      setLyrics(treeMap);
    } else {
      setLyrics(null);
    }
  };
  createEffect(on([title, lyricMapper], onLyricChange));

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
    isMapped,
  } satisfies PlayingInfo;

  return (
    <PlayingInfoContext.Provider value={playingInfo}>
      {props.children}
    </PlayingInfoContext.Provider>
  );
};

export default PlayingInfoProvider;
export const usePlayingInfo = () => useContext(PlayingInfoContext);
