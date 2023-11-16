import { config } from './config';
import { lyricMapper } from './lyricMapper';
import { themeList } from './themeList';
import { gameList } from './gameList';

let resolver: () => void = () => null;
const init = {
  config: false,
  lyricMapper: false,
  themeList: false,
  gameList: false,
};
config.watchOnce(() => {
  init.config = true;

  if (isInit()) resolver();
});
lyricMapper.watchOnce(() => {
  init.lyricMapper = true;

  if (isInit()) resolver();
});
themeList.watchOnce(() => {
  init.themeList = true;

  if (isInit()) resolver();
});
gameList.watchOnce(() => {
  init.gameList = true;

  if (isInit()) resolver();
});

export const isInit = () => Object.values(isInit).every((it) => it);
export const waitConfigInit = () => new Promise<void>((resolve) => {
  resolver = resolve;
});

export * from './state';
export { config, lyricMapper, themeList, gameList };
