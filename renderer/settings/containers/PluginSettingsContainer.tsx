import { Trans } from '@jellybrick/solid-i18next';
import { useNavigate, useParams } from '@solidjs/router';

import { For, createEffect, createSignal, onMount } from 'solid-js';

import { Plugin } from '../../../common/plugin';
import Card from '../../components/Card';
import Switch from '../../components/Switch';

const PluginSettingsContainer = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [plugin, setPlugin] = createSignal<Plugin | null>(null);
  const [pluginState, setPluginState] = createSignal<'enable' | 'disable'>('enable');

  onMount(() => {
    refreshPlugin();
  });

  createEffect(() => {
    params.id && refreshPlugin();
  })

  const togglePluginState = async () => {
    const state = await window.ipcRenderer.invoke('get-plugin-state', params.id) as 'disable' | 'enable';
    
    const newState = state === 'enable' ? 'disable' : 'enable';
    await window.ipcRenderer.invoke('set-plugin-state', params.id, newState);

    refreshPlugin();
  }
  const deletePlugin = async () => {
    await window.ipcRenderer.invoke('remove-plugin', params.id);
    navigate('/plugin');
  };
  const onPluginPage = () => {
    navigate('/plugin');
  };
  const refreshPlugin = () => {
    window.ipcRenderer.invoke('get-plugin', params.id).then(setPlugin);
    window.ipcRenderer.invoke('get-plugin-state', params.id).then(setPluginState);
  };

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
          <div class={'flex justify-start items-start flex-col'}>
            <For
              each={[
                ['아이디', plugin()?.id ?? 'Unknown'],
                ['이름', plugin()?.name ?? 'Unknown'],
                ['설명', plugin()?.description ?? 'Unknown'],
                ['제작자', plugin()?.author ?? 'Unknown'],
                ['버전', plugin()?.version ?? 'Unknown'],
                ['버전코드', plugin()?.versionCode ?? 'Unknown'],
                ['Manifest 버전', plugin()?.pluginVersion ?? 'Unknown'],
                ['스타일 개수', `${plugin()?.css?.length ?? 0}개`],
                ['스크립트 유무', plugin()?.js ? '있음' : '없음'],
              ] as [string, string][]}
            >
              {([key, value]) => (
                <div class={'flex justify-start items-center'}>
                  <div class={' w-32 text-md'}>
                    {key}
                  </div>
                  <div class={'text-md text-gray-400'}>
                    {value}
                  </div>
                </div>
              )}
            </For>
          </div>,
          <div class={'w-full h-full flex justify-start items-center gap-3'}>
            <Switch
              value={pluginState() === 'enable'}
              onChange={togglePluginState}
            />
            <div class={'text-md'}>
              플러그인 활성화
            </div>
            <div class={'flex-1'} />
            <button class={'btn-error'} onClick={deletePlugin}>
              플러그인 삭제
            </button>
          </div>
        ]}
      >
        <div class={'text-lg'}>
          {plugin()?.name} 정보
        </div>
      </Card>
      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.plugin.setting'} />
      </div>
      
    </div>
  )
};

export default PluginSettingsContainer;
