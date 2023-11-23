import { config } from './config';
import { lyricMapper } from './lyric-mapper';
import { themeList } from './theme-list';
import { gameList } from './game-list';
import { createMigrator, migrateTable } from './migration';

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

const migrator = createMigrator(migrateTable);
const tryMigration = () => {
  console.log('[Alspotron] Checking data...', init, isInit());
  const isLoaded = Object.values(init).every((it) => it === 1);

  if (isInit()) {
    resolver();
    return;
  }

  if (isLoaded) {
    console.log('[Alspotron] Migrating data...');
    const result = migrator({
      config: config.get(),
      lyricMapper: lyricMapper.get(),
      themeList: themeList.get(),
      gameList: gameList.get(),
    });

    const configParsed = config.schema?.safeParse(result.config);
    const lyricMapperParsed = lyricMapper.schema?.safeParse(result.lyricMapper);
    const themeListParsed = themeList.schema?.safeParse(result.themeList);
    const gameListParsed = gameList.schema?.safeParse(result.gameList);

    if (configParsed?.success) config.set(configParsed.data);
    else config.set(config.get());

    if (lyricMapperParsed?.success) lyricMapper.set(lyricMapperParsed.data);
    else lyricMapper.set(lyricMapper.get());

    if (themeListParsed?.success) themeList.set(themeListParsed.data);
    else themeList.set(themeList.get());

    if (gameListParsed?.success) gameList.set(gameListParsed.data);
    else gameList.set(gameList.get());

    let isFailed = false;
    if (config.schema && !configParsed?.success) {
      isFailed = true;
      console.warn('[Alspotron] Cannot migrate config', configParsed?.error, result.config);
    }
    if (lyricMapper.schema && !lyricMapperParsed?.success) {
      isFailed = true;
      console.warn('[Alspotron] Cannot migrate lyricMapper', lyricMapperParsed?.error, result.lyricMapper);
    }
    if (themeList.schema && !themeListParsed?.success) {
      isFailed = true;
      console.warn('[Alspotron] Cannot migrate themeList', themeListParsed?.error, result.themeList);
    }
    if (gameList.schema && !gameListParsed?.success) {
      isFailed = true;
      console.warn('[Alspotron] Cannot migrate gameList', gameListParsed?.error, result.gameList);
    }

    if (!isFailed) console.log('[Alspotron] Migrating data... Done');
  }
};

export const isInit = () => Object.values(init).every((it) => it > 1);
export const waitConfigInit = () => new Promise<void>((resolve) => {
  resolver = resolve;
});

export * from './state';
export { config, lyricMapper, themeList, gameList };
