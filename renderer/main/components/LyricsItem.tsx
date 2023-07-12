import { createMemo, createSignal, mergeProps, onMount, splitProps } from 'solid-js';

import { cx } from '../../utils/classNames';

import type { JSX } from 'solid-js/jsx-runtime';

export interface LyricsItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
  status?: string;
  delay?: number;
}

const LyricsItem = (props: LyricsItemProps) => {
  const [local, leftProps] = splitProps(
    // eslint-disable-next-line solid/reactivity
    mergeProps({ delay: 0 }, props),
    ['status', 'delay'],
  );

  let dom!: HTMLDivElement;

  const [init, setInit] = createSignal(false);

  const style = createMemo(() => {
    if (!init()) return `transition-delay: ${225 + (local.delay * 75)}ms;`;

    return `
      top: ${dom.offsetTop}px;
      transition-delay: ${local.delay * 75}ms;
      scale: ${local.status === 'stopped' ? '0.95' : '1'};
    `;
  });

  onMount(() => {
    dom.addEventListener('transitionend', () => {
      dom.style.willChange = 'auto';
      setInit(true);
    }, { once: true });
  });

  return (
    <div
      {...leftProps}
      ref={dom}
      style={local.status === 'stopped' ? `${style()} opacity: 0.5; ${props.style as string}` : `${style()}; ${props.style as string}`}
      class={cx(`
        py-1 px-2 whitespace-pre-line text-center
        bg-gray-900/50 text-gray-100
        transition-all duration-[225ms] ease-out origin-right will-change-transform
      `, leftProps.class)}
    >
      {leftProps.children}
    </div>
  );
};

export default LyricsItem;
