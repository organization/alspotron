import { Accessor, createMemo, on } from 'solid-js';

import useConfig from './useConfig';

import { DEFAULT_CONFIG } from '../../common/constants';
import { LyricData, LyricMetadata, LyricProvider, SearchParams } from '../../common/provider';

export const useLyricProvider = (): Accessor<LyricProvider> => {
  const [config] = useConfig();
  const providerName = () => config()?.lyricProvider ?? DEFAULT_CONFIG.lyricProvider;

  return createMemo(on(providerName, (name) => {
    const provider: LyricProvider = {
      name,
      async getLyric(params: SearchParams): Promise<LyricData | null> {
        return window.ipcRenderer.invoke('lyric-provider:get-lyric', params)
      },
      async getLyricById(id: string): Promise<LyricData | null> {
        return window.ipcRenderer.invoke('lyric-provider:get-lyric-by-id', id);
      },
      async searchLyrics(params: SearchParams): Promise<LyricMetadata[]> {
        return window.ipcRenderer.invoke('lyric-provider:search-lyrics', params);
      }
    };

    return provider;
  }));
};
