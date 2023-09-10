import { For } from 'solid-js';
import { Trans } from '@jellybrick/solid-i18next';

import Card from '../../components/Card';

import PluginCard from '../components/PluginCard';

import usePlugins from '../../hooks/usePlugins';

import type { JSX } from 'solid-js';

const PluginContainer = () => {
  const { plugins, refresh } = usePlugins();

  const onAddPlugin: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> = async (event) => {
    const file = event.target.files?.item(0);

    await window.ipcRenderer.invoke('add-plugin', file?.path);
    refresh();
  };

  return (
    <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 p-4 fluent-scrollbar'}>
      <div class={'text-3xl mb-1'}>
        <Trans key={'setting.title.plugin'} />
      </div>
      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.plugin.setting'} />
      </div>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <Trans key={'setting.plugin.add-plugin'} />
        <label for={'plugin'}>
          <a class={'btn-primary'}>
        <Trans key={'setting.plugin.add-plugin.from-file'} />
          </a>
          <input id={'plugin'} type={'file'} class={'hidden'} accept={'application/zip'} onInput={onAddPlugin} />
        </label>
      </Card>
      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.plugin.loaded-plugin'} />
      </div>
      <For each={plugins()}>
        {(plugin) => <PluginCard plugin={plugin} state={plugin.state} />}
      </For>
    </div>
  );
};

export default PluginContainer;
