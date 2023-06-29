import { createSignal, onMount } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

export interface LyricsItemProps {
  children: JSX.Element;
  status?: string;
  delay?: number;
}

const LyricsItem = (props: LyricsItemProps) => {
  let dom: HTMLDivElement;

  const [init, setInit] = createSignal(false);

  const style = () => {
    if (!init()) return `transition-delay: ${225 + props.delay * 75}ms;`;

    return `
      top: ${dom.offsetTop}px;
      transition-delay: ${props.delay * 75}ms;
      scale: ${props.status === 'stopped' ? '0.95' : '1'};
    `;
  };

  onMount(() => {
    dom.addEventListener('transitionend', () => {
      setInit(true);
    }, { once: true });
  });

  return (
    <div
      ref={dom}
      style={props.status === 'stopped' ? `${style()} opacity: 0.5;` : style()}
      class={`
        py-1 px-2 whitespace-pre-line text-center
        bg-gray-900/50 text-gray-100
        transition-all duration-[225ms] ease-out origin-right
      `}
    >
      {props.children}
    </div>
  );
};

export default LyricsItem;
