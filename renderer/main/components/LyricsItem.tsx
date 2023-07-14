import { createMemo, createSignal, onMount, splitProps } from 'solid-js';

import { Status } from '../../components/PlayingInfoProvider';
import useConfig from '../../hooks/useConfig';
import { cx } from '../../utils/classNames';

import type { JSX } from 'solid-js/jsx-runtime';

export interface LyricsItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
  style?: string;
  status?: Status;
}

const LyricsItem = (props: LyricsItemProps) => {
  const [local, leftProps] = splitProps(props, ['status']);

  let dom!: HTMLDivElement;

  const [init, setInit] = createSignal(false);

  const style = createMemo(() => {
    if (!init()) return 'transition-delay: calc(255ms + var(--order) * 75ms);';

    return `
      top: ${dom.offsetTop}px;
      transition-delay: calc(var(--order) * 75ms);
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
      style={`${style()}; ${props.style}`}
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
