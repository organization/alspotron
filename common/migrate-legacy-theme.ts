import deepmerge from 'deepmerge';

import { Config, StyleConfig } from './config';
import { DEFAULT_STYLE } from './constants';
import { getTranslation } from './intl';

const migrateLegacyTheme = (configData: Config): [Partial<Config>, [string, StyleConfig]] | null => {
  if (!configData?.style) return null;

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

  return [
    {
      selectedTheme: name,
      lyric: undefined,
      style: undefined,
    },
    [name, style],
  ];
};

export default migrateLegacyTheme;
