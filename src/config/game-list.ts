import path from 'node:path';

import { State } from './state';

import { defaultConfigDirectory } from './config';

import { GameList, GameListSchema } from '../../common/schema';


const gameListPath = path.join(defaultConfigDirectory, 'gameList.json');
export const gameList = new State<GameList>({}, {
  file: {
    path: gameListPath,
    schema: GameListSchema,
    autoSync: true,
  }
});
