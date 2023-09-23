import { on } from 'solid-js';
import { useTransContext } from '@jellybrick/solid-i18next';

import useConfig from '../../hooks/useConfig';

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

    setConfig({
      themes: {
        [name]: {
          ...configData.style,
          lyric: {
            nextLyric: config()?.lyric?.nextLyric ?? 0,
            previousLyric: config()?.lyric?.previousLyric ?? 0,
          }
        },
      },
      selectedTheme: name,
      style: undefined,
    });
  });
};

export default useMigrateLegacyTheme;
