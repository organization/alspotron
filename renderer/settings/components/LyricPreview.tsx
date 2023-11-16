import { createSignal, onCleanup, onMount, untrack, JSX, splitProps } from 'solid-js';
import { Trans, useTransContext } from '@jellybrick/solid-i18next';

import Card from '../../components/Card';
import UserCSS from '../../components/UserCSS';
import LyricProgressBar from '../../main/components/LyricProgressBar';
import LyricsTransition from '../../main/components/LyricsTransition';
import { cx } from '../../utils/classNames';

import type { StyleConfig } from '../../../common/types';

const isMac = /Mac/.test(navigator.userAgent);
const isWindow = /Windows/.test(navigator.userAgent);

export interface LyricPreviewProps extends JSX.HTMLAttributes<HTMLDivElement> {
  theme: StyleConfig;
}

const LyricPreview = (props: LyricPreviewProps) => {
  const [local, leftProps] = splitProps(props, ['theme']);
  const [t] = useTransContext();

  const PREVIEW_TEXT_A = [
    t('setting.theme.animation.preview-text-a.0'),
    t('setting.theme.animation.preview-text-a.1'),
    t('setting.theme.animation.preview-text-a.2'),
  ];

  const PREVIEW_TEXT_B = [
    t('setting.theme.animation.preview-text-b.0'),
    t('setting.theme.animation.preview-text-b.1'),
    t('setting.theme.animation.preview-text-b.2'),
  ];

  const [animationPreview, setAnimationPreview] = createSignal(PREVIEW_TEXT_A);

  const lyricStyle = () => {
    let result = '';
    const style = props.theme;

    if (style?.nowPlaying.maxWidth) result += `max-width: ${style.nowPlaying.maxWidth}px;`;
    if (style?.nowPlaying.color) result += `color: ${style.nowPlaying.color};`;
    if (style?.nowPlaying.background) result += `background-color: ${style.nowPlaying.background};`;
    if (style?.font) result += `font-family: ${style.font};`;
    if (style?.fontWeight) result += `font-weight: ${style.fontWeight};`;

    return result;
  };

  const textStyle = () => {
    let result = '';

    const style = props.theme;
    if (style?.nowPlaying.fontSize) result += `font-size: ${style.nowPlaying.fontSize}px;`;
    
    return result;
  };

  const progressStyle = () => {
    let result = '';

    const style = props.theme;
    if (style?.nowPlaying.backgroundProgress) result += `background-color: ${style.nowPlaying.backgroundProgress};`;

    return result;
  };

  let interval: NodeJS.Timer | null = null;
  onMount(() => {
    let isTick = false;
    interval = setInterval(() => {
      const nextPreview = untrack(() => isTick ? PREVIEW_TEXT_A : PREVIEW_TEXT_B);

      isTick = !isTick;
      setAnimationPreview(nextPreview);
    }, 1500);
  });

  onCleanup(() => {
    if (typeof interval === 'number') clearInterval(interval);
  });

  return (
    <Card
      {...leftProps}
      class={cx(
        'w-full flex flex-row justify-between items-center gap-1',
        isMac && 'bg-gray-200/90 dark:bg-gray-800/90',
        isWindow && 'bg-slate-100/80 dark:bg-gray-800/80',
        leftProps.class,
      )}
      subCards={[
        <>
          <LyricProgressBar
            theme={props.theme}
            style={lyricStyle()}
            textStyle={textStyle()}
            progressStyle={progressStyle()}
          />
          <UserCSS theme={props.theme} />
        </>,
        <LyricsTransition
          theme={props.theme}
          class={'w-full items-end'}
          style={`row-gap: ${local.theme.lyric.containerRowGap}rem;`}
          lyrics={animationPreview()}
          status="playing"
        />,
      ]}
    >
      <Trans key={'setting.theme.preview'} />
    </Card>
  )
};

export default LyricPreview;
