import { For, createSignal, onMount } from 'solid-js';
import { Trans } from '@jellybrick/solid-i18next';

import Card from '../../components/Card';

import { Plugin } from '../../../common/plugin';
import PluginCard from '../components/PluginCard';

import type { JSX } from 'solid-js';

const PluginContainer = () => {
  const [plugins, setPlugins] = createSignal<Plugin[]>([]);

  onMount(() => {
    refreshPlugins();
  });

  const refreshPlugins = () => {
    window.ipcRenderer.invoke('get-plugin-list').then(setPlugins);
  };

  const onAddPlugin: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> = async (event) => {
    const file = event.target.files?.item(0);

    await window.ipcRenderer.invoke('add-plugin', file?.path);
    refreshPlugins();
  };

  return (
    <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 p-4 fluent-scrollbar'}>
      <div class={'text-3xl mb-1'}>
        <Trans key={'setting.title.plugin'} />
      </div>
      <div class={'text-md mt-4 mb-1'}>
        플러그인 추가/변경
      </div>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        플러그인 추가
        <label for={'plugin'}>
          <a class={'btn-primary'}>
            파일로부터 불러오기
          </a>
          <input id={'plugin'} type={'file'} class={'hidden'} accept={'application/zip'} onInput={onAddPlugin} />
        </label>
      </Card>
      <div class={'text-md mt-4 mb-1'}>
        로드된 플러그인
      </div>
      <For each={plugins()}>
        {(plugin) => <PluginCard plugin={plugin} state={'enabled'} />}
      </For>
    </div>
  );
};

export default PluginContainer;
