import { Show } from 'solid-js';

import AnchoredView from './components/AnchoredView';
import LyricProgressBar from './components/LyricProgressBar';
import Lyrics from './components/Lyrics';

import useConfig from '../hooks/useConfig';
import PlayingInfoProvider from '../components/PlayingInfoProvider';

const App = () => {
  const [config] = useConfig();

  const style = () => {
    const result: Record<string, string> = {};
    const configData = config();
    
    if (configData?.style?.nowPlaying?.maxWidth) result['max-width'] = `${configData.style.nowPlaying.maxWidth}px`;
    if (configData?.style?.font) result['font-family'] = configData?.style.font;
    if (configData?.style?.fontWeight) result['font-weight'] = configData?.style.fontWeight;
    if (configData?.style?.nowPlaying?.color) result['color'] = configData?.style.nowPlaying.color;
    if (configData?.style?.nowPlaying?.background) result['background-color'] = configData?.style.nowPlaying.background;

    return Object.entries(result).map(([key, value]) => `${key}: ${value};`).join(' ');
  };

  const textStyle = () => {
    const result: Record<string, string> = {};
    const configData = config();

    if (configData?.style?.nowPlaying?.fontSize) result['font-size'] = `${configData.style.nowPlaying.fontSize}px`;
    
    return Object.entries(result).map(([key, value]) => `${key}: ${value};`).join(' ');
  };

  const progressStyle = () => {
    const result: Record<string, string> = {};
    const configData = config();

    if (configData?.style?.nowPlaying?.backgroundProgress) result['background-color'] = configData.style.nowPlaying.backgroundProgress;

    return Object.entries(result).map(([key, value]) => `${key}: ${value};`).join(' ');
  };

  return (
    <PlayingInfoProvider>
      <AnchoredView>
        <Lyrics />
        <Show when={config()?.style?.nowPlaying?.visible ?? true}>
          <LyricProgressBar
            style={style()}
            textStyle={textStyle()}
            progressStyle={progressStyle()}
          />
        </Show>
      </AnchoredView>
    </PlayingInfoProvider>
  );
};

export default App;
