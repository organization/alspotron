import { createMemo } from 'solid-js';

import useStyle from './useStyle';

import useLyricMapper from './useLyricMapper';

import { usePlayingInfo } from '../components/PlayingInfoProvider';
import { getLyricMapperId } from '../../common/utils';

const BIAS = 225; // ms
const TRANSITION_DURATION = 225; // ms

const useLyric = () => {
  const style = useStyle();
  const [lyricMapper] = useLyricMapper();
  const { title, coverUrl, lyrics, progress } = usePlayingInfo();

  const lastIter = () => {
    const tempLyrics = lyrics();
    if (tempLyrics === null) return null;

    const mapper = lyricMapper()[getLyricMapperId(title(), coverUrl())];
    const delay = mapper?.delay ?? 0;
    const last = tempLyrics.lower_bound(
      progress() + delay + (
        BIAS + (
          style().animation !== 'none' && !style().animationAtOnce ?
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

  const lyric = createMemo(() => lastIter()?.value ? lastIter()?.second : null);
  const index = createMemo(() => lastIter()?.value ? lastIter()?.first : null);

  const nextLyricsIter = createMemo(() => {
    let nextLyricLength = style().lyric.nextLyric;

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

    return now.advance(nextLyricLength + 1);
  });

  const getPreviousLyricLength = createMemo(() => {
    let previousLyricLength = style().lyric.previousLyric;
  
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

    return previousLyricLength;
  });

  const previousLyricsIter = createMemo(() => {
    const previousLyricLength = getPreviousLyricLength();
    if (!previousLyricLength) return null;
    const now = lastIter();
    const tempLyrics = lyrics();

    if (
      !tempLyrics ||
      !now
    ) {
      return null;
    }

    return now.advance(-previousLyricLength);
  });
  const lyricRange = createMemo(() => {
    const now = lastIter();
    if (!now || now.value === undefined) return null;

    const prevIter = previousLyricsIter() ?? now;
    const nextIter = nextLyricsIter() ?? now;
  
    if (prevIter.equals(nextIter)) return [now.second];

    const result: string[][] = [];
    for (let v = prevIter; !v.equals(nextIter); v = v.next()) {
      if (v.value) result.push(v.second);
    }
    if (nextIter.equals(now)) {
      result.push(now.second);
    }
  
    return result;
  });

  return [lyric, index, lyricRange, getPreviousLyricLength] as const;
};

export default useLyric;
