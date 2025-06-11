import { SafeParseReturnType } from 'zod';
import { PartialDeep } from 'type-fest';

import { config } from './config';
import { lyricMapper } from './lyric-mapper';
import { themeList } from './theme-list';
import { gameList } from './game-list';
import { createMigrator, migrateTable } from './migration';

import { State } from './state';

import { VERSION } from '../../common/constants';
import {
  ConfigSchema,
  GameListSchema,
  LyricMapperSchema,
  ThemeListSchema,
} from '../../common/schema';

let resolver: () => void = () => null;
const init = {
  config: 0,
  lyricMapper: 0,
  themeList: 0,
  gameList: 0,
};
config.watchOnce(() => {
  init.config += 1;

  tryMigration();
});
lyricMapper.watchOnce(() => {
  init.lyricMapper += 1;

  tryMigration();
});
themeList.watchOnce(() => {
  init.themeList += 1;

  tryMigration();
});
gameList.watchOnce(() => {
  init.gameList += 1;

  tryMigration();
});

const tryMigration = () => {
  const isLoaded = Object.values(init).every((it) => it === 1);

  if (isInit()) {
    resolver();
    return;
  }

  if (isLoaded) {
    const internalConfig = config.get()['__internal__'];
    const prevVersion =
      typeof internalConfig?.version === 'string'
        ? internalConfig.version
        : '0.0.0';
    const nowVersion = VERSION;
    console.log(
      '[Lyrs] prepare for migration',
      prevVersion,
      '->',
      nowVersion,
    );

    const migrator = createMigrator(migrateTable, prevVersion);
    const result = migrator({
      config: config.get(),
      lyricMapper: lyricMapper.get(),
      themeList: themeList.get(),
      gameList: gameList.get(),
    });

    const configParsed = ConfigSchema.safeParse(result.config);
    const lyricMapperParsed = LyricMapperSchema.safeParse(result.lyricMapper);
    const themeListParsed = ThemeListSchema.safeParse(result.themeList);
    const gameListParsed = GameListSchema.safeParse(result.gameList);

    let isFailed = false;
    const applyMigration = <I, O>(
      parsed: SafeParseReturnType<I, O>,
      state: State<O>,
    ) => {
      if (parsed.success) {
        state.set(parsed.data as PartialDeep<O>, false);
      } else {
        isFailed = true;
        console.warn('[Lyrs] Cannot migrate', parsed.error, parsed);
      }
    };

    if (result.config) applyMigration(configParsed, config);
    if (result.lyricMapper) applyMigration(lyricMapperParsed, lyricMapper);
    if (result.themeList) applyMigration(themeListParsed, themeList);
    if (result.gameList) applyMigration(gameListParsed, gameList);

    if (!isFailed) {
      // For internal use
      config.set({
        __internal__: {
          version: nowVersion,
        },
      } as never);

      console.log('[Lyrs] Migrating data... Done');
    }
    resolver();
  }
};

export const isInit = () => Object.values(init).every((it) => it > 1);
export const waitConfigInit = () =>
  new Promise<void>((resolve) => {
    resolver = resolve;
  });

export * from './state';
export { config, lyricMapper, themeList, gameList };
