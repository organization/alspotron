import path from 'node:path';

import { app } from 'electron';

export const getFile = (url: string) => (app.isPackaged ? path.join(process.resourcesPath, './', url) : url);
