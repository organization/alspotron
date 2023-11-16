import path from 'node:path';
import fs from 'node:fs/promises';

import { z } from 'zod';

import { createLogger } from './v1-logger';

import { Plugin, PluginContext, PluginProvider } from '../../../common/plugins';
import { Json } from '../../../utils/types';
import { VersionedPluginLoader } from '../types';
import { config } from '../../config';

const v1ManifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  author: z.string(),
  version: z.string().optional(),
  versionCode: z.number(),
  manifestVersion: z.literal(1),

  css: z.array(z.string()).optional(),
  main: z.string().optional(),
}).passthrough();

const loader: VersionedPluginLoader = async (pluginPath, rawManifest, runner, options) => {
  const manifest = v1ManifestSchema.parse(rawManifest);

  const newPlugin: Plugin = {
    rawManifest: JSON.stringify(manifest),
    manifest: manifest as Json,
    js: {
      listeners: {},
      settings: [],
      overrides: {},
    },

    id: manifest.id,
    name: manifest.name,
    description: manifest.description,
    author: manifest.author,
    version: manifest.version ?? '0.0.0',
    versionCode: manifest.versionCode,
    manifestVersion: manifest.manifestVersion,
    state: options?.state ?? 'enable',
    path: pluginPath,
    logs: [],
  };

  const jsPath = `file://${path.join(pluginPath, manifest.main ?? '')}`;
  const pluginProvider = await import(jsPath)
  .then((module) => (module as { default: PluginProvider | undefined }).default)
  .catch((err) => {
    const error = Error(`Failed to load plugin: Cannot load "${jsPath}"`);
    error.cause = err;

    throw error;
  });

  if (typeof pluginProvider === 'function') {
    newPlugin.js.raw = pluginProvider;

    const context: PluginContext = {
      on(event, listener) {
        newPlugin.js.listeners[event] ??= [];
        newPlugin.js.listeners[event]?.push(listener);
      },
      useConfig: () => [config.get.bind(null), config.set.bind(null)],
      useSetting: (options) => {
        newPlugin.js.settings.push(options);

        return () => (config.get().plugins.config[newPlugin.id] as Record<string, unknown>)?.[options.key];
      },
      useOverride(target, fn) {
        newPlugin.js.overrides[target] ??= [];
        newPlugin.js.overrides[target]?.push(fn);
      },
      logger: createLogger(newPlugin),
    };

    runner(newPlugin, () => {
      const result = pluginProvider(context);
      if (typeof result === 'function') newPlugin.js.off = result;
    }, { message: 'Failed to load plugin' });
  }

  newPlugin.css = await Promise.all(
    manifest.css?.map(async (cssFilePath) => {
      const cssPath = path.resolve(pluginPath, cssFilePath);
      return fs.readFile(cssPath, 'utf-8');
    }) ?? [],
  );

  return newPlugin;
};

export default loader;
