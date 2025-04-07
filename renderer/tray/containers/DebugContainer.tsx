import { For } from 'solid-js';

import { Trans, useTransContext } from '@jellybrick/solid-i18next';

import { Header } from '../components';
import useConfig from '../../hooks/useConfig';

export const DebugContainer = () => {
  const [config] = useConfig();
  const [t] = useTransContext();

  const onDebug = (target: 'lyrics' | 'settings' | 'tray') => {
    window.ipcRenderer.invoke('open-devtool', target);
  };
  const onMainDebug = (index: number) => {
    window.ipcRenderer.invoke('open-devtool', 'main', index);
  };

  return (
    <div
      class={'w-full h-full flex flex-col justify-start items-stretch gap-2 p-4 fluent-scrollbar !overflow-x-hidden'}
    >
      <Header title={t('tray.devtools.label')} />
      <For each={config()?.views}>
        {(_, index) => (
          <button
            class={'w-full btn-text'}
            onClick={() => onMainDebug(index())}
          >
            <Trans
              key={'tray.devtools.lyric-viewer.label'}
              options={{ index: index() }}
            />
          </button>
        )}
      </For>
      <button
        class={'w-full btn-text'}
        onClick={() => onDebug('lyrics')}
      >
        <Trans key={'tray.devtools.lyrics.label'} />
      </button>
      <button
        class={'w-full btn-text'}
        onClick={() => onDebug('settings')}
      >
        <Trans key={'tray.devtools.setting.label'} />
      </button>
      <button
        class={'w-full btn-text'}
        onClick={() => onDebug('tray')}
      >
        <Trans key={'tray.devtools.tray.label'} />
      </button>
    </div>
  );
};
