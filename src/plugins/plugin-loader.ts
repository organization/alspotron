import fs from 'node:fs/promises';
import path from 'node:path';

import z from 'zod';

import v1loader from './v1/v1-loader';

import { Plugin, PluginEventMap } from '../../common/plugin';
import { errorSync } from '../../utils/error';

const manifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  author: z.string(),
  version: z.string().optional(),
  versionCode: z.number(),
  pluginVersion: z.number(),
}).passthrough();

export type Loader = (pluginPath: string, manifest: z.infer<typeof manifestSchema>) => Promise<Plugin>;

class PluginLoader {
  private plugins: Plugin[] = [];
  private pluginPathList: Record<string, string | undefined> = {};
  private pluginState: Record<string, 'enable' | 'disable'> = {};

  constructor(pluginPathList: Record<string, string | undefined>, pluginState?: Record<string, 'enable' | 'disable'>) {
    this.pluginPathList = pluginPathList;
    if (pluginState) this.pluginState = pluginState;
  }

  public async setPluginState(pluginId: string, state: 'enable' | 'disable'): Promise<void> {
    this.pluginState[pluginId] = state;

    if (state === 'enable') {
      const path = this.pluginPathList[pluginId];
      const index = this.plugins.findIndex((plugin) => plugin.id === pluginId);
      if (typeof path !== 'string') throw Error('Plugin path not found');

      const newPlugin = await this.loadPlugin(path);

      this.plugins[index] = newPlugin;
    }
    if (state === 'disable') this.plugins.forEach((plugin) => plugin.id === pluginId && plugin.js.off?.());
  }
  public getPluginState(pluginId: string): 'enable' | 'disable' | undefined {
    return this.pluginState[pluginId];
  }

  public async loadPlugins(): Promise<void> {
    const pathList = Object.values(this.pluginPathList);
    await Promise.all(pathList.map(async (path) => path && this.addPlugin(path)));
  }

  public async addPlugin(path: string): Promise<Plugin> {
    try {
      const newPlugin = await this.loadPlugin(path);

      this.plugins.push(newPlugin);

      return newPlugin;
    } catch (e) {
      const error = Error(`Failed to load plugin ${path}`);
      error.cause = e;

      throw error;
    }
  }

  public async reloadPlugin(plugin: Plugin): Promise<Plugin> {
    const path = this.pluginPathList[plugin.id];
    if (typeof path !== 'string') throw Error('Plugin path not found');

    this.unloadPlugin(plugin);
    return this.addPlugin(path);
  }

  public getPlugins(): Plugin[] {
    return this.plugins;
  }

  public unloadPlugin(plugin: Plugin): void {
    const index = this.plugins.indexOf(plugin);
    if (index !== -1) {
      if (this.pluginState[plugin.id] === 'enable') plugin.js.off?.();
      this.plugins.splice(index, 1);
    }
  }

  public emit<Event extends keyof PluginEventMap>(plugin: Plugin, event: Event, ...args: Parameters<PluginEventMap[Event]>): void {
    if (this.pluginState[plugin.id] !== 'enable') return;

    plugin.js?.listeners[event]?.forEach((callback) => {
      callback(...args as [never, never]);
    });
  }

  public broadcast<Event extends keyof PluginEventMap>(event: Event, ...args: Parameters<PluginEventMap[Event]>): void {
    this.plugins.forEach((plugin) => this.emit(plugin, event, ...args));
  }
  
  private async loadPlugin(pluginPath: string): Promise<Plugin> {
    const stats = await fs.stat(pluginPath);
    
    if (!stats.isDirectory()) throw Error(`${pluginPath} Plugin is not a directory`);

    const manifest = await fs.readFile(path.join(pluginPath, 'manifest.json'), 'utf-8').catch(() => {
      throw Error('Manifest not found')
    });
    
    const [manifestJson, error] = errorSync(() => manifestSchema.parse(JSON.parse(manifest)));
    if (error || manifestJson === null) {
      console.error(error);
      throw Error('Manifest is not valid');
    }

    let newPlugin: Plugin | null = null;
    if (manifestJson.pluginVersion === 1) newPlugin = await v1loader(pluginPath, manifestJson);

    if (!newPlugin) throw Error('Plugin version is not supported')

    return newPlugin;
  }

}

export default PluginLoader;
