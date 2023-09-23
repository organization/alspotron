
import { For, createMemo, on, splitProps } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';

import LyricsTransition from './LyricsTransition';

import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import useLyric from '../../hooks/useLyric';

import { cx } from '../../utils/classNames';
import { userCSSSelectors, userCSSTransitions } from '../../utils/userCSSSelectors';

import useConfig from '../../hooks/useConfig';
import useStyle from '../../hooks/useStyle';

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
  const style = useStyle();
  const [, containerProps] = splitProps(props, ['class', 'style']);
  const { status } = usePlayingInfo();
  const [, , lyricsRange, getPreviousLyricLength] = useLyric();

  const orderOffset = () => (getPreviousLyricLength() ?? 0) * 3;
  const offset = () => style().animationAtOnce ? 1 : 3;

  const animation = () => {
    const configuredName = style()?.animation ?? 'pretty';
    if (configuredName === 'custom') {
      return userCSSTransitions['transition-lyric'];
    }

    return `lyric-${configuredName}`;
  };

  const previousStyle = createMemo(on(config, (configData) => configData ? `
    scale: ${style().lyric.previousLyricScale};
    opacity: ${style().lyric.previousLyricOpacity};
    transform-origin: ${anchorTypeToOriginType(configData.windowPosition.anchor, '100%')};
  ` : ''));

  const nextStyle = createMemo(on(config, (configData) => configData ? `
    scale: ${style().lyric.nextLyricScale};
    opacity: ${style().lyric.nextLyricOpacity};
    transform-origin: ${anchorTypeToOriginType(configData.windowPosition.anchor)};
  ` : ''));

  const getStyle = (index: number) => {
    const previousLength = getPreviousLyricLength() ?? 0;
    if (index < previousLength) return previousStyle();
    if (index > previousLength) return nextStyle();

    return '';
  };

  return (
      <div
        class={cx('w-full flex flex-col justify-center', props.class, userCSSSelectors['lyrics-container'])}
        style={`
          row-gap: ${style().lyric.multipleContainerRowGap}rem;
          opacity: ${status() !== 'playing' ? style().lyric.stoppedOpacity : 1}; ${props.style ?? ''};
          align-items: ${anchorTypeToItemsAlignType(config()?.windowPosition.anchor)};
        `}
        {...containerProps}
      >
        <TransitionGroup
          name={animation()}
          appear
        >
          <For each={lyricsRange()}>
            {(lyrics, index) => (
              <div class={cx('w-fit transition-all', userCSSSelectors['lyrics-transition-wrapper'])}>
                <div
                  style={getStyle(index())}
                  class={cx('transition-all duration-500', userCSSSelectors['lyrics-wrapper'])}
                >
                  <LyricsTransition
                    lyrics={lyrics}
                    status={status()}
                    style={`
                      --order-offset: ${orderOffset() + (index() * offset())};
                      row-gap: ${style().lyric.containerRowGap}rem;
                      flex-direction: ${style()?.lyric?.direction ?? 'column'};
                      align-items: ${anchorTypeToItemsAlignType(config()?.windowPosition.anchor)};
                      transform-origin: ${anchorTypeToOriginType(config()?.windowPosition.anchor)};
                    `}
                    {...containerProps}
                  />
                </div>
              </div>
            )}
          </For>
      </TransitionGroup>
    </div>
  );
}

export default Lyrics;
