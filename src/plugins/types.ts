import z from 'zod';

import { Plugin } from '../../common/plugins/plugin';

export const pluginManifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  author: z.string(),
  version: z.string().optional(),
  versionCode: z.number(),
  manifestVersion: z.number(),
}).passthrough();

export interface PluginRunnerOptions {
  message?: string;
  force?: boolean;
}export interface VersionedPluginRunnerOptions {
  state?: Plugin['state'];
}
export type PluginRunner = (plugin: Plugin, fn: (plugin: Plugin) => void, options?: PluginRunnerOptions) => Error | null;
export type VersionedPluginLoader = (
  pluginPath: string,
  manifest: z.infer<typeof pluginManifestSchema>,
  runner: PluginRunner,
  options?: VersionedPluginRunnerOptions,
) => Promise<Plugin>;
