import path from 'node:path';
import fs from 'node:fs/promises';

import { z } from 'zod';

import { createLogger } from './v1-logger';

import { Plugin, PluginContext, PluginProvider } from '../../../common/plugins';
import { Json } from '../../../utils/types';
import { VersionedPluginLoader, VersionedPluginPathLoader } from '../types';
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

export const loadFromPath: VersionedPluginPathLoader = async (pluginPath, rawManifest, runner, options) => {
  const manifest = v1ManifestSchema.parse(rawManifest);

  const jsPath = `file://${path.join(pluginPath, manifest.main ?? '')}`;
  const pluginProvider = await import(jsPath)
  .then((module) => (module as { default: PluginProvider | undefined }).default)
  .catch((err) => {
    const error = Error(`Failed to load plugin: Cannot load "${jsPath}"`);
    error.cause = err;

    throw error;
  });

  const cssList = await Promise.all(
    manifest.css?.map(async (cssFilePath) => {
      const cssPath = path.resolve(pluginPath, cssFilePath);
      return fs.readFile(cssPath, 'utf-8');
    }) ?? [],
  );

  return loadPlugin(
    pluginProvider ?? null,
    cssList,
    manifest,
    runner,
    options,
  );
};

export const loadPlugin: VersionedPluginLoader = (
  pluginProvider,
  cssList,
  manifest,
  runner,
  options,
) => {
  const newPlugin: Plugin = {
    rawManifest: JSON.stringify(manifest),
    manifest: manifest as Json,
    js: {
      listeners: {},
      settings: [],
      overrides: {},
    },
    css: cssList,

    id: manifest.id,
    name: manifest.name,
    description: manifest.description,
    author: manifest.author,
    version: manifest.version ?? '0.0.0',
    versionCode: manifest.versionCode,
    manifestVersion: manifest.manifestVersion,
    state: options?.state ?? 'enable',
    path: options?.path ?? 'Built-in',
    logs: [],
  };

  if (pluginProvider !== null) {
    newPlugin.js.raw = pluginProvider;

    const context: PluginContext = {
      on(event, listener) {
        newPlugin.js.listeners[event] ??= [];
        newPlugin.js.listeners[event]?.push(listener);
      },
      useConfig: () => [config.get.bind(config), config.set.bind(config)],
      useSetting: (options) => {
        newPlugin.js.settings.push(options);

        if (options.type === 'button') return;

        return () => (config.get().plugins.config[newPlugin.id])?.[options.key];
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

  return newPlugin;
};
