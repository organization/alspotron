import { deepmerge } from '../../../../utils/merge';
import { LEGACY_Config0_16_0, LEGACY_Config0_20_0, StyleConfig } from '../../../../common/schema';
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
        anchor: configData?.windowPosition?.anchor ?? DEFAULT_CONFIG.views[0].position.anchor,
        display: configData?.windowPosition?.display ?? DEFAULT_CONFIG.views[0].position.display,
        top: configData?.windowPosition?.top ?? DEFAULT_CONFIG.views[0].position.top,
        left: configData?.windowPosition?.left ?? DEFAULT_CONFIG.views[0].position.left,
        bottom: configData?.windowPosition?.bottom ?? DEFAULT_CONFIG.views[0].position.bottom,
        right: configData?.windowPosition?.right ?? DEFAULT_CONFIG.views[0].position.right,
      },

      syncThrottle: configData?.syncThrottle ?? 3000,

      language: configData?.language ?? DEFAULT_CONFIG.language,
      developer: configData?.developer ?? DEFAULT_CONFIG.developer,

      plugins: configData?.plugins ?? DEFAULT_CONFIG.plugins,

      hardwareAcceleration: DEFAULT_CONFIG.hardwareAcceleration,
      streamingMode: DEFAULT_CONFIG.streamingMode,
      provider: DEFAULT_CONFIG.lyricProvider,
    } satisfies LEGACY_Config0_20_0;
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
