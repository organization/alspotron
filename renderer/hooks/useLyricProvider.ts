import { createMemo, on } from 'solid-js';

import alsong from 'alsong';

import useConfig from './useConfig';

import { DEFAULT_CONFIG } from '../../common/constants';
import {
  AlsongLyricProvider,
  BaseLyricProvider,
  getLyricProvider,
  LrclibLyricProvider,
  LyricProviderKind
} from '../../common/provider';

const instances: Record<LyricProviderKind, BaseLyricProvider> = {
  alsong: new AlsongLyricProvider(alsong),
  lrclib: new LrclibLyricProvider(),
}

export const useLyricProvider = () => {
  const [config] = useConfig();

  return createMemo(() => {
    const name = config()?.lyricProvider ?? DEFAULT_CONFIG.lyricProvider;

    return instances[name];
  });
};
