import { cx } from '../../utils/classNames';
import { JSX, Show, splitProps } from 'solid-js';

export interface ListItemProps extends JSX.LiHTMLAttributes<HTMLLIElement> {
  icon?: string;
  selected?: boolean;
  title?: string;
}

const ListItem = (props: ListItemProps) => {
  const [local, leftProps] = splitProps(props, ['icon', 'selected', 'title']);

  return (
    <li
      {...leftProps}
      class={cx(
        `
          relative w-full h-9 px-3
          flex flex-row justify-start items-center gap-1
          rounded shadow-sm hover:bg-white/[7.5%] active:bg-white/5
          select-none
        `,
        local.selected && 'bg-white/10',
        leftProps.class,
      )}
    >
      <img src={local.icon} />
      <div>
        {local.title}
      </div>
    </li>
  );
};

export default ListItem;
