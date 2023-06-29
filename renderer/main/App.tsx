import { Accessor, For, createEffect, createMemo, createSignal, on, untrack } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';

import LyricProgressBar from './components/LyricProgressBar';
import LyricsItem from './components/LyricsItem';
import { UpdateData } from '../types';
import useLyricMapper from '../hooks/useLyricMapper';
import useConfig from '../hooks/useConfig';

const App = () => {
  const [progress, setProgress] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [title, setTitle] = createSignal('Not Playing');
  const [artist, setArtist] = createSignal('N/A');
  const [status, setStatus] = createSignal('idle');
  const [coverUrl, setCoverUrl] = createSignal<string>();
  const [lyrics, setLyrics] = createSignal<Record<string, string[]> | null>({});
  const [originalData, setOriginalData] = createSignal<UpdateData | null>(null);

  const [lyricMapper] = useLyricMapper();
  const [config] = useConfig();

  const lyricIndex = createMemo(() => {
    if (lyrics() === null) return 0;

    const timestamp = Object.keys(lyrics());

    let index = 0;
    for (; index < timestamp.length; index += 1) {
      if (parseInt(timestamp[index + 1]) > progress() + 1225) {
        break;
      }
    }

    return timestamp[index];
  });

  window.ipcRenderer.on('update', async (_, message) => {
    const data: UpdateData = message.data;

    setOriginalData(data);

    setStatus(data.status);
    setTitle(data.title);
    setArtist(data.artists.join(', '));
    setProgress(data.progress);
    setDuration(data.duration);
    setCoverUrl(data.cover_url);
  });

  createEffect(on([title, coverUrl, lyricMapper], async () => {
    const data = originalData();
    const mapper = lyricMapper();

    if (!data) return;
    const id: number | undefined = mapper[`${data.title}:${data.cover_url}`];

    const lyric = (
      typeof id === 'number'
        ? (await window.ipcRenderer.invoke('get-lyric-by-id', id) ?? data)
        : await window.ipcRenderer.invoke('get-lyric', data)
    );

    if (lyric?.lyric) setLyrics(lyric.lyric);
    else setLyrics(null);
  }));

  return (
    <div
      class={`
        fixed w-fit h-fit
        flex flex-col gap-4
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
        'margin-left': `${config()?.windowPosition.left ?? 0}px`,
        'margin-right': `${config()?.windowPosition.right ?? 0}px`,
        'margin-top': `${config()?.windowPosition.top ?? 0}px`,
        'margin-bottom': `${config()?.windowPosition.bottom ?? 0}px`,
      }}
    >
      <TransitionGroup name={'lyric'}>
        <For each={lyrics()?.[lyricIndex()] ?? []}>
          {(item, index) => (
            <LyricsItem status={status()} delay={index()}>
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
      />
    </div>
  )
};

export default App;
