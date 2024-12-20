import { createEffect, createSignal, splitProps } from 'solid-js';

import { Marquee } from '@suyongs/solid-utility';

import icon from '../../../assets/icon_music.png';
import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import useStyle from '../../hooks/useStyle';
import { cx } from '../../utils/classNames';

import { formatTime } from '../../utils/formatTime';

import {
  userCSSSelectors,
  userCSSVariables,
} from '../../utils/userCSSSelectors';

import { useClassStyle } from '../../hooks/useClassStyle';

import type { JSX } from 'solid-js/jsx-runtime';
import type { StyleConfig } from '../../../common/schema';

interface LyricProgressBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  style?: string;
  class?: string;

  progressStyle?: string;
  progressClass?: string;

  textStyle?: string;
  textClass?: string;

  theme?: StyleConfig;
}

const LyricProgressBar = (props: LyricProgressBarProps) => {
  const theme = useStyle();
  const themeStyle = () => props.theme ?? theme();
  const { coverUrl, title, artist, progress, duration, status } =
    usePlayingInfo();
  const [style, containerProps] = splitProps(props, [
    'class',
    'style',
    'progressClass',
    'progressStyle',
    'textClass',
    'textStyle',
  ]);
  const [progressTransition, setProgressTransition] = createSignal(false);

  let percent = 0;
  let oldPercent = 0;

  createEffect(() => {
    oldPercent = percent;
    percent = progress() / duration();

    if (Math.abs(percent - oldPercent) > 0.01) {
      setProgressTransition(true);
    } else if (progressTransition()) {
      setProgressTransition(false);
    }
  });

  useClassStyle(userCSSSelectors.nowplaying, () => {
    const style = themeStyle();

    return `
      position: relative;
      
      max-width: ${style.nowPlaying.maxWidth}px;
      padding: 0.75rem;

      color: ${style.nowPlaying.color};
      background-color: ${style.nowPlaying.background};
      font-family: ${style.font};
      font-weight: ${style.fontWeight};
      opacity: ${status() !== 'playing' ? style.nowPlaying.stoppedOpacity : 1};
      border-radius: 0.375rem;
      
      overflow: hidden;
      
      will-change: opacity, transform;
      transition: all 0.225s ease-out;
    `;
  });

  useClassStyle(
    userCSSSelectors['nowplaying-progress-bar'],
    () => `
    position: absolute;
    inset: 0;
  `,
  );

  useClassStyle(
    userCSSSelectors['nowplaying-progress'],
    () => `
    position: absolute;
    inset: 0;
    
    background-color: ${themeStyle().nowPlaying.backgroundProgress};
    
    transform-origin: left;
    transform: scaleX(var(${userCSSVariables['var-nowplaying-percent']}));
    
    ${progressTransition() ? 'transition: transform 0.225s cubic-bezier(0.34, 1.56, 0.64, 1);' : ''}
  `,
  );

  useClassStyle(
    userCSSSelectors['nowplaying-container'],
    () => `
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 0.5rem;
  `,
  );

  useClassStyle(
    userCSSSelectors['nowplaying-cover'],
    () => `
    width: 1.5rem;
    height: 1.5rem;
    
    object-fit: contain;

    transition: all 0.225s ease-out;
  `,
  );

  useClassStyle(
    `${userCSSSelectors['wrapper--stopped']} .${userCSSSelectors['nowplaying-cover']}`,
    () => `
    filter: grayscale(100%);
    scale: 95%;
  `,
  );

  const textStyle = () => `
    font-size: ${themeStyle().nowPlaying.fontSize}px;
  `;
  useClassStyle(
    userCSSSelectors['nowplaying-playing-text'],
    () => `
    ${textStyle()}
    
    width: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 0.5rem;
  `,
  );

  useClassStyle(userCSSSelectors['nowplaying-artist'], textStyle);
  useClassStyle(userCSSSelectors['nowplaying-divider'], textStyle);
  useClassStyle(userCSSSelectors['nowplaying-title'], textStyle);

  return (
    <div
      style={`
        ${userCSSVariables['var-nowplaying-percent']}: ${duration() > 0 ? (progress() / duration()) * 100 : 0}%;
        ${userCSSVariables['var-nowplaying-duration']}: '${formatTime(duration())}';
        ${userCSSVariables['var-nowplaying-progress']}: '${formatTime(progress())}';
        ${style.style ?? ''}
      `}
      classList={{
        [userCSSSelectors.nowplaying]: true,
        [style.class ?? '']: !!style.class,
      }}
      {...containerProps}
    >
      <div class={userCSSSelectors['nowplaying-progress-bar']}>
        <span
          class={cx(
            userCSSSelectors['nowplaying-progress'],
            style.progressClass,
          )}
          style={style.progressStyle}
        />
      </div>
      <div class={userCSSSelectors['nowplaying-container']}>
        <img
          src={coverUrl() ?? icon}
          classList={{
            [userCSSSelectors['nowplaying-cover']]: true,
            [userCSSSelectors['nowplaying-cover--empty']]: !coverUrl(),
          }}
          style={`${userCSSVariables['var-cover-url']}: '${coverUrl() ?? icon}';`}
          alt={'Thumbnail'}
        />
        <Marquee gap={32} class={userCSSSelectors['nowplaying-marquee']}>
          <div
            class={userCSSSelectors['nowplaying-playing-text']}
            style={style.textStyle}
          >
            <span
              class={cx(userCSSSelectors['nowplaying-artist'], style.textClass)}
              style={style.textStyle}
            >
              {artist()}
            </span>
            <span
              class={cx(
                userCSSSelectors['nowplaying-divider'],
                style.textClass,
              )}
              style={style.textStyle}
            >
              {' - '}
            </span>
            <span
              class={cx(userCSSSelectors['nowplaying-title'], style.textClass)}
              style={style.textStyle}
            >
              {title()}
            </span>
          </div>
        </Marquee>
      </div>
    </div>
  );
};

export default LyricProgressBar;
