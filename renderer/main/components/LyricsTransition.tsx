import { createMemo, For, JSX, on, Show, splitProps, untrack } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';

import LyricsItem from './LyricsItem';

import { Status } from '../../components/PlayingInfoProvider';
import useConfig from '../../hooks/useConfig';
import { cx } from '../../utils/classNames';
import { userCSSSelectors, userCSSTransitions, userCSSVariables } from '../../utils/userCSSSelectors';

type LyricsProps = {
  lyrics: string[];
  status: Status;
  style: string;
};

const Lyrics = (props: LyricsProps) => (
  <For each={props.lyrics}>
    {(item, index) => item && (
      <LyricsItem
        class={userCSSSelectors['lyrics-item']}
        status={props.status}
        style={`
          --order: ${index()};
          ${userCSSVariables['var-lyric-order']}: var(--order);
          ${props.style};
        `}
      >
        {item}
      </LyricsItem>
    )}
  </For>
);

type LyricsTransitionGroupProps = {
  animation: string;
  lyrics: string[];
  lyricsStyle: string;
  lyricsStatus: Status;
  container: ({ children }: { children: JSX.Element }) => JSX.Element;
};

const LyricsTransitionGroupAllAtOnce = (props: LyricsTransitionGroupProps) => {
  const lyricTransitionGroup = () => [props.lyrics];
  const Container = untrack(() => props.container);

  return (
    <Container>
      <TransitionGroup name={props.animation} appear>
        <For each={lyricTransitionGroup()}>
          {(lyrics) => (
            <Container>
              <Lyrics lyrics={lyrics} style={props.lyricsStyle} status={props.lyricsStatus} />
            </Container>
          )}
        </For>
      </TransitionGroup>
    </Container>
  );
};

const LyricsTransitionGroupSequential = (props: LyricsTransitionGroupProps) => {
  const Container = untrack(() => props.container);

  return (
    <Container>
      <TransitionGroup name={props.animation} appear>
        <Lyrics lyrics={props.lyrics} style={props.lyricsStyle} status={props.lyricsStatus} />
      </TransitionGroup>
    </Container>
  );
};

type LyricTransitionProps = JSX.HTMLAttributes<HTMLDivElement> & {
  lyrics: string[];
  status: Status;
};

const LyricsTransition = (props: LyricTransitionProps) => {
  const [, lyricsProps, passedProps] = splitProps(props, ['class'], ['lyrics', 'status']);

  const animation = () => {
    const configuredName = config()?.style?.animation ?? 'pretty';
    if (configuredName === 'custom') {
      return userCSSTransitions['transition-lyric'];
    }

    return `lyric-${configuredName}`;
  };

  const [config] = useConfig();
  const lyricsStyle = createMemo(on(config, (configData) => `
    ${configData ? `
      font-family: ${configData.style.font};
      font-weight: ${configData.style.fontWeight};
      font-size: ${configData.style.lyric.fontSize}px;
      color: ${configData.style.lyric.color};
      background-color: ${configData.style.lyric.background};
    ` : ''};
  `));

  const Container = (containerProps: { children: JSX.Element }) => (
    <div class={cx('flex flex-col', userCSSSelectors.lyrics, props.class)} {...passedProps}>
      {containerProps.children}
    </div>
  );

  const LyricsTransitionGroup = (transitionProps: LyricsTransitionGroupProps) => (
    <Show
      when={config()?.style.animationAtOnce}
      fallback={<LyricsTransitionGroupSequential {...transitionProps} />}
    >
      <LyricsTransitionGroupAllAtOnce {...transitionProps} />
    </Show>
  );

  return (
    <LyricsTransitionGroup 
      animation={animation()}
      container={Container}
      lyrics={lyricsProps.lyrics}
      lyricsStatus={lyricsProps.status}
      lyricsStyle={lyricsStyle()}
    />
  );
};

export default LyricsTransition;
