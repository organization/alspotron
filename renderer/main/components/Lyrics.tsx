import { createMemo, For } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group'
import useConfig from '../../hooks/useConfig';
import LyricsItem from './LyricsItem'
import { usePlayingInfo } from './PlayingInfoProvider';

const TRANSITION_DURATION = 1225;

const Lyrics = () => {
  const [config] = useConfig();
  const { status, lyrics, progress } = usePlayingInfo();
  const lyric = createMemo(() => {
    if (lyrics() === null) return lyrics()?.get(0);
    return lyrics().lowerEntry(progress() + TRANSITION_DURATION)?.[1];
  });

  return (
      <TransitionGroup name={'lyric'}>
        <For each={lyric() ?? []}>
          {(item, index) => item && (
            <LyricsItem
              status={status()}
              delay={index()}
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
    );
};

export default Lyrics;
