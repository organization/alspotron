import { For, createMemo } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group'

import LyricsItem from './LyricsItem'

import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import useConfig from '../../hooks/useConfig';
import useLyric from '../../hooks/useLyric';

const Lyrics = () => {
  const [config] = useConfig();
  const { status } = usePlayingInfo();
  const [lyric] = useLyric();

  const animation = () => config()?.style?.animation ?? 'pretty';

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
    <TransitionGroup name={`lyric-${animation()}`}>
      <For each={lyric() ?? []}>
        {(item, index) => item && (
          <LyricsItem
            status={status()}
            delay={animation() === 'none' ? 0 : index()}
            style={style()}
          >
            {item}
          </LyricsItem>
        )}
      </For>
    </TransitionGroup>
  );
};

export default Lyrics;
