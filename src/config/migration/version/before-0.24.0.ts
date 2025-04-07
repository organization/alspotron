import type { LEGACY_StyleConfig0_24_0, StyleConfig } from '../../../../common/schema';
import { DEFAULT_STYLE } from '../../../../common/constants';
import type { Migrator } from '../types';

export const LEGACY_migrator0_24_0: Migrator = {
  themeList: (data: unknown) => {
    const themeList = data as Record<string, LEGACY_StyleConfig0_24_0 | undefined>;

    return Object.entries(themeList).reduce((acc, [key, value]) => {
      if (value === undefined) return acc;

      const newValue: StyleConfig = {
        ...value,
        LYRIC: {
          ...DEFAULT_STYLE.lyric,
          ...value.lyric,
        },
      };

      return {
        ...acc,
        [key]: newValue,
      };
    }, {});
  },
};
