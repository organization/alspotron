import type { PluginProvider } from '../packages/shared/src/model/plugins';
import type { PluginManifest } from '../src/plugins/types';

export type PredefinedPlugin = {
  provider?: PluginProvider;
  cssList: string[];
  manifest: PluginManifest;
};
