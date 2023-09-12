import { For, createSignal } from 'solid-js';
import { Trans, useTransContext } from '@jellybrick/solid-i18next';

import PluginCard from '../components/PluginCard';

import Card from '../../components/Card';
import Modal from '../../components/Modal';
import usePlugins from '../../hooks/usePlugins';

import type { JSX } from 'solid-js';

const PluginContainer = () => {
  const [t] = useTransContext();
  const { plugins, refresh } = usePlugins();

  const [open, setOpen] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);

  const pluginIdList = () => plugins().map((plugin) => plugin.id);

  const onAddPlugin: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> = async (event) => {
    const file = event.target.files?.item(0);

    const error = await window.ipcRenderer.invoke('add-plugin', file?.path) as Error | null;

    if (error) {
      setOpen(true);
      setError(error);
    }

    refresh();
  };
  const reloadPlugins = async () => {
    await Promise.all(pluginIdList().map((id) => window.ipcRenderer.invoke('reload-plugin', id)));

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
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <Trans key={'setting.plugin.reload-all-plugins'} />
        <button class={'btn-primary'} onClick={reloadPlugins}>
          <Trans key={'setting.plugin.reload'} />
        </button>
      </Card>
      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.plugin.loaded-plugin'} />
      </div>
      <For each={pluginIdList()}>
        {(id) => <PluginCard id={id} />}
      </For>
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
        <div class={'text-white text-lg'}>
          {t('setting.plugin.load-plugin-failed')}
        </div>
        <div>
          {error()?.name}
          {error()?.message}
        </div>
        <pre>
          <code>
            {JSON.stringify(error(), null, 2)}
          </code>
        </pre>
      </Modal>
    </div>
  );
};

export default PluginContainer;
