/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { useNavigate, useParams } from '@solidjs/router';

import { For, Switch as SwitchFlow, Match } from 'solid-js';

import { Marquee } from '@suyongs/solid-utility';

import { SelectOption, SettingOption } from '../../../common/plugin';
import Card from '../../components/Card';
import Switch from '../../components/Switch';
import Selector from '../../components/Select';
import useConfig from '../../hooks/useConfig';
import usePlugins from '../../hooks/usePlugins';

const PluginSettingsContainer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useConfig();
  const [t] = useTransContext();
  const { plugins, refresh } = usePlugins();

  const plugin = () => plugins().find((it) => it.id === params.id);

  const togglePluginState = async () => {
    const state = await window.ipcRenderer.invoke('get-plugin-state', params.id) as 'disable' | 'enable';
    
    const newState = state === 'enable' ? 'disable' : 'enable';
    await window.ipcRenderer.invoke('set-plugin-state', params.id, newState);

    refresh();
  }
  const deletePlugin = async () => {
    await window.ipcRenderer.invoke('remove-plugin', params.id);
    navigate('/plugin');
  };
  const onPluginPage = () => {
    navigate('/plugin');
  };
  const setOption = async (setting: SettingOption, value: unknown) => {
    const id = plugin()?.id;
    if (!id) return;

    await setConfig({ plugins: { config: { [id]: { [setting.key]: value } } } });
  }

  return(
    <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 p-4 fluent-scrollbar'}>
      <div class={'text-3xl mb-1 flex justify-start items-center gap-2 select-none'}>
        <span class={'text-3xl opacity-80 hover:opacity-100'} onClick={onPluginPage}>
          <Trans key={'setting.title.plugin'} />
        </span>
        <svg class={'w-4 h-4'} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.47 4.22a.75.75 0 0 0 0 1.06L15.19 12l-6.72 6.72a.75.75 0 1 0 1.06 1.06l7.25-7.25a.75.75 0 0 0 0-1.06L9.53 4.22a.75.75 0 0 0-1.06 0Z" class={'fill-black dark:fill-white'} />
        </svg>
        <span class={'text-3xl'}>
          {plugin()?.name ?? 'Unknown'}
        </span>
      </div>
      <Card
        class={'flex flex-row justify-between items-center gap-1 mt-4'}
        subCards={[
          <div class={'flex justify-start items-start flex-col ml-[40px]'}>
            <For
              each={[
                [t('setting.plugin.id'), plugin()?.id ?? 'Unknown'],
                [t('setting.plugin.name'), plugin()?.name ?? 'Unknown'],
                [t('setting.plugin.description'), plugin()?.description ?? 'Unknown'],
                [t('setting.plugin.author'), plugin()?.author ?? 'Unknown'],
                [t('setting.plugin.version'), plugin()?.version ?? 'Unknown'],
                [t('setting.plugin.version-code'), plugin()?.versionCode ?? 'Unknown'],
                [t('setting.plugin.manifest-version'), plugin()?.pluginVersion ?? 'Unknown'],
                [t('setting.plugin.style-count'), `${plugin()?.css?.length ?? 0}개`],
                [t('setting.plugin.include-script'), plugin()?.js ? '있음' : '없음'],
              ] as [string, string][]}
            >
              {([key, value]) => (
                <div class={'w-full flex justify-start items-center'}>
                  <div class={'min-w-[128px] text-md'}>
                    {key}
                  </div>
                  <Marquee class={'w-full text-md text-gray-400'} gap={32}>
                    {value}
                  </Marquee>
                </div>
              )}
            </For>
          </div>,
          <div class={'w-full h-full flex justify-start items-center gap-3'}>
            <Switch
              value={plugin()?.state === 'enable'}
              onChange={togglePluginState}
            />
            <div class={'text-md'}>
              <Trans key={'setting.plugin.enable-plugin'} />
            </div>
            <div class={'flex-1'} />
            <button class={'btn-error'} onClick={deletePlugin}>
              <Trans key={'setting.plugin.delete-plugin'} />
            </button>
          </div>
        ]}
      >
        <svg class={'w-6 h-6 mr-4 fill-black dark:fill-white'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1.999c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001-5.524 0-10.002-4.478-10.002-10.001C1.998 6.477 6.476 1.999 12 1.999Zm0 1.5a8.502 8.502 0 1 0 0 17.003A8.502 8.502 0 0 0 12 3.5Zm-.004 7a.75.75 0 0 1 .744.648l.007.102.003 5.502a.75.75 0 0 1-1.493.102l-.007-.101-.003-5.502a.75.75 0 0 1 .75-.75ZM12 7.003a.999.999 0 1 1 0 1.997.999.999 0 0 1 0-1.997Z" class={'fill-black dark:fill-white'} />
        </svg>
        <div class={'text-lg'}>
          <Trans key={'setting.plugin.plugin-info'} options={{ name: plugin()?.name }} />
        </div>
      </Card>
      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.plugin.setting'} />
      </div>
      <For each={plugin()?.js?.settings}>
        {(setting) => (
          <Card class={'flex flex-row justify-start items-center gap-1'}>
            <div class={'w-full flex flex-col justify-center items-stretch flex-1'}>
              <div class={'w-full'}>
                {setting.name}
              </div>
              <Marquee class={'text-gray-400'} gap={18}>
                {setting.description}
              </Marquee>
            </div>
            <div class={'flex-1'} />
            <SwitchFlow>
              <Match when={setting.type === 'select'}>
                <Selector
                  options={(setting as SelectOption).options.map(({ value }) => value)}
                  value={config()?.plugins.config[plugin()?.id ?? '']?.[setting.key] as string}
                  onChange={(value) => {setOption(setting, value)}}
                  format={(option) => (setting as SelectOption).options.find((it) => it.value === option)?.label ?? option}
                />
              </Match>
              <Match when={setting.type === 'string' || setting.type === 'number'}>
                <input
                  type={setting.type === 'string' ? 'text' : 'number'}
                  class={'input'}
                  value={config()?.plugins.config[plugin()?.id ?? '']?.[setting.key] as string}
                  onChange={(event) => setOption(setting, event.target.value)}
                />
              </Match>
              <Match when={setting.type === 'boolean'}>
                <Switch
                  value={config()?.plugins.config[plugin()?.id ?? '']?.[setting.key] as boolean}
                  onChange={(checked) => setOption(setting, checked)}
                />
              </Match>
            </SwitchFlow>
          </Card>
        )}
      </For>
    </div>
  )
};

export default PluginSettingsContainer;
