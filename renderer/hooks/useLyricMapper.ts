import { createSignal } from 'solid-js';

import { LyricMapper } from '../../common/types';

const useLyricMapper = () => {
  const [lyricMapper, setLyricMapper] = createSignal<LyricMapper>({});

  window.ipcRenderer.invoke('get-lyric-mapper').then((result: LyricMapper) => {
    setLyricMapper(result || {});
  });

  window.ipcRenderer.on('lyric-mapper', (_, data: LyricMapper) => {
    setLyricMapper(data);
  });

  const setMapper = async (newMapper: Partial<LyricMapper>) => {
    await window.ipcRenderer.invoke('set-lyric-mapper', newMapper);
  };

  return [lyricMapper, setMapper] as const;
};

export default useLyricMapper;
