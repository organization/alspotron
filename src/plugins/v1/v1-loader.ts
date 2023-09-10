import path from 'node:path';
import fs from 'node:fs/promises';

import { z } from 'zod';

import { Plugin, PluginContext, PluginProvider } from '../../../common/plugin';
import { Loader } from '../plugin-loader';
import { Json } from '../../../utils/types';
import { config, setConfig } from '../../../common/config';

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
}).passthrough();

const loader: Loader = async (pluginPath, rawManifest) => {
  const manifest = v1ManifestSchema.parse(rawManifest);

  const newPlugin: Plugin = {
    rawManifest: JSON.stringify(manifest),
    manifest: manifest as Json,

    id: manifest.id,
    name: manifest.name,
    description: manifest.description,
    author: manifest.author,
    version: manifest.version ?? '0.0.0',
    versionCode: manifest.versionCode,
    pluginVersion: manifest.pluginVersion,
    js: {
      listeners: {},
      settings: [],
      overrides: {},
    },
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
      useConfig: () => [config, setConfig],
      useSetting: (options) => {
        newPlugin.js.settings.push(options);

        return () => (config().plugins.config[newPlugin.id] as Record<string, unknown>)?.[options.key];
      },
      useOverride(target, fn) {
        newPlugin.js.overrides[target] ??= [];
        newPlugin.js.overrides[target]?.push(fn);
      },
    };

    const result = pluginProvider(context);
    if (typeof result === 'function') newPlugin.js.off = result;
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
