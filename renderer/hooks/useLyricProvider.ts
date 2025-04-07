import { type Accessor, createMemo, on } from 'solid-js';

import useConfig from './useConfig';

import { DEFAULT_CONFIG } from '../../common/constants';
import type { LyricData, LyricMetadata, LyricProvider, SearchParams } from '../../common/provider';

type RendererLyricProvider = Omit<LyricProvider, 'getOptions' | 'onOptionChange'> & {
  [K in 'getOptions' | 'onOptionChange']: (
    ...params: Parameters<LyricProvider[K]>
  ) => Promise<ReturnType<LyricProvider[K]>>;
};
type LyricProviderThis = {
  list: () => Promise<string[]>;
};
export type LyricProviderAccessor = Accessor<RendererLyricProvider> & LyricProviderThis;

export const useLyricProvider = (): LyricProviderAccessor => {
  const [config] = useConfig();

  const providerName = () => config()?.lyricProvider ?? DEFAULT_CONFIG.lyricProvider;
  const getter = createMemo(
    on(
      providerName,
      (name) =>
        ({
          name,
          async getLyric(params: SearchParams): Promise<LyricData | null> {
            return window.ipcRenderer.invoke('lyric-provider:get-lyric', params);
          },
          async getLyricById(id: string): Promise<LyricData | null> {
            return window.ipcRenderer.invoke('lyric-provider:get-lyric-by-id', id);
          },
          async searchLyrics(params: SearchParams): Promise<LyricMetadata[]> {
            return window.ipcRenderer.invoke('lyric-provider:search-lyrics', params);
          },
          async getOptions(language: string) {
            return window.ipcRenderer.invoke('lyric-provider:get-options', language);
          },
          async onOptionChange(options: Record<string, unknown>) {
            return window.ipcRenderer.invoke('lyric-provider:on-option-change', options);
          },
        }) satisfies RendererLyricProvider,
    ),
  );

  const result = function (this: LyricProviderThis) {
    return getter();
  } as LyricProviderAccessor;
  result.list = async () => window.ipcRenderer.invoke('lyric-provider:get-all-lyric-providers');

  return result;
};
