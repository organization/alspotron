import { deepmerge } from 'deepmerge-ts';

import { Config, StyleConfig, LEGACY_Config0_16_0 } from '../../../../common/schema';
import { getTranslation } from '../../../../common/intl';
import { DEFAULT_CONFIG, DEFAULT_STYLE } from '../../../../common/constants';
import { Migrator } from '../types';

export const LEGACY_migrator0_16_0: Migrator = {
  config: (data: unknown) => {
    const configData = data as LEGACY_Config0_16_0;
    let name: string;

    if (configData?.language) {
      name = getTranslation('setting.theme.legacy-theme', configData.language);
    } else {
      name = getTranslation('setting.theme.preset.default', DEFAULT_CONFIG.language);
    }

    return {
      version: 1,
      selectedTheme: name,
      appTheme: DEFAULT_CONFIG.appTheme,

      windowPosition: {
        anchor: configData?.windowPosition?.anchor ?? DEFAULT_CONFIG.windowPosition.anchor,
        display: configData?.windowPosition?.display ?? DEFAULT_CONFIG.windowPosition.display,
        top: configData?.windowPosition?.top ?? DEFAULT_CONFIG.windowPosition.top,
        left: configData?.windowPosition?.left ?? DEFAULT_CONFIG.windowPosition.left,
        bottom: configData?.windowPosition?.bottom ?? DEFAULT_CONFIG.windowPosition.bottom,
        right: configData?.windowPosition?.right ?? DEFAULT_CONFIG.windowPosition.right,
      },

      syncThrottle: configData?.syncThrottle ?? DEFAULT_CONFIG.syncThrottle,

      language: configData?.language ?? DEFAULT_CONFIG.language,
      developer: configData?.developer ?? DEFAULT_CONFIG.developer,

      plugins: configData?.plugins ?? DEFAULT_CONFIG.plugins,

      hardwareAcceleration: DEFAULT_CONFIG.hardwareAcceleration,
      streamingMode: DEFAULT_CONFIG.streamingMode,
      provider: DEFAULT_CONFIG.provider,
    } satisfies Config;
  },
  themeList: (_, context) => {
    const configData = context.getConfig() as LEGACY_Config0_16_0;
    const name = getTranslation('setting.theme.legacy-theme', configData.language);
    const style = deepmerge(DEFAULT_STYLE, {
      ...configData.style,
      lyric: {
        ...configData.style?.lyric,
        direction: configData?.windowPosition?.direction ?? 'column',
        nextLyric: configData?.lyric?.nextLyric ?? 0,
        previousLyric: configData?.lyric?.previousLyric ?? 0,
      }
    }) satisfies StyleConfig;

    return {
      [name]: style,
    };
  },
};
