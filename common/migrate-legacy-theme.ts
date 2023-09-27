import deepmerge from 'deepmerge';

import { Config, StyleConfig } from './config';
import { DEFAULT_STYLE } from './constants';
import { getTranslation } from './intl';

const migrateLegacyTheme = (configData: Config): Partial<Config> | null => {
  if (!configData?.style) return null;

  const prefix = getTranslation('setting.theme.legacy-theme', configData.language);
  let count = 0;
  let name = prefix;
  while(configData.themes?.[name]) {
    count += 1;

    name = `${prefix}-${count}`;
  }

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
    themes: {
      [name]: style,
    },
    selectedTheme: name,
    lyric: undefined,
    style: undefined,
  };
};

export default migrateLegacyTheme;
