import { createSignal, onCleanup, onMount, untrack, type JSX, splitProps } from 'solid-js';
import { Trans, useTransContext } from '@jellybrick/solid-i18next';

import Card from '../../components/Card';
import UserCSS from '../../components/UserCSS';
import LyricProgressBar from '../../main/components/LyricProgressBar';
import LyricsTransition from '../../main/components/LyricsTransition';
import { cx } from '../../utils/classNames';

import { userCSSTransitions } from '../../utils/userCSSSelectors';
import { useLyricsStyle } from '../../main/components/Lyrics';
import useConfig from '../../hooks/useConfig';

import type { StyleConfig } from '../../../common/schema';

const isMac = /Mac/.test(navigator.userAgent);
const isWindow = /Windows/.test(navigator.userAgent);

export interface LyricPreviewProps extends JSX.HTMLAttributes<HTMLDivElement> {
  theme: StyleConfig;
}

const LyricPreview = (props: LyricPreviewProps) => {
  const [local, leftProps] = splitProps(props, ['theme']);
  const [t] = useTransContext();
  const [config] = useConfig();

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

  const animation = () => {
    const configuredName = props.theme?.animation ?? 'pretty';
    if (configuredName === 'custom') {
      return userCSSTransitions['transition-lyric'];
    }

    return `lyric-${configuredName}`;
  };

  let interval: number | null = null;
  onMount(() => {
    let isTick = false;
    interval = window.setInterval(() => {
      const nextPreview = untrack(() => (isTick ? PREVIEW_TEXT_A : PREVIEW_TEXT_B));

      isTick = !isTick;
      setAnimationPreview(nextPreview);
    }, 1500);
  });

  onCleanup(() => {
    if (typeof interval === 'number') clearInterval(interval);
  });

  useLyricsStyle(() => props.theme, config);

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
          <LyricProgressBar theme={props.theme} />
          <UserCSS theme={props.theme} />
        </>,
        <LyricsTransition
          animation={animation()}
          class={'w-full items-end'}
          style={`row-gap: ${local.theme.lyric.containerRowGap}rem;`}
          lyrics={animationPreview()}
          status={'playing'}
        />,
      ]}
    >
      <Trans key={'setting.theme.preview'} />
    </Card>
  );
};

export default LyricPreview;
