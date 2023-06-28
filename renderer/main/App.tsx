import { Accessor, For, createEffect, createMemo, createSignal, on, untrack } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';

import LyricProgressBar from './components/LyricProgressBar';
import LyricsItem from './components/LyricsItem';
import { UpdateData } from '../types';
import useLyricMapper from '../hooks/useLyricMapper';

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
        fixed bottom-8 right-8 w-fit h-fit
        flex flex-col justify-start items-end gap-4
      `}
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
