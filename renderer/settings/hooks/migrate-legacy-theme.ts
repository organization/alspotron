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
        [name]: configData.style,
      },
      style: undefined,
    });
  });
};

export default useMigrateLegacyTheme;
