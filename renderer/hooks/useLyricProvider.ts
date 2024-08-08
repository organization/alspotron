import { Accessor, createMemo, on } from 'solid-js';

import useConfig from './useConfig';

import { DEFAULT_CONFIG } from '../../common/constants';
import { LyricData, LyricMetadata, LyricProvider, SearchParams } from '../../common/provider';

type LyricProviderThis = {
  list: () => Promise<string[]>;
};
export type LyricProviderAccessor = Accessor<LyricProvider> & LyricProviderThis;

export const useLyricProvider = (): LyricProviderAccessor => {
  const [config] = useConfig();

  const providerName = () => config()?.lyricProvider ?? DEFAULT_CONFIG.lyricProvider;
  const getter = createMemo(on(providerName, (name) => ({
    name,
    async getLyric(params: SearchParams): Promise<LyricData | null> {
      return window.ipcRenderer.invoke('lyric-provider:get-lyric', params);
    },
    async getLyricById(id: string): Promise<LyricData | null> {
      return window.ipcRenderer.invoke('lyric-provider:get-lyric-by-id', id);
    },
    async searchLyrics(params: SearchParams): Promise<LyricMetadata[]> {
      return window.ipcRenderer.invoke('lyric-provider:search-lyrics', params);
    }
  } satisfies LyricProvider)));

  const result = function (this: LyricProviderThis) {
    return getter();
  } as LyricProviderAccessor;
  result.list = async () => window.ipcRenderer.invoke('lyric-provider:get-all-lyric-providers');

  return result;
};
