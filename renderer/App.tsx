import { createSignal } from 'solid-js';
import LyricProgressBar from './LyricProgressBar';
import LyricsItem from './LyricsItem';
import { UpdateData } from './types';

const App = () => {
  const [percent, setPercent] = createSignal(0);
  const [title, setTitle] = createSignal('Not Playing');
  const [artist, setArtist] = createSignal('N/A');
  const [status, setStatus] = createSignal('idle');

  window.ipcRenderer.on('update', function (event, message) {
    const data: UpdateData = message.data;

    // console.log(data);
    setStatus(data.status);
    setTitle(data.title);
    setArtist(data.artists.join(', '));
    setPercent(data.progress / data.duration);
  });

  return (
    <div
      class={`
        fixed bottom-8 right-8 w-fit h-fit
        flex flex-col justify-start items-end gap-4
      `}
    >
      <LyricsItem />
      <LyricsItem />
      <div />
      <LyricProgressBar
        title={title()}
        artist={artist()}
        percent={percent()}
        status={status()}
      />
    </div>
  )
};

export default App;
