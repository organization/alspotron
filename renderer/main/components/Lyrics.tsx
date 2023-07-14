import { createMemo, For, splitProps } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group'

import LyricsItem from './LyricsItem'

import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import useConfig from '../../hooks/useConfig';
import useLyric from '../../hooks/useLyric';
import { cx } from '../../utils/classNames';
import { userCSSSelectors, userCSSTransitions } from '../../utils/userCSSSelectors';

import type { JSX } from 'solid-js/jsx-runtime';

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

  const style = createMemo(() => {
    const result: Record<string, string> = {
      'text-align': 'var(--text-align)',
    };
    const configData = config();
    
    if (configData?.style?.font) result['font-family'] = configData?.style.font;
    if (configData?.style?.fontWeight) result['font-weight'] = configData?.style.fontWeight;
    if (configData?.style?.lyric?.fontSize) result['font-size'] = `${configData.style.lyric.fontSize}px`;
    if (configData?.style?.lyric?.color) result['color'] = configData?.style.lyric.color;
    if (configData?.style?.lyric?.background) result['background-color'] = configData?.style.lyric.background;

    return Object.entries(result).map(([key, value]) => `${key}: ${value};`).join(' ');
  });

  return (
    <div class={cx('flex flex-col gap-4', userCSSSelectors.lyrics, props.class)} {...containerProps}>
      <TransitionGroup name={`lyric-${animation()}`}>
        <For each={lyric() ?? []}>
          {(item, index) => item && (
            <LyricsItem
              class={userCSSSelectors['lyrics-item']}
              status={status()}
              delay={animation() === 'none' ? 0 : index()}
              style={style()}
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
