import { Migrator } from '../types';
import { Config, LEGACY_Config0_23_2 } from '../../../../common/schema';

export const LEGACY_migrator0_23_2: Migrator = {
  config: (data: unknown) => {
    const configData = (data as LEGACY_Config0_23_2) ?? {};

    return {
      ...configData,
      version: 4,
      experimental: {},
    } satisfies Config;
  },
};
