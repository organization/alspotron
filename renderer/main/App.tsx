import { createMemo, createSignal, Show } from 'solid-js';

import AnchoredView from './components/AnchoredView';
import LyricProgressBar from './components/LyricProgressBar';
import Lyrics from './components/Lyrics';

import { AlertView } from './components/AlertView';

import PlayingInfoProvider from '../components/PlayingInfoProvider';
import UserCSS from '../components/UserCSS';
import { userCSSSelectors, userCSSVariables } from '../utils/userCSSSelectors';
import usePluginsCSS from '../hooks/usePluginsCSS';
import useStyle from '../hooks/useStyle';
import useCurrent from '../hooks/useCurrent';

const isWindows = /Windows/.test(navigator.userAgent);
const useProximityStyle = () => {
  const style = useStyle();
  const { view } = useCurrent();
  const [distance, setDistance] = createSignal(1);

  const targetAnchorX = createMemo(() => {
    const anchor = view()?.position.anchor ?? '';
    if (anchor.includes('left')) {
      return 0;
    }

    if (anchor.includes('right')) {
      return 1;
    }

    return 0.5;
  });

  const targetAnchorY = createMemo(() => {
    const anchor = view()?.position.anchor ?? '';
    if (anchor.includes('top')) {
      return 0;
    }

    if (anchor.includes('bottom')) {
      return 1;
    }

    return 0.5;
  });

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
    if (isWindows) return;

    if (fullDimmedOpacity() === 1) {
      return;
    }

    setDistance(1);
  };

  const blendRate = createMemo(() => {
    if (distance() > 0.5) {
      return 0;
    }

    const sensitivity = style().proximitySensitivity ?? 1;
    return Math.max(0, Math.min((1 - (distance() * 2)) * sensitivity, 1));
  });
  const proximityOpacity = createMemo(() => {
    if (distance() > 0.5) return 1;
    const rate = blendRate();

    return (fullDimmedOpacity() * rate) + (1 - rate);
  });

  return {
    rate: blendRate,
    opacity: proximityOpacity,
    handles: {
      onMouseMove,
      onMouseLeave,
    },
  };
};

const App = () => {
  usePluginsCSS();

  const { view } = useCurrent();
  const style = useStyle();
  const {
    rate,
    opacity,
    handles: proximityHandles,
  } = useProximityStyle();

  return (
    <Show when={window.enabled || view()?.enabled}>
      <PlayingInfoProvider>
        <AnchoredView
          style={`${userCSSVariables['var-proximity-opacity']}: ${opacity()};`}
          classList={{
            [userCSSSelectors['wrapper--hover']]: rate() >= 1,
          }}
          {...proximityHandles}
        >
          <AlertView/>
          <Lyrics/>
          <Show when={style().nowPlaying?.visible ?? true}>
            <LyricProgressBar/>
          </Show>
        </AnchoredView>
        <UserCSS/>
      </PlayingInfoProvider>
    </Show>
  );
};

export default App;

declare global {
  interface Window {
    enabled?: boolean;
  }
}
