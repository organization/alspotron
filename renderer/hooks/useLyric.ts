import { createMemo } from 'solid-js';

import { usePlayingInfo } from '../components/PlayingInfoProvider';

const BIAS = 1000; // ms
const TRANSITION_DURATION = 225; // ms

const useLyric = () => {
  const { lyrics, progress } = usePlayingInfo();
  const lastIter = () => {
    const tempLyrics = lyrics();
    if (tempLyrics === null) return null;

    const last = tempLyrics.lower_bound(progress() + (BIAS + TRANSITION_DURATION));

    if (!last.equals(tempLyrics.begin())) {
      return last.prev();
    }

    return last;
  };

  const lyric = createMemo(() => lastIter()?.second);
  const index = createMemo(() => lastIter()?.first);

  return [lyric, index] as const;
};

export default useLyric;
