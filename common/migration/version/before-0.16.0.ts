import { getTranslation } from '../../intl';
import { Config, StyleConfig } from '../../../common/types';
import deepmerge from 'deepmerge';
import { DEFAULT_STYLE } from '../../constants';

type LegacyConfig = {
  style: {
    font: string;
    fontWeight: string;
    animation: string;
    animationAtOnce: boolean;
    maxHeight: number;
    proximityOpacity: number;
    proximitySensitivity: number;
    rowGap: number;

    nowPlaying: {
      color: string;
      background: string;
      backgroundProgress: string;
      fontSize: number;
      maxWidth: number;
      visible: boolean;
      stoppedOpacity: number;
    };

    lyric: {
      color: string;
      background: string;
      fontSize: number;
      maxWidth: number;
      stoppedOpacity: number;
      containerRowGap: number;
      multipleContainerRowGap: number;
      nextLyricScale: number;
      previousLyricScale: number;
      nextLyricOpacity: number;
      previousLyricOpacity: number;
    };

    userCSS: string | null;
  };

  lyric: {
    nextLyric: number;
    previousLyric: number;
  };

  windowPosition: {
    anchor: 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';
    display: number | null;
    top: number | null;
    left: number | null;
    bottom: number | null;
    right: number | null;
    direction: 'column' | 'column-reverse';
  };

  syncThrottle: number;

  language: 'ko' | 'en' | 'ja' | 'de';
  developer: boolean;

  plugins: {
    list: Record<string, string | undefined>; // id: path
    disabled: Record<string, boolean | undefined>; // id: enabled
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: Record<string, any>; // id: config
  }
}


export const migrate = (configData: LegacyConfig): Config => {
  const name = getTranslation('setting.theme.legacy-theme', configData.language);

  const style: StyleConfig = deepmerge(DEFAULT_STYLE, {
    ...configData.style,
    lyric: {
      ...configData.style.lyric,
      direction: configData?.windowPosition?.direction ?? 'column',
      nextLyric: configData?.lyric?.nextLyric ?? 0,
      previousLyric: configData?.lyric?.previousLyric ?? 0,
    }
  });

  return {
    version: 1,
    selectedTheme: name,

    windowPosition: {
      anchor: configData.windowPosition.anchor,
      display: configData.windowPosition.display,
      top: configData.windowPosition.top,
      left: configData.windowPosition.left,
      bottom: configData.windowPosition.bottom,
      right: configData.windowPosition.right,
    },

    syncThrottle: configData.syncThrottle,

    language: configData.language,
    developer: configData.developer,

    plugins: configData.plugins,
  };
};
