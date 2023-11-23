import { satisfies, minVersion, lt } from 'semver';

import { MigrateTable, MigratorData } from './types';

import packageJson from '../../../package.json';

export const createMigrator = (table: MigrateTable) => {
  const migratorList = Object.entries(table)
    .sort(([a], [b]) => {
      const aMin = minVersion(a);
      const bMin = minVersion(b);

      if (!aMin || !bMin) return 0;
      return lt(aMin, bMin) ? 1 : -1;
    })
    .map(([matcher, migrator]) => {
      if (satisfies(packageJson.version, matcher)) {
        return migrator;
      }
    })
    .filter(Boolean);

  return (initData: MigratorData) => {
    const result = { ...initData };

    for (const migrator of migratorList) {
      const context = {
        getConfig: () => result.config,
      };

      for (const _key of Object.keys(result)) {
        const key = _key as keyof MigratorData;
        const value = migrator[key]?.(result[key], context);

        if (result) {
          result[key] = value;
        }
      }
    }

    return result;
  };
};
