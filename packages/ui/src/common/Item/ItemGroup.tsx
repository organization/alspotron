import { JSX } from 'solid-js';
import { itemGroupStyle } from './ItemGroup.css';

export type ItemGroupProps = JSX.HTMLAttributes<HTMLUListElement> & {
  children?: JSX.Element;
};
export const ItemGroup = (props: ItemGroupProps) => {
  return (
    <ul
      {...props}
      classList={{
        [itemGroupStyle]: true,
        [props.class!]: !!props.class,
        ...props.classList,
      }}
      data-item-group
    >
      {props.children}
    </ul>
  )
};
