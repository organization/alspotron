import { cx } from '../../utils/classNames';
import { createSignal, onMount, splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

export interface LyricsItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
  status?: string;
  delay?: number;
}

const LyricsItem = (props: LyricsItemProps) => {
  const [local, leftProps] = splitProps(props, ['status', 'delay']);

  let dom: HTMLDivElement;

  const [init, setInit] = createSignal(false);

  const style = () => {
    if (!init()) return `transition-delay: ${225 + local.delay * 75}ms;`;

    return `
      top: ${dom.offsetTop}px;
      transition-delay: ${local.delay * 75}ms;
      scale: ${local.status === 'stopped' ? '0.95' : '1'};
    `;
  };

  onMount(() => {
    dom.addEventListener('transitionend', () => {
      setInit(true);
    }, { once: true });
  });

  return (
    <div
      {...leftProps}
      ref={dom}
      style={local.status === 'stopped' ? `${style()} opacity: 0.5; ${props.style}` : `${style()}; ${props.style}`}
      class={cx(`
        py-1 px-2 whitespace-pre-line text-center
        bg-gray-900/50 text-gray-100
        transition-all duration-[225ms] ease-out origin-right
      `, leftProps.class)}
    >
      {leftProps.children}
    </div>
  );
};

export default LyricsItem;
