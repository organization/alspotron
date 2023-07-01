import alsong from 'alsong';
import { For, createEffect, createMemo, createSignal, on } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';

import TreeMap from 'ts-treemap';
import IconMusic from '../../assets/icon_music.png';
import useConfig from '../hooks/useConfig';
import useLyricMapper from '../hooks/useLyricMapper';
import { UpdateData } from '../types';
import LyricProgressBar from './components/LyricProgressBar';
import LyricsItem from './components/LyricsItem';

type Lyric = Awaited<ReturnType<typeof alsong.getLyricById>>;

const App = () => {
  const [progress, setProgress] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [title, setTitle] = createSignal('Not Playing');
  const [artist, setArtist] = createSignal('N/A');
  const [status, setStatus] = createSignal('idle');
  const [coverUrl, setCoverUrl] = createSignal<string>();
  const [lyrics, setLyrics] = createSignal<TreeMap<number, string[]> | null>(null);
  const [originalData, setOriginalData] = createSignal<UpdateData | null>(null);

  const [lyricMapper] = useLyricMapper();
  const [config] = useConfig();

  const lyricIndex = createMemo(() => {
    if (lyrics() === null) return 0;

    return lyrics().lowerKey(progress() + 1225);
  });

  window.ipcRenderer.on('update', (_, message: { data: UpdateData }) => {
    const data: UpdateData = message.data;

    setOriginalData(data);

    setStatus(data.status);
    setTitle(data.title);
    setArtist(data.artists.join(', '));
    setProgress(data.progress);
    setDuration(data.duration);
    setCoverUrl(
      data.cover_url.match(/^(?:file|https?):\/\//) ? data.cover_url : IconMusic,
    );
  });

  createEffect(on([title, coverUrl, lyricMapper], async () => {
    const data = originalData();
    const mapper = lyricMapper();

    if (!data) return;
    const id: number | undefined = mapper[`${data.title}:${data.cover_url}`];

    const lyric = (
      typeof id === 'number'
        ? (await window.ipcRenderer.invoke('get-lyric-by-id', id) as Lyric ?? data)
        : await window.ipcRenderer.invoke('get-lyric', data) as Lyric
    )

    if (lyric?.lyric) {
      const treeMap = new TreeMap<number, string[]>();
      for (const key in lyric.lyric) {
        treeMap.set(~~key, lyric.lyric[key]);
      }
      setLyrics(treeMap);
    }
    else setLyrics(null);
  }));

  return (
    <div
      class={`
        fixed w-full h-fit
        flex gap-4
      `}
      classList={{
        'top-0': config()?.windowPosition.anchor.includes('top'),
        'bottom-0': config()?.windowPosition.anchor.includes('bottom'),
        'left-0': config()?.windowPosition.anchor.includes('left'),
        'right-0': config()?.windowPosition.anchor.includes('right'),
        'left-[50%] right-[50%] translate-x-[-50%]': ['top', 'bottom', 'center'].includes(config()?.windowPosition.anchor),
        'top-[50%] bottom-[50%] translate-y-[-50%]': ['left', 'right', 'center'].includes(config()?.windowPosition.anchor),

        'justify-start': config()?.windowPosition.anchor.includes('top'),
        'justify-center': ['left', 'right', 'center'].includes(config()?.windowPosition.anchor),
        'justify-end': config()?.windowPosition.anchor.includes('bottom'),
        'items-start': config()?.windowPosition.anchor.includes('left'),
        'items-center': ['top', 'bottom', 'center'].includes(config()?.windowPosition.anchor),
        'items-end': config()?.windowPosition.anchor.includes('right'),
      }}
      style={{
        'flex-direction': config()?.windowPosition.anchor.includes('bottom') ? 'column' : 'column-reverse',
      }}
    >
      <TransitionGroup name={'lyric'}>
        <For each={lyrics()?.get(lyricIndex()) ?? []}>
          {(item, index) => (
            <LyricsItem
              status={status()}
              delay={index()}
              style={`
                font-family: ${config()?.style.font};
                font-weight: ${config()?.style.fontWeight};
                font-size: ${
                  typeof config()?.style.lyric.fontSize === 'string'
                    ? config()?.style.lyric.fontSize
                    : `${config()?.style.lyric.fontSize}px`
                };
                color: ${config()?.style.lyric.color};
                background-color: ${config()?.style.lyric.background};
              `}
            >
              {item}
            </LyricsItem>
          )}
        </For>
      </TransitionGroup>
      <div />
      <LyricProgressBar
        coverUrl={coverUrl()}
        title={title()}
        artist={artist()}
        percent={progress() / duration()}
        status={status()}
        style={`
          max-width: ${config()?.style.nowPlaying.maxWidth}px;
          font-family: ${config()?.style.font};
          font-weight: ${config()?.style.fontWeight};
          color: ${config()?.style.nowPlaying.color};
          background-color: ${config()?.style.nowPlaying.background};
        `}
        textStyle={`
          font-size: ${
            typeof config()?.style.nowPlaying.fontSize === 'string'
              ? config()?.style.nowPlaying.fontSize
              : `${config()?.style.nowPlaying.fontSize}px`
          };
        `}
        progressStyle={`
          background-color: ${config()?.style.nowPlaying.backgroundProgress};
        `}
      />
    </div>
  )
};

export default App;
