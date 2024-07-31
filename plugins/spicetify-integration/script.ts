/* eslint-disable @typescript-eslint/unbound-method */

import { ButtonOption, PluginProvider, SettingOption } from '../../common/plugins';

const translation: Record<string, Record<string, Partial<SettingOption>>> = {
  ko: {
    installSetting: {
      name: 'Spicetify 확장 설치',
      description: 'Spicetify의 재생목록을 Alspotron에서 감지할 수 있는 확장을 자동 설치합니다.',
      label: '설치',
    },
  },
  en: {
    installSetting: {
      name: 'Install Spicetify Extension',
      description: 'Automatically install an extension that allows Alspotron to detect Spicetify playlists.',
      label: 'Install'
    },
  },
};

const runner: PluginProvider = ({ useConfig, useSetting, logger }) => {
  const [config] = useConfig();

  logger.info('Spicetify Integration plugin is loaded', config().language);
  const t = (translation[config().language] ?? translation.en);

  useSetting({
    type: 'button',
    key: 'install',
    label: (t.installSetting as ButtonOption).label,
    name: t.installSetting.name!,
    description: t.installSetting.description,
    onClick: () => {
      logger.debug('install button clicked');
    },
  });
  useSetting({
    type: 'label',
    key: 'test',
    name: 'Test',
  });
};

export default runner;

/* eslint-enable @typescript-eslint/unbound-method */
