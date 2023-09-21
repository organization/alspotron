
import { For, splitProps } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';

import LyricsTransition from './LyricsTransition';

import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import useLyric from '../../hooks/useLyric';

import { cx } from '../../utils/classNames';
import { userCSSSelectors, userCSSTransitions } from '../../utils/userCSSSelectors';

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

const anchorTypeToOriginType = (anchor?: string, y = '0') => {
  if (anchor?.includes('right')) {
    return `100% ${y}`;
  } else if (anchor?.includes('left')) {
    return `0 ${y}`;
  } else {
    return `50% ${y}`;
  }
};

const Lyrics = (props: LyricsProps) => {
  const [config] = useConfig();
  const [, containerProps] = splitProps(props, ['class', 'style']);
  const { status } = usePlayingInfo();
  const [lyrics, _, nextLyrics, previousLyrics] = useLyric();

  const lyricsList = () => [ ...previousLyrics(), lyrics(), ...nextLyrics()];

  const orderOffset = () => previousLyrics().length * 3;
  const offset = () => config()?.style.animationAtOnce ? 1 : 3;

  const animation = () => {
    const configuredName = config()?.style?.animation ?? 'pretty';
    if (configuredName === 'custom') {
      return userCSSTransitions['transition-lyric'];
    }

    return `lyric-${configuredName}`;
  };

  return (
      <div
        class={cx('w-full flex flex-col justify-center', props.class, userCSSSelectors['lyrics-wrapper'])}
        style={`
          row-gap: ${config()?.style.lyric.multipleContainerRowGap}rem;
          opacity: ${status() !== 'playing' ? config()?.style.lyric.stoppedOpacity : 1}; ${props.style ?? ''};
          align-items: ${anchorTypeToItemsAlignType(config()?.windowPosition.anchor)};
        `}
        {...containerProps}
      >
        <TransitionGroup
          name={animation()}
          appear
        >
          <For each={lyricsList()}>
            {(lyrics, index) => (
              <LyricsTransition
                lyrics={lyrics ?? []}
                status={status()}
                class={'w-fit transition-all'}
                style={`
                  --order-offset: ${orderOffset() + (index() * offset())};
                  row-gap: ${config()?.style.lyric.containerRowGap}rem;
                  flex-direction: ${config()?.windowPosition?.direction ?? 'column'};
                  align-items: ${anchorTypeToItemsAlignType(config()?.windowPosition.anchor)};
                  transform-origin: ${anchorTypeToOriginType(config()?.windowPosition.anchor)};
                `}
                {...containerProps}
              />
            )}
          </For>
      </TransitionGroup>
    </div>
  );
}

export default Lyrics;
