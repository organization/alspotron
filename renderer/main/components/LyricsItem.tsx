import { createSignal, onMount, splitProps } from 'solid-js';
// eslint-disable-next-line import/no-unresolved
import { JSX } from 'solid-js/jsx-runtime';
import { cx } from '../../utils/classNames';

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
    if (!init()) return `transition-delay: ${225 + (local.delay * 75)}ms;`;

    const rect = dom.getBoundingClientRect();

    return `
      width: ${rect.width}px;
      height: ${rect.height}px;
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
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
