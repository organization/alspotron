import { Migrator } from '../types';
import {
  LEGACY_Config0_22_0,
  LEGACY_Config0_23_1,
} from '../../../../common/schema';
import { DEFAULT_CONFIG } from '../../../../common/constants';

export const LEGACY_migrator0_22_0: Migrator = {
  config: (data: unknown) => {
    const configData = (data as LEGACY_Config0_22_0) ?? {};

    return {
      ...configData,
      version: 3,
      sourceProvider: configData.playingProvider,
      providers: DEFAULT_CONFIG.providers,
    } satisfies LEGACY_Config0_23_1;
  },
};
