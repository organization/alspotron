import path from 'node:path';

import { State } from './state';

import { defaultConfigDirectory } from './config';

import { LyricMapper, LyricMapperSchema } from '../../common/types';


const lyricPath = path.join(defaultConfigDirectory, 'lyrics.json');
export const lyricMapper = new State<LyricMapper>({}, {
  file: {
    path: lyricPath,
    schema: LyricMapperSchema,
    autoSync: true,
  }
});
