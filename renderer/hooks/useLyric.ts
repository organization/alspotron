import { createMemo } from 'solid-js';
import { usePlayingInfo } from '../components/PlayingInfoProvider';

const BIAS = 1000; // ms
const TRANSITION_DURATION = 225; // ms

const useLyric = () => {
  const { lyrics, progress } = usePlayingInfo();
  const lastIter = () => {
    const tempLyrics = lyrics();
    if (tempLyrics === null) return null;

    const last = tempLyrics.lowerBound(progress() + BIAS + TRANSITION_DURATION);

    if (!last.equals(tempLyrics.begin()) && last !== tempLyrics.begin()) {
      return last.pre();
    }

    return last;
  };

  const lyric = createMemo(() => lastIter()?.pointer[1]);
  const index = createMemo(() => lastIter()?.pointer[0]);

  return [lyric, index] as const;
};

export default useLyric;
