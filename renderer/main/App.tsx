import { Show, createRenderEffect, createSignal, getOwner, on, runWithOwner } from 'solid-js';

import AnchoredView from './components/AnchoredView';
import LyricProgressBar from './components/LyricProgressBar';
import Lyrics from './components/Lyrics';

import PlayingInfoProvider from '../components/PlayingInfoProvider';
import UserCSS from '../components/UserCSS';
import useConfig from '../hooks/useConfig';
import { cx } from '../utils/classNames';
import { userCSSSelectors } from '../utils/userCSSSelectors';
import usePluginsCSS from '../hooks/usePluginsCSS';
import useStyle from '../hooks/useStyle';


const useProximityStyle = () => {
  const [config] = useConfig();
  const style = useStyle();
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

  const fullDimmedOpacity = () => style().proximityOpacity ?? 0;
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

    const sensitivity = style().proximitySensitivity ?? 1;
    const blendRate = Math.max(0, Math.min((1 - (distance() * 2)) * sensitivity, 1));
    return (fullDimmedOpacity() * blendRate) + (1 - blendRate);
  };

  const [element, elementRef] = createSignal<HTMLDivElement | null>(null);
  createRenderEffect(on(proximityOpacity, () => {
    element()?.animate([{ opacity: proximityOpacity() }], { duration: 500, fill: 'forwards' });
  }));

  return {
    ref: elementRef,
    onMouseMove,
    onMouseLeave,
  };
};

const App = () => {
  usePluginsCSS();

  const style = useStyle();

  const lyricStyle = () => {
    let result = '';
    const styleData = style();

    if (styleData?.nowPlaying.maxWidth) result += `max-width: ${styleData.nowPlaying.maxWidth}px;`;
    if (styleData?.nowPlaying.color) result += `color: ${styleData.nowPlaying.color};`;
    if (styleData?.nowPlaying.background) result += `background-color: ${styleData.nowPlaying.background};`;
    if (styleData?.font) result += `font-family: ${styleData.font};`;
    if (styleData?.fontWeight) result += `font-weight: ${styleData.fontWeight};`;

    return result;
  };

  const textStyle = () => {
    let result = '';

    const styleData = style();
    if (styleData?.nowPlaying.fontSize) result += `font-size: ${styleData.nowPlaying.fontSize}px;`;
    
    return result;
  };

  const progressStyle = () => {
    let result = '';

    const styleData = style();
    if (styleData?.nowPlaying.backgroundProgress) result += `background-color: ${styleData.nowPlaying.backgroundProgress};`;

    return result;
  };

  const proximityHandles = useProximityStyle();

  return (
    <PlayingInfoProvider>
      <AnchoredView
        class={cx('flex flex-col', userCSSSelectors.wrapper)}
        style={`row-gap: ${style()?.rowGap ?? 2}rem;`}
        {...proximityHandles}
      >
        <Lyrics />
        <Show when={style().nowPlaying?.visible ?? true}>
          <LyricProgressBar
            style={lyricStyle()}
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
