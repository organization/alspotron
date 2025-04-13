import albumCover from './album-cover.json';
import classic from './classic.json';
import dynamicIsland from './dynamic-island.json';
import dynamicNotchMacos from './dynamic-notch-macos.json';
import multipleLyric from './multiple-lyric.json';
import overwatch from './overwatch.json';

import { DefaultStyle } from '../constant';
import type { StyleConfig } from '../model';

export const Preset = {
  default: DefaultStyle,
  classic: classic,
  'album-cover': albumCover,
  'multiple-lyric': multipleLyric,
  'dynamic-island': dynamicIsland,
  'dynamic-notch-macos': dynamicNotchMacos,
  overwatch: overwatch,
} as Record<string, StyleConfig>;
