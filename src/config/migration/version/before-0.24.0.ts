import { Migrator } from '../types';
import { Config, LEGACY_Config0_24_0 } from '../../../../common/schema';

export const LEGACY_migrator0_24_0: Migrator = {
  config: (data: unknown) => {
    const configData = data as LEGACY_Config0_24_0 ?? {};

    return {
      ...configData,
      version: 4,
      experimental: {},
    } satisfies Config;
  },
};
