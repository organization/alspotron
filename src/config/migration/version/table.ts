import { LEGACY_migrator0_16_0 } from './before-0.16.0';
import { LEGACY_migrator0_18_0 } from './before-0.18.0';
import { LEGACY_migrator0_20_0 } from './before-0.20.0';
import { LEGACY_migrator0_22_0 } from './before-0.22.0';

import type { MigrateTable } from '../types';

export const migrateTable: MigrateTable = {
  '>=0.16.0': LEGACY_migrator0_16_0,
  '>=0.18.0': LEGACY_migrator0_18_0,
  '>=0.20.0': LEGACY_migrator0_20_0,
  '>=0.22.0': LEGACY_migrator0_22_0,
};

