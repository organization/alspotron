import { For, JSX, Match, splitProps, Switch, untrack } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';

import LyricsItem from './LyricsItem';

import useStyle from '../../hooks/useStyle';
import { cx } from '../../utils/classNames';
import { Status } from '../../components/PlayingInfoProvider';
import { userCSSSelectors, userCSSTransitions, userCSSVariables } from '../../utils/userCSSSelectors';

import type { StyleConfig } from '../../../common/schema';

type LyricsProps = {
  lyrics: string[];
  status: Status;
};

const Lyrics = (props: LyricsProps) => (
  <For each={props.lyrics}>
    {(item, index) => (
      <LyricsItem
        class={cx(userCSSSelectors['lyrics-item'])}
        status={props.status}
        style={`${userCSSVariables['var-lyric-order']}: calc(${index()} + var(${userCSSVariables['var-lyric-order-offset']}, 0));`}
      >
        {item}
      </LyricsItem>
    )}
  </For>
);

type LyricsTransitionGroupProps = {
  animation: string;
  lyrics: string[];
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
              <Lyrics lyrics={lyrics} status={props.lyricsStatus} />
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
        <Lyrics lyrics={props.lyrics} status={props.lyricsStatus} />
      </TransitionGroup>
    </Container>
  );
};

type LyricTransitionProps = JSX.HTMLAttributes<HTMLDivElement> & {
  lyrics: string[];
  status: Status;
  style: string;
  theme?: StyleConfig;
};

const LyricsTransition = (props: LyricTransitionProps) => {
  const [, lyricsProps, passedProps] = splitProps(props, ['class'], ['lyrics', 'status']);

  const theme = useStyle();
  const style = () => props.theme ?? theme();

  const animation = () => {
    const configuredName = style()?.animation ?? 'pretty';
    if (configuredName === 'custom') {
      return userCSSTransitions['transition-lyric'];
    }

    return `lyric-${configuredName}`;
  };

  const Container = (containerProps: { children: JSX.Element }) => (
    <div class={cx('flex flex-col', userCSSSelectors.lyrics, props.class)} {...passedProps}>
      {containerProps.children}
    </div>
  );

  const LyricsTransitionGroup = (transitionProps: LyricsTransitionGroupProps) => (
    <Switch>
      <Match when={style().animationAtOnce}>
        <LyricsTransitionGroupAllAtOnce {...transitionProps} />
      </Match>
      <Match when={!style().animationAtOnce}>
        <LyricsTransitionGroupSequential {...transitionProps} />
      </Match>
    </Switch>
  );

  return (
    <LyricsTransitionGroup
      animation={animation()}
      container={Container}
      lyrics={lyricsProps.lyrics}
      lyricsStatus={lyricsProps.status}
    />
  );
};

export default LyricsTransition;
