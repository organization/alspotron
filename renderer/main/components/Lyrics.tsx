
import { splitProps } from 'solid-js';

import LyricsTransition from './LyricsTransition';

import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import useLyric from '../../hooks/useLyric';

import type { JSX } from 'solid-js/jsx-runtime';

const Lyrics = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [, containerProps] = splitProps(props, ['class']);
  const { status } = usePlayingInfo();
  const [lyrics] = useLyric();
  return <LyricsTransition lyrics={lyrics() ?? []} status={status()} {...containerProps} />
}

export default Lyrics;
