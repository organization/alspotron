import { createSignal } from 'solid-js';

import { Plugin, PluginEventMap } from '../../common/plugins';

type UsePluginResult = {
  plugins: () => Plugin[];
  broadcast: <T extends keyof PluginEventMap>(event: T, ...args: Parameters<PluginEventMap[T]>) => void;
  refresh: () => void;
}

const [plugins, setPlugins] = createSignal<Plugin[]>([]);

const refreshPlugins = () => {
  window.ipcRenderer.invoke('get-plugin-list').then(setPlugins);
};

const broadcast = <T extends keyof PluginEventMap>(event: T, ...args: Parameters<PluginEventMap[T]>) => {
  window.ipcRenderer.invoke('broadcast-plugin', event, ...args as never[]);
};

window.addEventListener('load', () => {
  refreshPlugins();
});

const usePlugins = (): UsePluginResult => ({
  plugins,
  broadcast,
  refresh: refreshPlugins,
});

export default usePlugins;
