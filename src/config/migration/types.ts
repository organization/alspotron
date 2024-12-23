export type MigratorContext = {
  getConfig: () => unknown;
};
export type MigratorExecutor = (
  data: unknown,
  context: MigratorContext,
) => unknown;
export type Migrator = {
  config?: MigratorExecutor;
  gameList?: MigratorExecutor;
  lyricMapper?: MigratorExecutor;
  themeList?: MigratorExecutor;
};
export type MigrateTable = Record<string, Migrator>;

export type MigratorData = {
  config?: unknown;
  gameList?: unknown;
  lyricMapper?: unknown;
  themeList?: unknown;
};
