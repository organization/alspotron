import { deepmerge } from 'deepmerge-ts';

import { Config, StyleConfig, LEGACY_Config0_16_0 } from '../../../../common/types';
import { getTranslation } from '../../../../common/intl';
import { DEFAULT_CONFIG, DEFAULT_STYLE } from '../../../../common/constants';
import { Migrator } from '../types';

export const LEGACY_migrator0_16_0: Migrator = {
  config: (data: unknown) => {
    const configData = data as LEGACY_Config0_16_0;
    const name = getTranslation('setting.theme.legacy-theme', configData.language);

    return {
      version: 1,
      selectedTheme: name,

      windowPosition: {
        anchor: configData.windowPosition.anchor,
        display: configData.windowPosition.display,
        top: configData.windowPosition.top ?? DEFAULT_CONFIG.windowPosition.top,
        left: configData.windowPosition.left ?? DEFAULT_CONFIG.windowPosition.left,
        bottom: configData.windowPosition.bottom ?? DEFAULT_CONFIG.windowPosition.bottom,
        right: configData.windowPosition.right ?? DEFAULT_CONFIG.windowPosition.right,
      },

      syncThrottle: configData.syncThrottle,

      language: configData.language,
      developer: configData.developer,

      plugins: configData.plugins,

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
