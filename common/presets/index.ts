import albumCover from './album-cover.json';
import multipleLyric from './multiple-lyric.json';
import dynamicIsland from './dynamic-island.json';
import dynamicNotchMacos from './dynamic-notch-macos.json';
import overwatch from './overwatch.json';

import { DEFAULT_STYLE } from '../constants';
import { StyleConfig } from '../schema';

export default {
  'default': DEFAULT_STYLE,
  'album-cover': albumCover,
  'multiple-lyric': multipleLyric,
  'dynamic-island': dynamicIsland,
  'dynamic-notch-macos': dynamicNotchMacos,
  'overwatch': overwatch,
} as Record<string, StyleConfig>;
