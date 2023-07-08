import { Show } from 'solid-js';
import PlayingInfoProvider from '../components/PlayingInfoProvider';
import useConfig from '../hooks/useConfig';
import AnchoredView from './components/AnchoredView';
import LyricProgressBar from './components/LyricProgressBar';
import Lyrics from './components/Lyrics';

const App = () => {
  void window.ipcRenderer.invoke('start');
  const [config] = useConfig();

  return (
    <PlayingInfoProvider>
      <AnchoredView>
        <Lyrics />
        <Show when={config()?.style?.nowPlaying?.visible ?? true}>
          <LyricProgressBar
            style={`
              max-width: ${config()?.style.nowPlaying.maxWidth}px;
              font-family: ${config()?.style.font};
              font-weight: ${config()?.style.fontWeight};
              color: ${config()?.style.nowPlaying.color};
              background-color: ${config()?.style.nowPlaying.background};
            `}
            textStyle={`
              font-size: ${config()?.style.nowPlaying.fontSize}px;
            `}
            progressStyle={`
              background-color: ${config()?.style.nowPlaying.backgroundProgress};
            `}
          />
        </Show>
      </AnchoredView>
    </PlayingInfoProvider>
  );
};

export default App;
