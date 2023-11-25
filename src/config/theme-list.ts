import path from 'node:path';

import fs from 'node:fs/promises';

import { State } from './state';

import { defaultConfigDirectory } from './config';

import { DEFAULT_STYLE } from '../../common/constants';
import { StyleConfig, ThemeList } from '../../common/schema';

let throttleTimer: NodeJS.Timeout | null = null;
export const themeList = new State<ThemeList>({});
themeList.watch((value) => {
  if (throttleTimer) clearTimeout(throttleTimer);

  throttleTimer = setTimeout(async () => {
    const names = Object.entries(value).filter(([, value]) => value).map(([key]) => key);

    const themeFolderPath = path.join(defaultConfigDirectory, '/theme');
    await fs.mkdir(themeFolderPath).catch(() => null);

    const toDeleteList = (await fs.readdir(themeFolderPath))
      .filter((filename) => filename.match(/\.json$/) && !names.includes(filename.replace(/\.json$/, '')));

    await Promise.all(toDeleteList.map(async (filename) => fs.unlink(path.join(themeFolderPath, filename))));
    await Promise.all(names.map(async (name) => {
      const themePath = path.join(themeFolderPath, `${name}.json`);
      await fs.writeFile(themePath, JSON.stringify(value[name], null, 2), 'utf-8').catch(() => null);
    }));
  }, 1000);
});

const loadFromFile = async () => {
  const themeFolderPath = path.join(defaultConfigDirectory, '/theme');
  const isExist = await fs.access(themeFolderPath).then(() => true).catch(() => false);
  if (!isExist) await fs.mkdir(themeFolderPath);

  const fileList = await fs.readdir(themeFolderPath, { withFileTypes: true });
  const nameList = fileList.filter((it) => it.isFile()).map((it) => it.name);

  const result: Record<string, StyleConfig> = {};
  await Promise.all(
    nameList.map(async (filename) => {
      if (filename.match(/\.json$/)?.[0] !== '.json') return;

      const name = filename.replace(/\.json$/, '');
      const data = await fs.readFile(path.join(themeFolderPath, filename), 'utf-8');
      if (data === null) return;

      result[name] = JSON.parse(data) as StyleConfig;
    }),
  );

  return result;
};
loadFromFile()
  .then((value) => themeList.set(value))
  .catch(() => themeList.set({
    'Default Theme': DEFAULT_STYLE
  }));
