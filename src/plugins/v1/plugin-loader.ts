import fs from 'node:fs/promises';
import path from 'node:path';

import z from 'zod';

import { Plugin, PluginEventMap, PluginInterface } from '../../../common/plugin';
import { errorSync } from '../../../utils/error';

const v1ManifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  author: z.string(),
  version: z.string().optional(),
  versionCode: z.number(),
  pluginVersion: z.literal(1),

  css: z.array(z.string()).optional(),
  main: z.string().optional(),
});

class PluginLoader {
  private plugins: Plugin[] = [];
  private pluginPathList: string[] = [];
  private pluginState: Record<string, 'enable' | 'disable'> = {};

  constructor(pluginPathList: string[], pluginState?: Record<string, 'enable' | 'disable'>) {
    this.pluginPathList = pluginPathList;
    if (pluginState) this.pluginState = pluginState;
  }

  public setPluginState(pluginId: string, state: 'enable' | 'disable'): void {
    this.pluginState[pluginId] = state;
  }
  public getPluginState(pluginId: string): 'enable' | 'disable' | undefined {
    return this.pluginState[pluginId];
  }

  public async loadPlugins(): Promise<void> {
    await Promise.all(this.pluginPathList.map(async (path) => this.addPlugin(path)));
  }

  public async addPlugin(path: string): Promise<Plugin> {
    try {
      const newPlugin = await this.loadPlugin(path);

      this.plugins.push(newPlugin);
      if (this.pluginState[newPlugin.id] === 'enable') newPlugin.js?.onLoad();

      return newPlugin;
    } catch (e) {
      const error = Error(`Failed to load plugin ${path}`);
      error.cause = e;

      throw error;
    }
  }

  public getPlugins(): Plugin[] {
    return this.plugins;
  }
  
  private async loadPlugin(pluginPath: string): Promise<Plugin> {
    const stats = await fs.stat(pluginPath);
    
    if (!stats.isDirectory()) throw Error(`${pluginPath} Plugin is not a directory`);

    const manifest = await fs.readFile(path.join(pluginPath, 'manifest.json'), 'utf-8').catch(() => {
      throw Error('Manifest not found')
    });
    
    const [manifestJson, error] = errorSync(() => v1ManifestSchema.parse(JSON.parse(manifest)));
    if (error || manifestJson === null) {
      console.error(error);
      throw Error('Manifest is not valid');
    }

    const newPlugin: Plugin = {
      css: manifestJson.css ?? [],
      manifest,

      id: manifestJson.id,
      name: manifestJson.name,
      description: manifestJson.description,
      author: manifestJson.author,
      version: manifestJson.version ?? '0.0.0',
      versionCode: manifestJson.versionCode,
      pluginVersion: manifestJson.pluginVersion,
    };

    const jsPath = `file://${path.join(pluginPath, manifestJson.main ?? '')}`;
    const pluginInstance = await import(jsPath)
      .then((module) => (module as { default: PluginInterface | undefined }).default)
      .catch((err) => {
        const error = Error(`Failed to load plugin: Cannot load "${jsPath}"`);
        error.cause = err;
        return error;
      });

    if (!(pluginInstance instanceof Error)) newPlugin.js = pluginInstance; 

    return newPlugin;
  }

  public unloadPlugin(plugin: Plugin): void {
    const index = this.plugins.indexOf(plugin);
    if (index !== -1) {
      if (this.pluginState[plugin.id] === 'enable') plugin.js?.onUnload();
      this.plugins.splice(index, 1);
    }
  }

  broadcast<Event extends keyof PluginEventMap>(event: Event, ...args: Parameters<PluginEventMap[Event]>): void {
    this.plugins.forEach((plugin) => {
      plugin.js?.listeners[event]?.forEach((callback) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        callback(...args as [any, any]);
      });
    });
  }
}

export default PluginLoader;
