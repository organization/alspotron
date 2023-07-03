import { createMemo, For } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group'
import useConfig from '../../hooks/useConfig';
import LyricsItem from './LyricsItem'
import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import useLyric from '../../hooks/useLyric';

const Lyrics = () => {
  const [config] = useConfig();
  const { status } = usePlayingInfo();
  const [lyric] = useLyric();

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
