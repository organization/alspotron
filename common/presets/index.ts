import albumCover from './album-cover.json';
import multipleLyric from './multiple-lyric.json';

import { DEFAULT_STYLE } from '../constants';
import { StyleConfig } from '../schema';

export default {
  'default': DEFAULT_STYLE,
  'album-cover': albumCover,
  'multiple-lyric': multipleLyric,
} as Record<string, StyleConfig>;
