import { createMemo, For, JSX, splitProps } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group'
import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import useConfig from '../../hooks/useConfig';
import useLyric from '../../hooks/useLyric';
import { cx } from '../../utils/classNames';
import { userCSSSelectors, userCSSTransitions } from '../../utils/userCSSSelectors';
import LyricsItem from './LyricsItem'

const Lyrics = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [config] = useConfig();
  const [, containerProps] = splitProps(props, ['class']);
  const { status } = usePlayingInfo();
  const [lyric] = useLyric();

  const animation = () => {
    const configuredName = config()?.style?.animation ?? 'pretty';
    if (configuredName === 'custom') {
      return userCSSTransitions['transition-lyric'];
    }

    return `lyric-${configuredName}`;
  };

  return (
    <div class={cx('flex flex-col gap-4', userCSSSelectors.lyrics, props.class)} {...containerProps}>
      <TransitionGroup name={`lyric-${animation()}`}>
        <For each={lyric() ?? []}>
          {(item, index) => item && (
            <LyricsItem
              class={userCSSSelectors['lyrics-item']}
              status={status()}
              delay={animation() === 'none' ? 0 : index()}
              style={`
                font-family: ${config()?.style.font};
                font-weight: ${config()?.style.fontWeight};
                font-size: ${config()?.style.lyric.fontSize}px;
                color: ${config()?.style.lyric.color};
                background-color: ${config()?.style.lyric.background};
                text-align: var(--text-align);
              `}
            >
              {item}
            </LyricsItem>
          )}
        </For>
      </TransitionGroup>
    </div>
  );
};

export default Lyrics;
