import { createMemo } from 'solid-js';

import useConfig from './useConfig';

import { usePlayingInfo } from '../components/PlayingInfoProvider';

const BIAS = 225; // ms
const TRANSITION_DURATION = 225; // ms

const useLyric = () => {
  const [config] = useConfig();
  const { lyrics, progress } = usePlayingInfo();

  const lastIter = () => {
    const tempLyrics = lyrics();
    if (tempLyrics === null) return null;

    const last = tempLyrics.lower_bound(
      progress() + (
        BIAS + (
          config()?.style?.animation !== 'none' && !config()?.style?.animationAtOnce ?
            TRANSITION_DURATION :
            0
        )
      ),
    );

    if (!last.equals(tempLyrics.begin())) {
      return last.prev();
    }

    return last;
  };

  const lyric = createMemo(() => lastIter()?.second);
  const index = createMemo(() => lastIter()?.first);

  const nextLyrics = createMemo(() => {
    const tempLyrics = lyrics();
    let now = lastIter();
    
    return Array
      .from({ length: config()?.lyric.nextLyric ?? 0 })
      .map(() => {
        if (!now) return null;
        if (!tempLyrics) return null;
        if (now.equals(tempLyrics.end())) return null;

        const next = now.next();
        now = next;

        return next.second;
      });
  });
  const previousLyrics = createMemo(() => {
    const tempLyrics = lyrics();
    let now = lastIter();
    
    return Array
      .from({ length: config()?.lyric.nextLyric ?? 0 })
      .map(() => {
        if (!now) return null;
        if (!tempLyrics) return null;
        if (now.equals(tempLyrics.begin())) return null;

        const next = now.prev();
        now = next;

        return next.second;
      });
  });


  return [lyric, index, nextLyrics, previousLyrics] as const;
};

export default useLyric;
