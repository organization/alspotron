import { app } from 'electron';
import path from 'node:path';


export const getFile = (url: string) => app.isPackaged ? path.join(process.resourcesPath, './', url) : url;
