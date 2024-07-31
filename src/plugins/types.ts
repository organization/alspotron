import z from 'zod';

import { Plugin, PluginProvider } from '../../common/plugins';

export type PluginManifest = z.infer<typeof PluginManifestSchema>;
export const PluginManifestSchema = z.object({
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
}
export interface VersionedPluginRunnerOptions {
  state?: Plugin['state'];
  path?: string;
}
export type PluginRunner = (plugin: Plugin, fn: (plugin: Plugin) => void, options?: PluginRunnerOptions) => Error | null;
export type VersionedPluginPathLoader = (
  pluginPath: string,
  manifest: PluginManifest,
  runner: PluginRunner,
  options?: VersionedPluginRunnerOptions,
) => Promise<Plugin>;
export type VersionedPluginLoader = (
  provider: PluginProvider | null,
  cssList: string[],
  manifest: PluginManifest,
  runner: PluginRunner,
  options?: VersionedPluginRunnerOptions,
) => Plugin;