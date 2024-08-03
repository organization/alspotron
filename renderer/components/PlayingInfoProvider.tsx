import { experimental } from 'tstl';
import {
  Accessor,
  createContext,
  createEffect,
  createMemo, createRenderEffect,
  createSignal,
  JSX,
  on,
  onCleanup,
  useContext,
} from 'solid-js';

import useLyricMapper from '../hooks/useLyricMapper';
import usePluginOverride from '../hooks/usePluginOverride';
import { PausedData, PlayingData, UpdateData } from '../../common/schema';
import { useLyricProvider } from '../hooks/useLyricProvider';
import { LyricData, LyricMetadata } from '../../common/provider';

export type Status = UpdateData['data']['type'];
export type LyricMode = 'auto' | 'manual' | 'player' | 'none';
export type PlayingInfo = {
  status: Accessor<Status>;

  id: Accessor<string>;
  title: Accessor<string>;
  artist: Accessor<string>;
  progress: Accessor<number>;
  duration: Accessor<number>;
  coverUrl: Accessor<string | null>;
  playerLyrics: Accessor<Record<number, string[]> | null>;

  lyricData: Accessor<LyricData | null>;
  lyrics: Accessor<experimental.FlatMap<number, string[]> | null>;
  updateData: Accessor<UpdateData | null>;
  lyricMode: Accessor<LyricMode>;
  isMapped: Accessor<boolean>;
};

const PlayingInfoContext = createContext<PlayingInfo>({
  status: () => 'idle' as const,

  id: () => '',
  title: () => 'Not Playing' as const,
  artist: () => 'N/A' as const,
  progress: () => 0,
  duration: () => 0,
  coverUrl: () => null,
  playerLyrics: () => null,

  lyricData: () => null,
  lyrics: () => null,
  updateData: () => null,
  lyricMode: () => 'auto' as const,
  isMapped: () => false,
});
const PlayingInfoProvider = (props: { children: JSX.Element }) => {
  const [updateData, setUpdateData] = createSignal<UpdateData | null>(null);

  const get = <Type, >(getter: (data: PlayingData | PausedData) => Type, defaultValue: Type) => on([updateData], ([data]) => {
    if (!data) return defaultValue;
    if (data.data.type === 'idle') return defaultValue;
    return getter(data.data);
  });
  const id = createMemo(get((data) => data.id, ''));
  const title = createMemo(get((data) => data.title, 'Not Playing'));
  const artist = createMemo(get((data) => data.artists.join(', '), 'N/A'));
  const progress = createMemo(get((data) => data.progress, 0));
  const duration = createMemo(get((data) => data.duration, 0));
  const status = createMemo(() => updateData()?.data.type ?? 'idle');
  const coverUrl = createMemo(get((data) => data.coverUrl, null));
  const playerLyrics = createMemo(get((data) => data.playerLyrics ?? null, null));

  const [lyricData, setLyricData] = createSignal<LyricData | null>(null);
  const [lyrics, setLyrics] = createSignal<experimental.FlatMap<number, string[]> | null>(null);
  const [isMapped, setIsMapped] = createSignal(false);

  const provider = useLyricProvider();
  const [lyricMapper] = useLyricMapper();

  const lyricMode = createMemo(() => {
    const mapper = lyricMapper();

    const mode = mapper[id()]?.mode;

    if (mode === undefined) return 'auto';
    if (mode.type === 'none') return 'none';
    if (mode.type === 'player') return 'player';

    return 'manual';
  });

  const getLyric = async (data: UpdateData): Promise<LyricData | null> => {
    const lyricProvider = provider();

    if (!lyricProvider) return null;
    if (data.data.type === 'idle') return null;

    const artist = data.data.artists.join(', ');
    const title = data.data.title;

    let metadata: LyricMetadata[] = [];
    await usePluginOverride(
      'search-lyrics',
      async (artist, title, options) => {
        metadata = await lyricProvider.searchLyrics({
          artist,
          title,
          playtime: options?.playtime,
        }).catch(() => []);
      },
      artist,
      title,
      { playtime: data.data.duration },
    );

    if (metadata.length <= 0) return null;

    const result = await provider()?.getLyricById(metadata[0].id);
    if (result) return result;
    if (data.data.playerLyrics) {
      return {
        id: 'auto',
        title: data.data.title,
        lyric: data.data.playerLyrics,
      } satisfies LyricData;
    }

    return null;
  };

  window.ipcRenderer.on('update', (_, newUpdateData: UpdateData) => {
    setUpdateData(newUpdateData);
  });
  window.ipcRenderer.invoke('get-last-update').then((update) => {
    console.log('get-last-update', update);
    if (update) setUpdateData(update);
  });

  // onMount(() => {
  //   setInterval(() => {
  //     if (status() === 'playing') {
  //       setProgress(progress() + 100);
  //     }
  //   }, 100);
  // });

  const onLyricChange = async () => {
    const data = updateData();
    const mapper = lyricMapper();
    const lyricProvider = provider();

    if (!data || !lyricProvider) return;

    const mapperData = mapper[id()];

    let lyricData: LyricData | null = null;
    if (mapperData?.mode?.type === 'none') {
      setLyrics(null);
    } else if (mapperData?.mode?.type === 'player') {
      const lyricsFromPlayer = playerLyrics();
      lyricData = {
        id: 'player',
        title: title() ?? '',
        lyric: lyricsFromPlayer ?? undefined,
      } satisfies LyricData;
    } else {
      const id = mapperData?.mode?.id;
      const providerLyric = id
        ? await provider()?.getLyricById(id).catch(() => null)
        : await getLyric(data) ?? null;

      if (providerLyric) lyricData = providerLyric;
      else if (data.data.type !== 'idle' && data.data.playerLyrics) {
        lyricData = {
          id: 'auto',
          title: data.data.title ?? '',
          lyric: data.data.playerLyrics,
        } satisfies LyricData;
      }
    }

    setIsMapped(!!mapperData);
    setLyricData(lyricData);
    if (lyricData && lyricData?.lyric) {
      const treeMap = new experimental.FlatMap<number, string[]>();

      for (const key in lyricData.lyric) {
        treeMap.emplace(~~key, lyricData.lyric[key]);
      }

      setLyrics(treeMap);
    } else {
      setLyrics(null);
    }
  };
  createEffect(on([title, lyricMapper], onLyricChange));
  onCleanup(() => window.ipcRenderer.removeListener('update', setUpdateData));

  const playingInfo = {
    status,

    id,
    title,
    artist,
    progress,
    duration,
    coverUrl,
    playerLyrics,

    lyricData,
    lyrics,
    updateData,
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
