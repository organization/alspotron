import { on } from 'solid-js';
import { useTransContext } from '@jellybrick/solid-i18next';
import deepmerge from 'deepmerge';

import useConfig from '../../hooks/useConfig';
import { StyleConfig } from '../../../common/config';
import { DEFAULT_STYLE } from '../../../common/constants';

const useMigrateLegacyTheme = () => {
  const [config, setConfig] = useConfig();
  const [t] = useTransContext();

  return on(config, (configData) => {
    if (!configData?.style) return;

    let count = 0;
    let name = t('setting.theme.legacy-theme');
    while(configData.themes[name]) {
      count += 1;

      name = `${t('setting.theme.legacy-theme')}-${count}`;
    }

    const style: StyleConfig = deepmerge(DEFAULT_STYLE, {
      ...configData.style,
      lyric: {
        ...configData.style.lyric,
        direction: config()?.windowPosition?.direction ?? 'column',
        nextLyric: config()?.lyric?.nextLyric ?? 0,
        previousLyric: config()?.lyric?.previousLyric ?? 0,
      }
    });

    setConfig({
      themes: {
        [name]: style,
      },
      selectedTheme: name,
      lyric: undefined,
      style: undefined,
    });
  });
};

export default useMigrateLegacyTheme;
