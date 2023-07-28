import { Show, createRenderEffect, createSignal, on } from 'solid-js';

import AnchoredView from './components/AnchoredView';
import LyricProgressBar from './components/LyricProgressBar';
import Lyrics from './components/Lyrics';

import PlayingInfoProvider from '../components/PlayingInfoProvider';
import UserCSS from '../components/UserCSS';
import useConfig from '../hooks/useConfig';
import { cx } from '../utils/classNames';
import { userCSSSelectors } from '../utils/userCSSSelectors';


const useProximityStyle = () => {
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

  const fullDimmedOpacity = () => config()?.style.proximityOpacity ?? 0;
  const onMouseMove = (event: MouseEvent) => {
    if (fullDimmedOpacity() === 1) {
      return;
    }

    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;

    setDistance(Math.hypot(x - targetAnchorX(), y - targetAnchorY()));
  };

  const onMouseLeave = () => {
    if (fullDimmedOpacity() === 1) {
      return;
    }

    setDistance(1);
  };

  const proximityOpacity = () => {
    if (distance() > 0.5) {
      return 1;
    }

    const sensitivity = config()?.style.proximitySensitivity ?? 1;
    const blendRate = Math.max(0, Math.min((1 - (distance() * 2)) * sensitivity, 1));
    return (fullDimmedOpacity() * blendRate) + (1 - blendRate);
  };

  const [element, elementRef] = createSignal<HTMLDivElement | null>(null);
  createRenderEffect(on([proximityOpacity], () => {
    element()?.animate([{ opacity: proximityOpacity() }], { duration: 500, fill: 'forwards' });
  }));

  return {
    ref: elementRef,
    onMouseMove,
    onMouseLeave,
  };
};

const App = () => {
  const [config] = useConfig();

  const style = () => {
    let result = '';
    const configData = config();

    if (configData?.style) {
      const styleData = configData.style;

      if (styleData.nowPlaying) {
        const nowPlayingData = styleData.nowPlaying;

        if (nowPlayingData.maxWidth) result += `max-width: ${nowPlayingData.maxWidth}px;`;
        if (nowPlayingData.color) result += `color: ${nowPlayingData.color};`;
        if (nowPlayingData.background) result += `background-color: ${nowPlayingData.background};`;
      }

      if (styleData.font) result += `font-family: ${styleData.font};`;
      if (styleData.fontWeight) result += `font-weight: ${styleData.fontWeight};`;
    }

    return result;
  };

  const textStyle = () => {
    let result = '';
    const configData = config();

    if (configData?.style?.nowPlaying?.fontSize) result += `font-size: ${configData.style.nowPlaying.fontSize}px;`;
    
    return result;
  };

  const progressStyle = () => {
    let result = '';
    const configData = config();

    if (configData?.style?.nowPlaying?.backgroundProgress) result += `background-color: ${configData.style.nowPlaying.backgroundProgress};`;

    return result;
  };

  const proximityHandles = useProximityStyle();

  return (
    <PlayingInfoProvider>
      <AnchoredView
        class={cx('flex flex-col', userCSSSelectors.wrapper)}
        style={`row-gap: ${config()?.style?.rowGap ?? 2}rem;`}
        {...proximityHandles}
      >
        <Lyrics />
        <Show when={config()?.style?.nowPlaying?.visible ?? true}>
          <LyricProgressBar
            style={style()}
            textStyle={textStyle()}
            progressStyle={progressStyle()}
          />
        </Show>
      </AnchoredView>
      <UserCSS />
    </PlayingInfoProvider>
  );
};

export default App;
