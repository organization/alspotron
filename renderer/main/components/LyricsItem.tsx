import { createMemo, createSignal, onMount, splitProps } from 'solid-js';

import { Status } from '../../components/PlayingInfoProvider';

import { userCSSVariables } from '../../utils/userCSSSelectors';

import type { JSX } from 'solid-js/jsx-runtime';

export interface LyricsItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
  style?: string;
  status?: Status;
}

const LyricsItem = (props: LyricsItemProps) => {
  const [, leftProps] = splitProps(props, ['status']);

  let dom!: HTMLDivElement;

  const [init, setInit] = createSignal(false);

  const style = createMemo(() => {
    if (!init()) return `--transition-delay: calc(255ms + var(${userCSSVariables['var-lyric-order']}) * 75ms);`;

    return `
      --transition-delay: calc(var(${userCSSVariables['var-lyric-order']}) * 75ms);
      --top: ${dom.offsetTop}px;
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
      class={leftProps.class}
    >
      {leftProps.children}
    </div>
  );
};

export default LyricsItem;
