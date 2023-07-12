import { createSignal } from 'solid-js';

import { LyricMapper } from '../../src/config';

const useLyricMapper = () => {
  const [lyricMapper, setLyricMapper] = createSignal<LyricMapper>({});

  (async () => {
    const result = await window.ipcRenderer.invoke('get-lyric-mapper') as LyricMapper;

    setLyricMapper(result || {});
  })();

  window.ipcRenderer.on('lyric-mapper', (_, data: LyricMapper) => {
    setLyricMapper(data);
  });

  const setMapper = async (newMapper: Partial<LyricMapper>) => {
    await window.ipcRenderer.invoke('set-lyric-mapper', newMapper);
  };

  return [lyricMapper, setMapper] as const;
};

export default useLyricMapper;
