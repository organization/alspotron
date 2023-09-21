import { createMemo } from 'solid-js';

import { FlatMap } from 'tstl/experimental';

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
    let nextLyricLength = config()?.lyric.nextLyric;
    if (!nextLyricLength) return null;

    const now = lastIter();
    const tempLyrics = lyrics();

    if (
      !tempLyrics ||
      !now
    ) {
      return null;
    } else if (now.index() + nextLyricLength >= tempLyrics.end().index()) {
      nextLyricLength = tempLyrics.end().index() - now.index() - 1;
    }

    return new FlatMap<number, string[]>(now.next(), now.advance(nextLyricLength + 1));
  });

  const previousLyrics = createMemo(() => {
    let previousLyricLength = config()?.lyric.previousLyric;
    if (!previousLyricLength) return null;
    const now = lastIter();
    const tempLyrics = lyrics();

    if (
      !tempLyrics ||
      !now
    ) {
      return null;
    } else if (now.index() - previousLyricLength < tempLyrics.begin().index()) {
      previousLyricLength = now.index() - tempLyrics.begin().index();
    }

    // NOW: -2 1 0
    // HOW TO 0 -1 -2?
    return new FlatMap<number, string[]>(now.advance(-previousLyricLength), now, (a, b) => a > b);
  });


  return [lyric, index, nextLyrics, previousLyrics] as const;
};

export default useLyric;
