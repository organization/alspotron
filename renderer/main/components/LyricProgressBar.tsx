import { splitProps } from 'solid-js';
import icon from '../../../assets/icon_music.png';
import Marquee from '../../components/Marquee';
import { cx } from '../../utils/classNames';
import { usePlayingInfo } from './PlayingInfoProvider';
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
  const { coverUrl, title, artist, progress, duration, status } = usePlayingInfo();
  const [style, containerProps] = splitProps(
    props,
    ['class', 'style', 'progressClass', 'progressStyle', 'textClass', 'textStyle'],
  );

  return (
    <div
      style={`
        --percent: ${progress() / duration() * 100}%;
        opacity: ${status() === 'stopped' ? 0.5 : 1};
        ${style.style}
      `}
      class={cx(
        `
          relative p-3 transition-all duration-[225ms] ease-out z-0
          bg-gray-900/50 text-gray-50 rounded-md overflow-hidden
        `,
        style.class,
      )}
      {...containerProps}
    >
      <div
        class={cx(
          `
            absolute inset-0 bg-gray-500 z-[-1] scale-x-[--percent] origin-left
            transition-all duration-225 ease-[cubic-bezier(0.34, 1.56, 0.64, 1)]
          `,
          style.progressClass,
        )}
        style={style.progressStyle}
      />
      <div class={'flex flex-row justify-start items-center gap-2 z-20'}>
        <img
          src={coverUrl() ?? icon}
          class={`
            w-6 h-6 object-contain transition-all duration-[225ms] ease-out
            ${status() === 'stopped' ? 'grayscale' : ''}
            ${status() === 'stopped' ? 'scale-95' : ''}
          `}
        />
        <Marquee gap={32}>
          <div
            class={cx('w-fit flex flex-row justify-start items-center gap-2', style.textClass)}
            style={style.textStyle}
          >
            {`${artist()} - ${title()}`}
          </div>
        </Marquee>
      </div>
    </div>
  )
};

export default LyricProgressBar;
