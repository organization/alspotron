import fs from 'node:fs/promises';
import path from 'node:path';

import z from 'zod';

import { Plugin, PluginEventMap, PluginInterface } from '../plugin';
import { errorSync } from '../../../utils/error';

const v1ManifestSchema = z.object({
  name: z.string(),
  author: z.string(),
  version: z.string().optional(),
  versionCode: z.number(),
  pluginVersion: z.literal(1),

  css: z.array(z.string()).optional(),
  main: z.string().optional(),
});

class PluginLoader {
  private plugins: Plugin[] = [];
  private pluginFolder: string;

  constructor(pluginFolder: string) {
    this.pluginFolder = pluginFolder;
  }

  public async loadPlugins(): Promise<void> {
    const plugins = await fs.readdir(this.pluginFolder);

    await Promise.all(plugins.map(async (plugin) => {
      try {
        await this.loadPlugin(plugin);
      } catch (e) {
        console.error(`[Alspotron] Failed to load plugin ${plugin}`);
        console.error(e);
      }
    }));
  }
  
  private async loadPlugin(plugin: string): Promise<Plugin> {
    const pluginPath = path.join(this.pluginFolder, plugin);
    const stats = await fs.stat(pluginPath);
    
    if (!stats.isDirectory()) throw Error(`${plugin} Plugin is not a directory`);

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

      name: manifestJson.name,
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

    this.plugins.push(newPlugin);
    newPlugin.js?.onLoad();

    return newPlugin;
  }

  public unloadPlugin(plugin: Plugin): void {
    const index = this.plugins.indexOf(plugin);
    if (index !== -1) {
      plugin.js?.onUnload();
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
