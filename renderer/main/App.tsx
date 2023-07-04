import { Accessor, Show, createRenderEffect, createSignal, on } from 'solid-js';
import PlayingInfoProvider from '../components/PlayingInfoProvider';
import UserCSS from '../components/UserCSS';
import useConfig from '../hooks/useConfig';
import { cx } from '../utils/classNames';
import { userCSSSelectors } from '../utils/userCSSSelectors';
import AnchoredView from './components/AnchoredView';
import LyricProgressBar from './components/LyricProgressBar';
import Lyrics from './components/Lyrics';

const useProximityStyle = (element: Accessor<HTMLDivElement>) => {
  const [config] = useConfig();
  const [distance, setDistance] = createSignal(1);

  const targetAnchorX = () => {
    const anchor = config()?.windowPosition.anchor ?? '';
    if (anchor.includes('left')) {
      return 0;
    }

    if (anchor.includes('right')) {
      return 1;
    }

    return 0.5;
  };

  const targetAnchorY = () => {
    const anchor = config()?.windowPosition.anchor ?? '';
    if (anchor.includes('top')) {
      return 0;
    }

    if (anchor.includes('bottom')) {
      return 1;
    }

    return 0.5;
  };

  const onMouseMove = (event: MouseEvent) => {
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;

    setDistance(Math.hypot(x - targetAnchorX(), y - targetAnchorY()));
  };

  const onMouseLeave = () => {
    setDistance(1);
  };

  const proximityOpacity = () => {
    if (distance() > 0.5) {
      return 1;
    }

    const fullDimmedOpacity = config()?.style.proximityOpacity;
    const blendRate = 1 - (distance() * 2);
    return (fullDimmedOpacity * blendRate) + (1 - blendRate);
  };

  createRenderEffect(on([proximityOpacity], () => {
    element()?.animate([{ opacity: proximityOpacity() }], { duration: 500, fill: 'forwards' });
  }));

  return {
    onMouseMove,
    onMouseLeave,
  };
};

const App = () => {
  const [config] = useConfig();

  let anchoredView: HTMLDivElement;
  const handles = useProximityStyle(() => anchoredView);

  return (
    <PlayingInfoProvider>
      <AnchoredView
        ref={anchoredView}
        class={cx('flex flex-col gap-8', userCSSSelectors.wrapper)}
        {...handles}
      >
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
      <UserCSS />
    </PlayingInfoProvider>
  );
};

export default App;
