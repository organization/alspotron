import { Migrator } from '../types';
import {
  LEGACY_LyricMapper0_18_0,
  LyricMapper,
  LyricMapperMode,
} from '../../../../common/schema';
import { DEFAULT_CONFIG } from '../../../../common/constants';

export const LEGACY_migrator0_18_0: Migrator = {
  lyricMapper: (data: unknown) => {
    const lyricMapperData = data as LEGACY_LyricMapper0_18_0;

    return Object.entries(lyricMapperData).reduce(
      (prev, [key, value]) => ({
        ...prev,
        [key]: {
          mode: {
            type: 'provider' as const,
            id: value?.toString(),
            provider: DEFAULT_CONFIG.lyricProvider,
          } satisfies LyricMapperMode,
        },
      }),
      {},
    ) satisfies LyricMapper;
  },
};
