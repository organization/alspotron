import type { JsPlugin } from '@farmfe/core';

export const Port = {
  TRAY: 6753,
  LYRIC: 6754,
  SETTING: 6755,
  SEARCH: 6756,
};

export const farmAlspotronPlugin = (): JsPlugin => {
  const getEnvName = (name: string) => `FARM_${name.toUpperCase()}_DEV_SERVER_URL`;

  return {
    name: 'farm-alspotron-plugin',
    configureDevServer() {
      Object.entries(Port)
        .forEach(([name, port]) => {
          const address = `http://localhost:${port}`;
          const envName = getEnvName(name);

          process.env[envName] = address;
        });
    },
  };
};
