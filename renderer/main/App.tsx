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

    if (configData?.style) {
      const styleData = configData.style;

      if (styleData.nowPlaying) {
        const nowPlayingData = styleData.nowPlaying;

        if (nowPlayingData.maxWidth) result['max-width'] = `${nowPlayingData.maxWidth}px`;
        if (nowPlayingData.color) result['color'] = nowPlayingData.color;
        if (nowPlayingData.background) result['background-color'] = nowPlayingData.background;
      }

      if (styleData.font) result['font-family'] = styleData.font;
      if (styleData.fontWeight) result['font-weight'] = styleData.fontWeight;
    }

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
