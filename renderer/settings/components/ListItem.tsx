import { type JSX, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/classNames';

export interface ListItemProps extends JSX.LiHTMLAttributes<HTMLLIElement> {
  icon?: string | JSX.Element;
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
          relative w-full h-[36px] min-h-9 px-3
          flex flex-row justify-start items-center gap-1
          hover:shadow-sm hover:bg-black/[7.5%] active:shadow-sm active:bg-black/5
          dark:hover:bg-white/[7.5%] dark:active:bg-white/10
          select-none rounded
        `,
        local.selected && 'bg-black/5 dark:bg-white/5',
        leftProps.class,
      )}
    >
      <Show
        when={typeof local.icon === 'string'}
        fallback={local.icon as JSX.Element}
      >
        <img
          src={local.icon as string}
          alt="Local Icon"
        />
      </Show>
      <div class={'text-md ml-4'}>{local.title}</div>
    </li>
  );
};

export default ListItem;
