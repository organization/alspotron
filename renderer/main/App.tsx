import useConfig from '../hooks/useConfig';
import AnchoredView from './components/AnchoredView';
import LyricProgressBar from './components/LyricProgressBar';
import Lyrics from './components/Lyrics';
import PlayingInfoProvider from './components/PlayingInfoProvider';

const App = () => {
  const [config] = useConfig();

  return (
    <PlayingInfoProvider>
      <AnchoredView>
        <Lyrics />
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
      </AnchoredView>
    </PlayingInfoProvider>
  );
};

export default App;
