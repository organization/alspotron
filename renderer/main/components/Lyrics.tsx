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
    const tempLyrics = lyrics();
    if (tempLyrics === null) return null;

    const last = tempLyrics.lowerBound(progress() + TRANSITION_DURATION);
    if (!last.equals(tempLyrics.begin()) && last !== tempLyrics.begin()) {
      return last.pre().pointer[1];
    }

    return last.pointer[1];
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
