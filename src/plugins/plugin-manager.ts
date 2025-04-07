import PluginLoader, { type PluginLoaderOptions } from './plugin-loader';

import type { Plugin, PluginEventMap, PluginState } from '../../common/plugins';
import type { Config } from '../../common/schema';

import { SpiceifyIntegrationPlugin } from '../../plugins';

import type { PartialDeep } from 'type-fest';
import type { PredefinedPlugin } from '../../plugins';

export interface PluginManagerOptions extends PluginLoaderOptions {
  config: () => Config['plugins'];
  set: (config: PartialDeep<Config['plugins']>) => void;
}

class PluginManager {
  private loader: PluginLoader;

  private plugins: Plugin[] = [];
  private config: () => Config['plugins'];
  private setConfig: (config: PartialDeep<Config['plugins']>) => void;

  private predefinedPlugins: PredefinedPlugin[] = [SpiceifyIntegrationPlugin];

  constructor(options: PluginManagerOptions) {
    this.config = options.config;
    this.loader = new PluginLoader({
      folder: options.folder,
    });
    this.setConfig = options.set;
  }

  public async setPluginState(idOrPlugin: string | Plugin, state: 'enable' | 'disable'): Promise<Plugin | null> {
    const plugin =
      typeof idOrPlugin === 'string' ? this.plugins.find((plugin) => plugin.id === idOrPlugin) : idOrPlugin;
    if (!plugin) return null;

    if (state === 'enable') {
      const index = this.plugins.findIndex((target) => target.id === plugin.id);
      const loadedPlugin = await this.loader.loadFromFolder(plugin.path);
      if (loadedPlugin instanceof Error) return null;

      loadedPlugin.state = state;
      this.plugins[index] = loadedPlugin;
      this.setConfig({ disabled: { [plugin.id]: false } });

      return loadedPlugin;
    }
    if (state === 'disable') {
      plugin.state = state;
      this.loader.unloadPlugin(plugin);
      this.setConfig({ disabled: { [plugin.id]: true } });

      return plugin;
    }

    return null;
  }

  public async loadPredefinedPlugins(): Promise<void> {
    const pluginList = await Promise.all(
      this.predefinedPlugins.map((it) =>
        this.loader.loadFromProvider(it.provider ?? null, it.cssList, it.manifest, 'enable'),
      ),
    );

    this.plugins.push(...pluginList.filter(Boolean));
  }

  public async loadPluginsFromConfig(): Promise<void> {
    const pluginPathList = Object.entries(this.config().list);
    const disablePluginMap = this.config().disabled;

    await Promise.all(
      pluginPathList.map(async ([id, path]) => {
        const isDisabled = disablePluginMap[id];

        if (typeof path !== 'string') return null;
        return this.addPlugin(path, isDisabled ? 'disable' : 'enable');
      }),
    );
  }

  public async addPlugin(path: string, state: PluginState = 'enable'): Promise<Plugin | Error> {
    const plugin = await this.loader.loadFromFile(path, state);
    if (plugin instanceof Error) return plugin;

    this.plugins.push(plugin);
    this.setConfig({ list: { [plugin.id]: path } });
    return plugin;
  }

  public removePlugin(plugin: Plugin): void {
    const index = this.plugins.indexOf(plugin);
    if (index >= 0) {
      this.loader.unloadPlugin(plugin);
      this.plugins.splice(index, 1);
      this.setConfig({ list: { [plugin.id]: undefined } });
    }
  }

  public async reloadPlugin(plugin: Plugin): Promise<Plugin | Error> {
    const path = this.getPluginPath(plugin.id);
    const index = this.plugins.indexOf(plugin);
    if (typeof path !== 'string' || index < 0) return Error('Plugin not found');

    this.loader.unloadPlugin(plugin);
    const reloadedPlugin = await this.loader.loadFromFile(path);
    if (reloadedPlugin instanceof Error) return reloadedPlugin;

    this.plugins[index] = reloadedPlugin;
    return reloadedPlugin;
  }

  public getPlugins(): Plugin[] {
    return this.plugins;
  }

  public emit<Event extends keyof PluginEventMap>(
    plugin: Plugin,
    event: Event,
    ...args: Parameters<PluginEventMap[Event]>
  ): void {
    this.loader.runPlugin(plugin, (plugin) => {
      plugin.js?.listeners[event]?.forEach((callback) => {
        (callback as (...args: unknown[]) => void)(...args);
      });
    });
  }

  public broadcast<Event extends keyof PluginEventMap>(event: Event, ...args: Parameters<PluginEventMap[Event]>): void {
    this.plugins.forEach((plugin) => this.emit(plugin, event, ...args));
  }

  private getPluginPath(idOrPlugin: string | Plugin): string | undefined {
    if (typeof idOrPlugin === 'string') return this.config().list[idOrPlugin];

    return this.config().list[idOrPlugin.id];
  }
}

export default PluginManager;
