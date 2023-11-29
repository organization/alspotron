
import { For, createMemo, on, splitProps } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';

import LyricsTransition from './LyricsTransition';

import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import useLyric from '../../hooks/useLyric';

import { cx } from '../../utils/classNames';
import { userCSSSelectors, userCSSTransitions, userCSSVariables } from '../../utils/userCSSSelectors';

import useConfig from '../../hooks/useConfig';
import useStyle from '../../hooks/useStyle';

import type { JSX } from 'solid-js/jsx-runtime';
import { useClassStyle } from '../../hooks/useClassStyle';

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

  useClassStyle(userCSSSelectors['lyrics-container'], () => `
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: ${anchorTypeToItemsAlignType(config()?.windowPosition.anchor)};
    row-gap: ${style().lyric.multipleContainerRowGap}rem;
 
  `);
  useClassStyle(`${userCSSSelectors['wrapper--stopped']} .${userCSSSelectors['lyrics-container']}`, () => `
    opacity: ${style().lyric.stoppedOpacity};
  `);

  useClassStyle(userCSSSelectors['lyrics-transition-wrapper'], () => `
    top: var(--top, 0);
    width: fit-content;
  `);

  useClassStyle(userCSSSelectors['lyrics-wrapper'], () => `
    transition: all 0.25s;
  `);
  useClassStyle(userCSSSelectors['lyrics-wrapper--previous'], () => `
    scale: ${style().lyric.previousLyricScale};
    opacity: ${style().lyric.previousLyricOpacity};
    transform-origin: ${anchorTypeToOriginType(config()?.windowPosition.anchor, '100%')};
  `);
  useClassStyle(userCSSSelectors['lyrics-wrapper--next'], () => `
    scale: ${style().lyric.nextLyricScale};
    opacity: ${style().lyric.nextLyricOpacity};
    transform-origin: ${anchorTypeToOriginType(config()?.windowPosition.anchor)};
  `);

  useClassStyle(userCSSSelectors['lyrics'], () => `
    row-gap: ${style().lyric.containerRowGap}rem;
    flex-direction: ${style().lyric.direction ?? 'column'};
    align-items: ${anchorTypeToItemsAlignType(config()?.windowPosition.anchor)};
    transform-origin: ${anchorTypeToOriginType(config()?.windowPosition.anchor)};
   `);

  useClassStyle(userCSSSelectors['lyrics-item'], () => `
    top: var(--top);
    
    width: fit-content;
    
    padding: 0.25rem 0.5rem; /* y-1 x-2 */
    whitespace: pre-line;
    text-align: center;
    
    transition: all 0.225s ease-out;
    transition-delay: var(--transition-delay, 0s);
    transform-origin: ${anchorTypeToOriginType(config()?.windowPosition.anchor)};
    will-change: transform;

    font-family: ${style().font};
    font-weight: ${style().fontWeight};
    font-size: ${style().lyric.fontSize}px;
    color: ${style().lyric.color};
    background-color: ${style().lyric.background};
  `);

  useClassStyle(`${userCSSSelectors['wrapper--stopped']} .${userCSSSelectors['lyrics-item']}`, () => `
    scale: 0.95;
  `);

  return (
      <div
        class={cx(userCSSSelectors['lyrics-container'], props.class)}
        {...containerProps}
      >
        <TransitionGroup
          name={animation()}
          appear
        >
          <For each={lyricsRange()}>
            {(lyrics, index) => (
              <div
                onTransitionStart={(event) => event.currentTarget.style.setProperty('--top', `${event.currentTarget?.offsetTop}px`)}
                class={userCSSSelectors['lyrics-transition-wrapper']}
              >
                <div
                  classList={{
                    [userCSSSelectors['lyrics-wrapper']]: true,
                    [userCSSSelectors['lyrics-wrapper--previous']]: index() < (getPreviousLyricLength() ?? 0),
                    [userCSSSelectors['lyrics-wrapper--current']]: index() === (getPreviousLyricLength() ?? 0),
                    [userCSSSelectors['lyrics-wrapper--next']]: index() > (getPreviousLyricLength() ?? 0),
                  }}
                >
                  <LyricsTransition
                    lyrics={lyrics}
                    status={status()}
                    style={`${userCSSVariables['var-lyric-order-offset']}: ${orderOffset() + (index() * offset())};`}
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
