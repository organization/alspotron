// eslint-disable-next-line import/no-unresolved
import { JSX } from 'solid-js/jsx-runtime';
import { cx } from '../utils/classNames';

export type CardProps = JSX.HTMLAttributes<HTMLDivElement>
const Card = (props: CardProps) => {
  return (
    <div
      {...props}
      class={cx(
        `
          relative w-full px-4 py-3
          rounded shadow-sm bg-white/[7.5%] hover:bg-white/10 active:bg-white/5
          select-none
        `,
        props.class,
      )}
    >
      {props.children}
    </div>
  )
};

export default Card;
