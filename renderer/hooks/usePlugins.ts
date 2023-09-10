import { createMemo, createSignal, onMount } from 'solid-js';

import { Plugin, PluginEventMap } from '../../common/plugin';

type PluginWithState = Plugin & { state: 'enable' | 'disable' };
type UsePluginResult = {
  plugins: () => PluginWithState[];
  broadcast: <T extends keyof PluginEventMap>(event: T, ...args: Parameters<PluginEventMap[T]>) => void;
  refresh: () => void;
}

const usePlugins = (): UsePluginResult => {
  const [plugins, setPlugins] = createSignal<Plugin[]>([]);
  const [pluginsState, setPluginsState] = createSignal<Record<string, 'enable' | 'disable'>>({});

  const refreshPlugins = () => {
    window.ipcRenderer.invoke('get-plugin-list').then(setPlugins);
    window.ipcRenderer.invoke('get-plugin-state-list').then(setPluginsState);
  };

  const pluginList = createMemo(() => plugins().map((plugin) => ({
    ...plugin,
    state: pluginsState()[plugin.id] ?? 'enable',
  })));

  const broadcast = <T extends keyof PluginEventMap>(event: T, ...args: Parameters<PluginEventMap[T]>) => {
    window.ipcRenderer.invoke('broadcast', event, ...args);
  };

  onMount(() => {
    refreshPlugins();
  });

  return {
    plugins: pluginList,
    broadcast,
    refresh: refreshPlugins,
   };
};

export default usePlugins;
