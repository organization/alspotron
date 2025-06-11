import { Migrator } from '../types';
import { Config } from '../../../../common/schema';

export const LEGACY_migrator0_25_1: Migrator = {
  config: (data: unknown) => {
    const configData = (data as Config) ?? {};

    return {
      ...configData,
      lyricProvider: 'lrclib',
    } satisfies Config;
  },
};
