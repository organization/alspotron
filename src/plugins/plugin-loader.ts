import path from 'node:path';
import fs from 'node:fs/promises';

import zip from 'zip-lib';

import { loadPlugin, loadFromPath } from './v1/v1-loader';
import {
  type PluginRunner,
  type VersionedPluginRunnerOptions,
  PluginManifestSchema,
  type PluginManifest,
} from './types';

import { createLogger } from './v1/v1-logger';

import type { Plugin, PluginProvider, PluginState } from '../../common/plugins';
import { errorSync } from '../../utils/error';

export interface PluginLoaderOptions {
  folder?: string;
}

class PluginLoader {
  private folder: string;

  constructor(options: PluginLoaderOptions) {
    this.folder = options.folder ?? './plugins';
  }

  public async loadFromFolder(path: string, state: PluginState = 'enable'): Promise<Plugin | Error> {
    const plugin = await this.loadPlugin(path, state).catch((err) => err as Error);

    return plugin;
  }

  public async loadFromFile(pluginPath: string, state: PluginState = 'enable'): Promise<Plugin | Error> {
    const pluginFileName = path.basename(pluginPath).replace(/\.\w+$/, '');
    const extractPath = path.resolve(this.folder, pluginFileName);

    const extractResult = await zip.extract(pluginPath, extractPath).catch((err) => err as Error);
    if (extractResult instanceof Error) {
      const error = Error('Failed to extract plugin');
      error.cause = extractResult;

      return error;
    }

    const isNested = await fs
      .stat(path.join(extractPath, pluginFileName))
      .then(() => true)
      .catch(() => false);
    if (isNested) {
      try {
        const tempPath = path.join(extractPath, '../', `temp-${Date.now()}`);
        await fs.rename(path.join(extractPath, pluginFileName), tempPath);
        await fs.rm(extractPath, { recursive: true, force: true });
        await fs.rename(tempPath, extractPath);
      } catch (err) {
        const error = Error('Failed to extract plugin');
        error.cause = err;

        return error;
      }
    }

    return await this.loadPlugin(extractPath, state).catch((err) => err as Error);
  }

  loadFromProvider(
    provider: PluginProvider | null,
    cssList: string[],
    manifestJson: PluginManifest,
    state: PluginState = 'enable',
  ): Plugin | null {
    const versionedOption: VersionedPluginRunnerOptions = { state };

    let newPlugin: Plugin | null = null;
    if (manifestJson.manifestVersion === 1)
      newPlugin = loadPlugin(provider, cssList, manifestJson, this.runPlugin, versionedOption);

    if (!newPlugin) throw Error(`Manifest version "${manifestJson.manifestVersion}" is not supported`);

    return newPlugin;
  }

  public unloadPlugin(plugin: Plugin): Error | null {
    return this.runPlugin(plugin, (plugin) => plugin.js.off?.(), {
      message: 'Failed to unload plugin',
      force: true,
    });
  }

  public runPlugin: PluginRunner = (plugin, fn, { force, message } = {}) => {
    if (!force && plugin.state !== 'enable') return null;

    try {
      fn(plugin);
    } catch (err) {
      const logger = createLogger(plugin);
      const error = Error(message ?? 'Failed to run plugin');
      error.cause = err;

      if (err instanceof Error)
        logger.error(err.name, err.message, err.stack, err.cause, '\n', JSON.stringify(err, null, 2));
      else logger.error('Error object is not `Error`:', err);
      logger.error('Plugin will be disabled');
      return error;
    }

    return null;
  };

  private async loadPlugin(pluginPath: string, state: PluginState = 'enable'): Promise<Plugin> {
    const stats = await fs.stat(pluginPath);
    if (!stats.isDirectory()) throw Error(`"${pluginPath}" is not a directory`);

    const manifest = await fs.readFile(path.join(pluginPath, 'manifest.json'), 'utf-8').catch((err) => {
      const error = Error('Cannot load manifest.json');
      error.cause = err;

      throw error;
    });

    const [manifestJson, err] = errorSync(() => PluginManifestSchema.parse(JSON.parse(manifest)));
    if (err || manifestJson === null) {
      const error = Error('Manifest is not valid');
      error.cause = err;

      throw error;
    }

    const versionedOption: VersionedPluginRunnerOptions = { state };

    let newPlugin: Plugin | null = null;
    if (manifestJson.manifestVersion === 1)
      newPlugin = await loadFromPath(pluginPath, manifestJson, this.runPlugin, versionedOption);

    if (!newPlugin) throw Error(`Manifest version "${manifestJson.manifestVersion}" is not supported`);

    return newPlugin;
  }
}

export default PluginLoader;
