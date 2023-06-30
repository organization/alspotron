import { Show, children, createSignal, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';
// eslint-disable-next-line import/no-unresolved
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
  let ignore = false;
  const [useMarquee, setUseMarquee] = createSignal(false);

  const updateOverflow = () => {
    const { scrollWidth, clientWidth } = dom;

    const offset = useMarquee() ? 2 : 1;
    const gap = useMarquee() ? local.gap : 0;
    const newValue = (scrollWidth - gap) / offset > clientWidth;

    const shouldChange = !ignore;
    ignore = false;

    if (newValue !== useMarquee() && shouldChange) {
      setUseMarquee(!!newValue);

      ignore = true;
    }
  }
  const observer = new MutationObserver(updateOverflow);
  onMount(() => {
    updateOverflow();
    ignore = false;

    observer.observe(dom, {
      characterData: true,
      childList: true,
      subtree: true,
      attributes: true,
    });
  });

  onCleanup(() => {
    observer.disconnect();
  });

  return (
    <div
      {...leftProps}
      ref={dom}
      class={cx('relative whitespace-nowrap overflow-auto flex flex-row justify-start items-center remove-scrollbar', props.class)}
      classList={{
        ...leftProps.classList,
        'overflow-hidden': useMarquee(),
      }}
    >
      <div class={`${useMarquee() ? 'marquee ignore' : ''}`} style={`padding-right: ${useMarquee() ? local.gap : 0}px`}>
        {child1()}
      </div>
      <Show when={useMarquee()}>
        <div class={'marquee'} style={`padding-right: ${local.gap}px`}>
          {child2()}
        </div>
      </Show>
    </div>
  );
};

export default Marquee;
