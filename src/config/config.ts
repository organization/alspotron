import path from 'node:path';

import { app } from 'electron';

import { State } from './state';

import { DEFAULT_CONFIG } from '../../common/constants';
import { Config, ConfigSchema } from '../../common/types';

export const defaultConfigDirectory = app.getPath('userData');
const getCurrentLocale = () => (/en|ko|ja|de/.exec(app.getLocale())?.at(0)) as 'ko' | 'en' | 'ja' | 'de' | undefined ?? 'ko';
app.on('ready', () => {
  // DEFAULT_CONFIG.language = getCurrentLocale();
}); // to get the correct locale

const configPath = path.join(defaultConfigDirectory, 'config.json');
export const config = new State<Config>(DEFAULT_CONFIG, {
  file: {
    path: configPath,
    schema: ConfigSchema,
    autoSync: true,
  },
});
