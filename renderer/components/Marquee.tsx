import { Show, children, createSignal, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

import { cx } from '../utils/classNames';

export interface MarqueeProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
  gap?: number;
}
const Marquee = (props: MarqueeProps) => {
  const [local, leftProps] = splitProps(mergeProps({ gap: 0 }, props), ['gap']);
  const child1 = children(() => props.children);
  const child2 = children(() => props.children);

  let dom: HTMLDivElement;
  const [useMarquee, setUseMarquee] = createSignal(false);

  const updateOverflow = () => {
    const { scrollWidth, clientWidth } = dom;

    const offset = useMarquee() ? 2 : 1;
    const newValue = (scrollWidth - local.gap) / offset > clientWidth;
    if (newValue !== useMarquee()) {
      setUseMarquee(newValue);
    }
  }
  const observer = new MutationObserver(updateOverflow);
  onMount(() => {
    updateOverflow();

    observer.observe(dom, {
      characterData: true,
      childList: true,
      subtree: true,
    });
  });

  onCleanup(() => {
    observer.disconnect();
  });

  return (
    <div
      {...leftProps}
      ref={dom}
      class={cx('relative whitespace-nowrap overflow-auto flex flex-row justify-start items-center', props.class)}
      classList={{
        ...leftProps.classList,
        'overflow-hidden': useMarquee(),
      }}
    >
      <div class={`${useMarquee() ? 'marquee ignore' : ''}`} style={`padding-right: ${local.gap}px`}>
        {child1()}
      </div>
      <Show when={useMarquee()}>
        <div class={`marquee`} style={`padding-right: ${local.gap}px`}>
          {child2()}
        </div>
      </Show>
    </div>
  )
};

export default Marquee;
