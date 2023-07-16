import { createEffect, createSignal, splitProps } from 'solid-js';

import icon from '../../../assets/icon_music.png';
import Marquee from '../../components/Marquee';
import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import useConfig from '../../hooks/useConfig';
import { cx } from '../../utils/classNames';

import { formatTime } from '../../utils/formatTime';
import { userCSSSelectors } from '../../utils/userCSSSelectors';

import type { JSX } from 'solid-js/jsx-runtime';

interface LyricProgressBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  style?: string;
  class?: string;

  progressStyle?: string;
  progressClass?: string;

  textStyle?: string;
  textClass?: string;
}

const LyricProgressBar = (props: LyricProgressBarProps) => {
  const [config] = useConfig();
  const { coverUrl, title, artist, progress, duration, status } = usePlayingInfo();
  const [style, containerProps] = splitProps(
    props,
    ['class', 'style', 'progressClass', 'progressStyle', 'textClass', 'textStyle'],
  );
  const [progressTransition, setProgressTransition] = createSignal(false);

  let percent = 0;
  let oldPercent = 0;

  createEffect(() => {
    oldPercent = percent;
    percent = progress() / duration();

    if (Math.abs(percent - oldPercent) > 0.01) {
      setProgressTransition(true)
    } else if (progressTransition()) {
      setProgressTransition(false)
    }
  });

  return (
    <div
      style={`
        --percent: ${progress() / duration() * 100}%;
        --duration: ${formatTime(duration())};
        --progress: ${formatTime(progress())};
        opacity: ${status() === 'stopped' ? config()?.style.nowPlaying.stoppedOpacity : 1};
        will-change: opacity, transform;
        ${style.style ?? ''}
      `}
      class={cx(
        `
          relative p-3 transition-all duration-[225ms] ease-out z-0
          bg-gray-900/50 text-gray-50 rounded-md overflow-hidden
        `,
        userCSSSelectors.nowplaying,
        style.class,
      )}
      {...containerProps}
    >
      <div
        class={cx(
          `
            absolute inset-0 bg-gray-500 z-[-1] scale-x-[--percent] origin-left
            ${progressTransition() ? 'transition-transform duration-225 ease-[cubic-bezier(0.34, 1.56, 0.64, 1)]' : ''}
          `,
          userCSSSelectors['nowplaying-progress'],
          style.progressClass,
        )}
        style={style.progressStyle}
      />
      <div class={'flex flex-row justify-start items-center gap-2 z-20'}>
        <img
          src={coverUrl() ?? icon}
          class={`
            w-6 h-6 object-contain transition-all duration-[225ms] ease-out
            ${userCSSSelectors['nowplaying-cover']}
            ${status() === 'stopped' ? 'grayscale' : ''}
            ${status() === 'stopped' ? 'scale-95' : ''}
          `}
          alt={'Thumbnail'}/>
        <Marquee gap={32} style={userCSSSelectors['nowplaying-marquee']}>
          <div
            class={cx('w-fit flex flex-row justify-start items-center gap-2', style.textClass)}
            style={style.textStyle}
          >
            <span class={userCSSSelectors['nowplaying-artist']}>{artist()}</span>
            {' - '}
            <span class={userCSSSelectors['nowplaying-title']}>{title()}</span>
          </div>
        </Marquee>
      </div>
    </div>
  )
};

export default LyricProgressBar;
