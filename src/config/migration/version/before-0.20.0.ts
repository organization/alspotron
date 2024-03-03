import { Migrator } from '../types';
import {
  Config,
  LEGACY_Config0_20_0,
  LEGACY_StyleConfig0_20_0,
  StyleConfig,
} from '../../../../common/schema';
import { DEFAULT_CONFIG, DEFAULT_STYLE } from '../../../../common/constants';

export const LEGACY_migrator0_20_0: Migrator = {
  config: (data: unknown) => {
    const configData = data as LEGACY_Config0_20_0;

    return {
      version: 2,
      views: [
        {
          enabled: true,
          theme: configData.selectedTheme,
          position: {
            anchor: configData.windowPosition.anchor,
            display: configData.windowPosition.display,
            top: configData.windowPosition.top,
            left: configData.windowPosition.left,
            bottom: configData.windowPosition.bottom,
            right: configData.windowPosition.right,
          },
        },
      ],
      appTheme: configData.appTheme,
      language: configData.language,
      developer: configData.developer,
      hardwareAcceleration: configData.hardwareAcceleration,
      streamingMode: configData.streamingMode,
      lyricProvider: configData.provider,
      playingProvider: DEFAULT_CONFIG.playingProvider,

      plugins: configData.plugins,
    } satisfies Config;
  },
  themeList: (data: unknown) => {
    const themeList = data as Record<string, LEGACY_StyleConfig0_20_0 | undefined>;

    return Object.entries(themeList).reduce((acc, [key, value]) => {
      if (value === undefined) return acc;

      const newValue: StyleConfig = {
        ...value,
        position: DEFAULT_STYLE.position,
      };

      return {
        ...acc,
        [key]: newValue,
      };
    }, {});
  }
};