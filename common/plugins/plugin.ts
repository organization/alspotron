import type { PluginProvider, PluginState } from './context';
import type { PluginEventMap, OverrideMap } from './event';
import type { PluginLog } from './logger';
import type { SettingOption } from './option';

import type { Json } from '../../utils/types';
import type { LyricProvider, SourceProvider } from '../provider';

export interface Plugin {
  css?: string[];
  js: {
    raw?: PluginProvider;
    off?: () => void;
    listeners: {
      [Key in keyof PluginEventMap]?: PluginEventMap[Key][];
    };
    settings: SettingOption[];
    overrides: {
      [Target in keyof OverrideMap]?: OverrideMap[Target][];
    };
    providers: {
      source: SourceProvider[];
      lyric: LyricProvider[];
    };
  };
  rawManifest: string;
  manifest: Json;

  id: string;
  name: string;
  description?: string;
  author: string;
  version?: string;
  versionCode: number;
  manifestVersion: number;
  state: PluginState;
  logs: PluginLog[];
  path: string;
}
