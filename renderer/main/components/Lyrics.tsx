
import { splitProps } from 'solid-js';

import LyricsTransition from './LyricsTransition';

import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import useLyric from '../../hooks/useLyric';

import { cx } from '../../utils/classNames';
import { userCSSSelectors } from '../../utils/userCSSSelectors';

import useConfig from '../../hooks/useConfig';

import type { JSX } from 'solid-js/jsx-runtime';

type LyricsProps = {
  style?: string;
} & JSX.HTMLAttributes<HTMLDivElement>;

const anchorTypeToItemsAlignType = (anchor?: string) => {
  if (anchor?.includes('right')) {
    return 'flex-end';
  } else if (anchor?.includes('left')) {
    return 'flex-start';
  } else {
    return 'center';
  }
};

const Lyrics = (props: LyricsProps) => {
  const [config] = useConfig();
  const [, containerProps] = splitProps(props, ['class', 'style']);
  const { status } = usePlayingInfo();
  const [lyrics] = useLyric();

  return (
    <div
      class={cx('w-full flex flex-col', props.class, userCSSSelectors['lyrics-wrapper'])}
      style={`opacity: ${status() !== 'playing' ? config()?.style.lyric.stoppedOpacity : 1}; ${props.style ?? ''};`}
      {...containerProps}
    >
      <LyricsTransition
        lyrics={lyrics() ?? []}
        status={status()}
        style={`
          align-items: ${anchorTypeToItemsAlignType(config()?.windowPosition.anchor)};
          flex-direction: ${config()?.windowPosition?.direction ?? 'column'};
        `}
        {...containerProps} />
    </div>
  );
}

export default Lyrics;
