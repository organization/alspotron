import type { PluginProvider } from '../common/plugins';
import type { PluginManifest } from '../src/plugins/types';

export type PredefinedPlugin = {
  provider?: PluginProvider;
  cssList: string[];
  manifest: PluginManifest;
};
