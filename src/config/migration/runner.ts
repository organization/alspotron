import { satisfies, minVersion, lt, clean } from 'semver';

import { MigrateTable, MigratorData } from './types';

import packageJson from '../../../package.json';

const shouldMigration = (prev: string, next: string, range: string) => {
  if (satisfies(prev, range)) return false;
  return satisfies(next, range);
};


export const createMigrator = (table: MigrateTable, prevVersion: string) => {
  const nowVersion = packageJson.version;

  const migratorList = Object.entries(table)
    .sort(([a], [b]) => {
      const aMin = minVersion(a);
      const bMin = minVersion(b);

      if (!aMin || !bMin) return 0;
      return lt(aMin, bMin) ? 1 : -1;
    })
    .map(([matcher, migrator]) => {
      if (clean(matcher) !== null) {
        console.warn('[Alspotron] You should use range in migration table.');
        return null;
      }

      if (shouldMigration(prevVersion, nowVersion, matcher)) {
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
