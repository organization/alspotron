import { Migrator } from '../types';
import { LEGACY_StyleConfig0_20_0, StyleConfig, } from '../../../../common/schema';
import { DEFAULT_STYLE } from '../../../../common/constants';

export const LEGACY_migrator0_20_0: Migrator = {
  themeList: (data: unknown) => {
    const themeList = data as Record<string, LEGACY_StyleConfig0_20_0 | undefined>;

    return Object.entries(themeList).reduce((acc, [key, value]) => {
      if (value === undefined) return acc;

      const newValue: StyleConfig = {
        ...value,
        position: DEFAULT_STYLE.position,
      };

      return {
        ...acc,
        [key]: newValue,
      };
    }, {});
  }
};