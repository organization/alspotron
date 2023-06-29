import Marquee from '../../components/Marquee';
import icon from '../../../assets/icon_music.png';
import { JSX } from 'solid-js/jsx-runtime';
import { splitProps } from 'solid-js';
import { cx } from '../../utils/classNames';

interface LyricProgressBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  percent: number;
  title: string;
  artist: string;
  status?: string;
  coverUrl?: string;

  progressStyle?: string;
  progressClass?: string;

  textStyle?: string;
  textClass?: string;
}

const LyricProgressBar = (props: LyricProgressBarProps) => {
  const [local, style, leftProps] = splitProps(
    props,
    ['percent', 'title', 'artist', 'status', 'coverUrl'],
    ['progressClass', 'progressStyle', 'textClass', 'textStyle'],
  );

  return (
    <div
      {...leftProps}
      style={`--percent: ${local.percent * 100}%; opacity: ${local.status === 'stopped' ? 0.5 : 1}; ${leftProps.style}`}
      class={cx(
        `
          relative p-3 transition-all duration-[225ms] ease-out z-0
          bg-gray-900/50 text-gray-50 rounded-md overflow-hidden
        `,
        leftProps.class,
      )}
    >
      <div
        class={cx(
          'absolute inset-0 bg-gray-500 z-[-1] scale-x-[--percent] origin-left transition-all duration-225 ease-[cubic-bezier(0.34, 1.56, 0.64, 1)]',
          style.progressClass,
        )}
        style={style.progressStyle}
      />
      <div
        class={`
          flex flex-row justify-start items-center gap-2 z-20
        `}
      >
        <img
          src={local.coverUrl ?? icon}
          class={`
            w-6 h-6 object-contain transition-all duration-[225ms] ease-out
            ${local.status === 'stopped' ? 'grayscale' : ''}
            ${local.status === 'stopped' ? 'scale-95' : ''}
          `}
        />
        <Marquee gap={32}>
          <div
            class={cx('w-fit flex flex-row justify-start items-center gap-2', style.textClass)}
            style={style.textStyle}
          >
            {local.artist}
            {' '}
            -
            {' '}
            {local.title}
          </div>
        </Marquee>
      </div>
    </div>
  )
};

export default LyricProgressBar;
