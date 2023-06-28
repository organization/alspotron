import { Accessor, For, createMemo, createSignal } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';

import LyricProgressBar from './components/LyricProgressBar';
import LyricsItem from './components/LyricsItem';
import { UpdateData } from '../types';

const App = () => {
  const [progress, setProgress] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [title, setTitle] = createSignal('Not Playing');
  const [artist, setArtist] = createSignal('N/A');
  const [status, setStatus] = createSignal('idle');
  const [coverUrl, setCoverUrl] = createSignal<string>();
  const [lyrics, setLyrics] = createSignal<Record<string, string[]>>({});

  const lyricIndex = createMemo(() => {
    const timestamp = Object.keys(lyrics());

    let index = 0;
    for (; index < timestamp.length; index += 1) {
      if (parseInt(timestamp[index + 1]) > progress() + 1225) {
        break;
      }
    }

    return timestamp[index];
  });

  window.ipcRenderer.on('update', async (event, message) => {
    const data: UpdateData = message.data;

    if (title() !== data.title) {
      const lyric = await window.ipcRenderer.invoke('get-lyric', data);

      if (lyric?.lyric) setLyrics(lyric.lyric);
      // else setLyrics({});
    }

    setStatus(data.status);
    setTitle(data.title);
    setArtist(data.artists.join(', '));
    setProgress(data.progress);
    setDuration(data.duration);
    setCoverUrl(data.cover_url);
  });

  return (
    <div
      class={`
        fixed bottom-8 right-8 w-fit h-fit
        flex flex-col justify-start items-end gap-4
      `}
    >
      <TransitionGroup name={'lyric'}>
        <For each={lyrics()[lyricIndex()]}>
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
