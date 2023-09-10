import path from 'node:path';
import fs from 'node:fs/promises';

import { z } from 'zod';

import { Plugin, PluginInterface } from '../../../common/plugin';
import { Loader } from '../plugin-loader';
import { Json } from '../../../utils/types';

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
  };

  const jsPath = `file://${path.join(pluginPath, manifest.main ?? '')}`;
  const pluginInstance = await import(jsPath)
  .then((module) => (module as { default: PluginInterface }).default)
  .catch((err) => {
    const error = Error(`Failed to load plugin: Cannot load "${jsPath}"`);
    error.cause = err;

    throw error;
  });

  if (!(pluginInstance instanceof Error)) newPlugin.js = pluginInstance; 

  newPlugin.css = await Promise.all(
    manifest.css?.map(async (cssFilePath) => {
      const cssPath = path.resolve(pluginPath, cssFilePath);
      return fs.readFile(cssPath, 'utf-8');
    }) ?? [],
  );

  return newPlugin;
};

export default loader;
