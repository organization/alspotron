import { Trans, useTransContext } from '@jellybrick/solid-i18next';

import { createResource, createSignal } from 'solid-js';

import Card from '../../components/Card';
import Selector from '../../components/Select';

import useConfig from '../../hooks/useConfig';
import { getTranslation } from '../../../common/intl';
import Modal from '../../components/Modal';
import Switch from '../../components/Switch';
import useServer from '../../hooks/useServer';
import type { SettingOption } from '../../../common/plugins';
import { SettingOptionRenderer } from '../components/SettingOptionRenderer';
import { useLyricProvider } from '../../hooks/useLyricProvider';
import { DEFAULT_CONFIG } from '../../../common/constants';

const GeneralContainer = () => {
  const [t, { changeLanguage }] = useTransContext();
  const [config, setConfig] = useConfig();
  const [, restartServer] = useServer();
  const lyricProvider = useLyricProvider();

  const [sourceProviders, setSourceProviders] = createSignal<
    {
      name: string;
      options: SettingOption[];
    }[]
  >([]);
  const [open, setOpen] = createSignal(false);
  const [resetOpen, setResetOpen] = createSignal(false);
  const [resetLastOpen, setResetLastOpen] = createSignal(false);
  const [restartOpen, setRestartOpen] = createSignal(false);
  const [requireOpen, setRequireOpen] = createSignal(false);
  const [lyricProviderList, setLyricProviderList] = createSignal<string[]>([]);

  lyricProvider.list().then(setLyricProviderList);

  const [lyricProviderOptions] = createResource(lyricProvider, () =>
    lyricProvider().getOptions(config()?.language ?? DEFAULT_CONFIG.language),
  );
  const sourceProvider = () => sourceProviders().find((it) => it.name === config()?.sourceProvider);
  const sourceProviderOptions = () => sourceProvider()?.options ?? [];

  const onResetConfig = async () => {
    await window.ipcRenderer.invoke('reset-config');

    setResetLastOpen(false);
    setResetOpen(false);
  };
  const restart = async () => {
    await window.ipcRenderer.invoke('restart-application');
  };

  window.ipcRenderer.invoke('get-all-source-providers').then(setSourceProviders);

  return (
    <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 py-4 fluent-scrollbar'}>
      <div class={'text-3xl mb-1 px-4'}>
        <Trans key={'setting.title.general'} />
      </div>
      <div class={'text-md mt-4 mb-1 px-4'}>
        <Trans key={'setting.general.general-menu'} />
      </div>
      <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
        <Card class={'flex flex-row justify-between items-center gap-1'}>
          <div class={'text-md'}>
            <Trans key={'setting.general.select-language'} />
          </div>
          <Selector
            mode={'select'}
            placeholder={t('setting.general.placeholder')}
            class={'select min-w-[210px]'}
            options={['ko', 'en', 'ja', 'de']}
            value={config()?.language ?? 'ko'}
            onChange={(value) => {
              setConfig({ language: value });
              changeLanguage(value);
              setOpen(true);
            }}
            format={(str) => getTranslation('language.name', str)}
          />
        </Card>
        <Card class={'flex flex-row justify-between items-center gap-1'}>
          <div class={'text-md'}>
            <Trans key={'setting.general.streaming-mode'} />
          </div>
          <Switch
            value={config()?.streamingMode}
            onChange={(checked) => setConfig({ streamingMode: checked })}
          />
        </Card>
        <Card class={'flex flex-row justify-between items-center gap-1'}>
          <div class={'text-md'}>
            <Trans key={'setting.general.app-theme'} />
          </div>
          <Selector
            mode={'select'}
            placeholder={t('setting.general.placeholder')}
            class={'select min-w-[210px]'}
            options={['system', 'dark', 'light']}
            value={config()?.appTheme}
            onChange={(value) => {
              setConfig({ appTheme: value });
            }}
            format={(str) => t(`setting.general.app-theme.${str}`)}
          />
        </Card>
        <Card
          class={'flex flex-row justify-between items-center gap-1'}
          subCards={sourceProviderOptions().map((option) => (
            <div class={'flex flex-row justify-start items-center gap-1'}>
              <SettingOptionRenderer
                option={option}
                value={config()?.providers?.source?.config[sourceProvider()?.name ?? ''][option.key]}
                onChange={(value) => {
                  setConfig({
                    providers: {
                      ...config()?.providers,
                      source: {
                        ...config()?.providers?.source,
                        config: {
                          ...config()?.providers?.source?.config,
                          [sourceProvider()?.name ?? '']: {
                            ...config()?.providers?.source?.config[sourceProvider()?.name ?? ''],
                            [option.key]: value,
                          },
                        },
                      },
                    },
                  });
                }}
              />
            </div>
          ))}
        >
          <div class={'text-md'}>
            <Trans key={'setting.general.source-provider'} />
          </div>
          <div class={'flex-1'} />
          <Selector
            mode={'select'}
            placeholder={t('setting.general.placeholder')}
            class={'select min-w-[210px]'}
            options={sourceProviders().map((it) => it.name)}
            value={config()?.sourceProvider}
            onChange={(value) => {
              setConfig({ sourceProvider: value });
            }}
            format={(str) =>
              t(`setting.general.source-provider.${str}`, {
                defaultValue: str,
              })
            }
          />
        </Card>
        <Card
          class={'flex flex-row justify-between items-center gap-1'}
          subCards={lyricProviderOptions()?.map((option) => (
            <div class={'flex flex-row justify-start items-center gap-1'}>
              <SettingOptionRenderer
                option={option}
                value={config()?.providers?.lyric?.config[lyricProvider()?.name ?? ''][option.key]}
                onChange={(value) => {
                  setConfig({
                    providers: {
                      ...config()?.providers,
                      LYRIC: {
                        ...config()?.providers?.lyric,
                        config: {
                          ...config()?.providers?.lyric?.config,
                          [lyricProvider()?.name ?? '']: {
                            ...config()?.providers?.lyric?.config[lyricProvider()?.name ?? ''],
                            [option.key]: value,
                          },
                        },
                      },
                    },
                  });
                }}
              />
            </div>
          ))}
        >
          <div class={'text-md'}>
            <Trans key={'setting.general.lyric-provider'} />
          </div>
          <div class={'flex-1'} />
          <Selector
            mode={'select'}
            placeholder={t('setting.general.placeholder')}
            class={'select min-w-[210px]'}
            options={lyricProviderList()}
            value={config()?.lyricProvider}
            onChange={(value) => {
              setConfig({ lyricProvider: value });
            }}
            format={(str) =>
              t(`setting.general.lyric-provider.${str}`, {
                defaultValue: str,
              })
            }
          />
        </Card>
      </div>
      <div class={'text-md mt-4 mb-1 px-4'}>
        <Trans key={'setting.general.experimental'} />
      </div>
      <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
        <Card class={'flex flex-row justify-between items-center gap-1'}>
          <div class={'flex flex-col justify-center items-start'}>
            <div class={'text-md flex gap-1 items-center'}>
              <Trans key={'setting.general.fix-always-on-top.title'} />
              <svg
                class={'w-4 h-4 fill-current opacity-50'}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
              >
                <path d="M200-120q-51 0-72.5-45.5T138-250l222-270v-240h-40q-17 0-28.5-11.5T280-800q0-17 11.5-28.5T320-840h320q17 0 28.5 11.5T680-800q0 17-11.5 28.5T640-760h-40v240l222 270q32 39 10.5 84.5T760-120H200Zm80-120h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z" />
              </svg>
            </div>
            <div class={'text-xs text-black/50 dark:text-white/75'}>
              <Trans key={'setting.general.fix-always-on-top.description'} />
            </div>
          </div>
          <Switch
            value={!!config()?.experimental.alwaysOnTopFix}
            onChange={(checked) => setConfig({ experimental: { alwaysOnTopFix: checked } })}
          />
        </Card>
      </div>
      <div class={'text-md mt-4 mb-1 px-4'}>
        <Trans key={'setting.general.developer-menu'} />
      </div>
      <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
        <Card class={'flex flex-row justify-between items-center gap-1'}>
          <div class={'text-md'}>
            <Trans key={'setting.general.restart-server'} />
          </div>
          <button
            class={'btn-primary'}
            onClick={restartServer}
          >
            <Trans key={'setting.general.restart'} />
          </button>
        </Card>
        <Card class={'flex flex-row justify-between items-center gap-1'}>
          <div class={'text-md'}>
            <Trans key={'setting.general.restart-program'} />
          </div>
          <button
            class={'btn-primary'}
            onClick={() => setRestartOpen(true)}
          >
            <Trans key={'setting.general.restart'} />
          </button>
        </Card>
        <Card class={'flex flex-row justify-between items-center gap-1'}>
          <div class={'text-md'}>
            <Trans key={'setting.general.hardware-acceleration'} />
          </div>
          <div class={'flex-1'} />
          <Switch
            value={config()?.hardwareAcceleration}
            onChange={(checked) => {
              setConfig({ hardwareAcceleration: checked });
              setTimeout(() => {
                setRequireOpen(true);
              }, 0);
            }}
          />
        </Card>
        <Card
          expand={config()?.developer}
          subCards={
            config()?.developer
              ? [
                  <div
                    class={'w-full h-full flex justify-start items-center'}
                    onClick={() => window.ipcRenderer.invoke('open-devtool', 'lyrics')}
                  >
                    <div class={'text-md'}>
                      <Trans key={'tray.devtools.lyrics.label'} />
                    </div>
                    <div class={'flex-1'} />
                    <svg
                      class={'w-[16px] h-[16px] fill-none'}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
                        class={'fill-black dark:fill-white'}
                      />
                    </svg>
                  </div>,
                  <div
                    class={'w-full h-full flex justify-start items-center'}
                    onClick={() => window.ipcRenderer.invoke('open-devtool', 'settings')}
                  >
                    <div class={'text-md'}>
                      <Trans key={'tray.devtools.setting.label'} />
                    </div>
                    <div class={'flex-1'} />
                    <svg
                      class={'w-[16px] h-[16px] fill-none'}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
                        class={'fill-black dark:fill-white'}
                      />
                    </svg>
                  </div>,
                ]
              : undefined
          }
          class={'flex flex-row justify-between items-center gap-1'}
        >
          <div class={'text-md'}>
            <Trans key={'setting.general.developer'} />
          </div>
          <div class={'flex-1'} />
          <Switch
            value={config()?.developer}
            onChange={(checked) => setConfig({ developer: checked })}
          />
        </Card>
      </div>
      <div class={'text-md mt-4 mb-1 px-4'}>
        <Trans key={'setting.general.dangerous-menu'} />
      </div>
      <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
        <Card class={'flex flex-row justify-between items-center gap-1'}>
          <div class={'text-md'}>
            <Trans key={'setting.general.reset-config'} />
          </div>
          <button
            class={'btn-error'}
            onClick={() => setResetOpen(true)}
          >
            <Trans key={'setting.general.reset'} />
          </button>
        </Card>
      </div>
      <Modal
        open={requireOpen()}
        onClose={() => setRequireOpen(false)}
        class={'max-w-[500px]'}
        buttons={[
          {
            type: 'positive',
            name: t('common.close'),
            onClick: () => setRequireOpen(false),
          },
        ]}
      >
        <div class={'text-white text-lg'}>{t('setting.general.require-alert')}</div>
      </Modal>
      <Modal
        open={restartOpen()}
        onClose={() => setRestartOpen(false)}
        class={'max-w-[500px]'}
        buttons={[
          {
            name: t('common.cancel'),
            onClick: () => setRestartOpen(false),
          },
          {
            type: 'negative',
            name: t('setting.general.restart'),
            onClick: () => {
              setRestartOpen(false);
              restart();
            },
          },
        ]}
      >
        <div class={'text-xl mb-2'}>
          <Trans key={'setting.general.restart-alert-title'} />
        </div>
        <div class={'text-md mb-1'}>
          <Trans key={'setting.general.restart-alert'} />
        </div>
      </Modal>
      <Modal
        open={resetOpen()}
        onClose={() => setResetOpen(false)}
        class={'max-w-[500px]'}
        buttons={[
          {
            name: t('common.cancel'),
            onClick: () => setResetOpen(false),
          },
          {
            type: 'negative',
            name: t('setting.general.reset'),
            onClick: () => {
              setResetOpen(false);
              setResetLastOpen(true);
            },
          },
        ]}
      >
        <div class={'text-xl mb-2'}>
          <Trans key={'setting.general.reset-alert-title'} />
        </div>
        <div class={'text-md mb-1'}>
          <Trans key={'setting.general.reset-alert'} />
        </div>
      </Modal>
      <Modal
        open={resetLastOpen()}
        onClose={() => setResetLastOpen(false)}
        class={'max-w-[500px]'}
        buttons={[
          {
            type: 'negative',
            name: t('setting.general.reset'),
            onClick: () => {
              onResetConfig();
            },
          },
          {
            name: t('common.cancel'),
            onClick: () => setResetLastOpen(false),
          },
        ]}
      >
        <div class={'text-xl mb-2'}>
          <Trans key={'setting.general.reset-alert-title'} />
        </div>
        <div class={'text-md mb-1'}>
          <Trans key={'setting.general.reset-last-alert'} />
        </div>
      </Modal>
      <Modal
        open={open()}
        onClose={() => setOpen(false)}
        buttons={[
          {
            type: 'positive',
            name: t('common.okay'),
            onClick: () => setOpen(false),
          },
        ]}
      >
        <div class={'text-white text-lg'}>{t('setting.general.language.alert')}</div>
      </Modal>
    </div>
  );
};

export default GeneralContainer;
