
import { For, Index, createEffect, createMemo, on, splitProps } from 'solid-js';

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

  const orderOffset = () => previousLyrics().length * 3;

  const nextLyricsStyle = createMemo(on(config, (configData) => configData ? `
    opacity: ${configData?.style.lyric?.nextLyricOpacity};
    transform: scale(${configData?.style.lyric?.nextLyricScale});
    transform-origin: ${anchorTypeToOriginType(configData.windowPosition.anchor)};
  ` : ''));

  const previousLyricsStyle = createMemo(on(config, (configData) => configData ? `
    opacity: ${configData?.style.lyric?.previousLyricOpacity};
    transform: scale(${configData?.style.lyric?.previousLyricScale});
    transform-origin: ${anchorTypeToOriginType(configData.windowPosition.anchor, '100%')};
  ` : ''));

  return (
    <div
      class={cx('w-full flex flex-col', props.class, userCSSSelectors['lyrics-wrapper'])}
      style={`
        row-gap: ${config()?.style.lyric.containerRowGap}rem;
        opacity: ${status() !== 'playing' ? config()?.style.lyric.stoppedOpacity : 1}; ${props.style ?? ''};
      `}
      {...containerProps}
    >
    <div
      class={cx('w-full flex flex-col', props.class, userCSSSelectors['previous-lyrics-wrapper'])}
      style={previousLyricsStyle()}
    >
      <Index each={previousLyrics()}>
        {(lyric, index) => (
          <LyricsTransition
            lyrics={lyric() ?? []}
            status={status()}
            style={`
              --order-offset: ${orderOffset() + ((index + 1) * -3)};
              row-gap: ${config()?.style.lyric.containerRowGap}rem;
              align-items: ${anchorTypeToItemsAlignType(config()?.windowPosition.anchor)};
              flex-direction: ${config()?.windowPosition?.direction ?? 'column'};
            `}
            {...containerProps}
          />
        )}
      </Index>
    </div>
      <LyricsTransition
        lyrics={lyrics() ?? []}
        status={status()}
        style={`
          --order-offset: ${orderOffset()};
          row-gap: ${config()?.style.lyric.containerRowGap}rem;
          align-items: ${anchorTypeToItemsAlignType(config()?.windowPosition.anchor)};
          flex-direction: ${config()?.windowPosition?.direction ?? 'column'};
        `}
        {...containerProps}
      />
      <div
        class={cx('w-full flex flex-col', props.class, userCSSSelectors['next-lyrics-wrapper'])}
        style={nextLyricsStyle()}
      >
        <Index each={nextLyrics()}>
          {(lyric, index) => (
            <LyricsTransition
              lyrics={lyric() ?? []}
              status={status()}
              style={`
                --order-offset: ${orderOffset() + ((index + 1) * 3)};
                row-gap: ${config()?.style.lyric.containerRowGap}rem;
                align-items: ${anchorTypeToItemsAlignType(config()?.windowPosition.anchor)};
                flex-direction: ${config()?.windowPosition?.direction ?? 'column'};
              `}
              {...containerProps}
            />
          )}
        </Index>
      </div>
    </div>
  );
}

export default Lyrics;
