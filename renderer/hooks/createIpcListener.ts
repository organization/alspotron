import { Accessor, createEffect, onCleanup } from 'solid-js';

import type { IpcRendererEvent } from 'electron';
import type { PluginEventMap } from '../../common/plugins';

export const createIpcListener = <T extends keyof PluginEventMap>(
  name: Accessor<T>,
  listener: (
    event: IpcRendererEvent,
    ...params: Parameters<PluginEventMap[T]>
  ) => ReturnType<PluginEventMap[T]>,
) => {
  createEffect(() => {
    const channel = name();

    console.log('[createIpcListener] Registering listener for', channel);
    window.ipcRenderer.on(channel, listener);
    onCleanup(() => {
      window.ipcRenderer.off(channel, listener);
      console.log('[createIpcListener] Unregistering listener for', channel);
    });
  });
};
