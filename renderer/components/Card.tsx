import { For, Match, Show, Switch, createSignal, getOwner, runWithOwner, splitProps } from 'solid-js';
import { Transition, TransitionGroup } from 'solid-transition-group';

import { cx } from '../utils/classNames';

import type { JSX } from 'solid-js/jsx-runtime';

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  expand?: boolean;
  onExpand?: (expand: boolean) => void;

  subCards?: JSX.Element[];
}
const Card = (props: CardProps) => {
  const [local, leftProps] = splitProps(props, ['expand', 'onExpand', 'subCards']);
  
  const [expand, setExpand] = local.onExpand ? [() => local.expand, local.onExpand] : createSignal(local.expand);

  const isSubCard = () => 'subCards' in local;

  const onClick: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (event) => {
    if (isSubCard()) {
      setExpand(!(expand() ?? false));
    }

    if (typeof leftProps.onClick === 'function') return leftProps.onClick(event);
  };

  const mainCard = (
    <div
      {...leftProps}
      class={cx(
        `
          relative w-full min-h-[67px] px-4 py-3
          shadow-sm bg-white/[7.5%] hover:bg-white/10 active:bg-white/5
          select-none
        `,
        leftProps.class,
        isSubCard() && 'rounded-t hover:shadow-[0_0_0_1px] hover:shadow-white/10',
        !isSubCard() && 'rounded',
        isSubCard() && !expand() && 'rounded-b',
      )}
      onClick={onClick}
    >
      {leftProps.children}
      <Switch>
        <Match when={expand() === true}>
          <svg class={'w-4 h-4 fill-none ml-auto'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.293 15.707a1 1 0 0 0 1.414 0L12 9.414l6.293 6.293a1 1 0 0 0 1.414-1.414l-7-7a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 0 1.414Z" class={'fill-white'} />
          </svg>
        </Match>
        <Match when={isSubCard()}>
          <svg class={'w-4 h-4 fill-none ml-auto'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.293 8.293a1 1 0 0 1 1.414 0L12 14.586l6.293-6.293a1 1 0 1 1 1.414 1.414l-7 7a1 1 0 0 1-1.414 0l-7-7a1 1 0 0 1 0-1.414Z" class={'fill-white'} />
          </svg>
        </Match>
      </Switch>
    </div>
  );

  return <Show when={isSubCard()} fallback={mainCard}><div class={'flex flex-col justify-start itmes-stretch gap-[1px]'}>
      {mainCard}
      <TransitionGroup name={'card'}>
        <Show when={expand()}>
          <For each={local.subCards}>
            {(element, index) => (
              <Card
                class={'hover:!bg-white/[7.5%]'}
                classList={{
                  '!rounded-none': index() !== local.subCards.length - 1,
                  '!rounded-t-none rounded-b': index() === local.subCards.length - 1,
                }}
              >
                {element}
              </Card>
            )}
          </For>
        </Show>
      </TransitionGroup>
    </div></Show>;
};

export default Card;
