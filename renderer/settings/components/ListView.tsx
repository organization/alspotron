import { For, Signal, createSignal, splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

import ListItem from './ListItem';

import { cx } from '../../utils/classNames';

export interface ListItemData {
  id: string;
  label: string;
  icon?: string | JSX.Element;
}
export interface ListViewProps extends JSX.HTMLAttributes<HTMLUListElement> {
  items: ListItemData[];
  initItem?: string;
  onSelectItem?: (data: ListItemData) => void;

  value?: Signal<string>;
}

const ListView = (props: ListViewProps) => {
  const [local, leftProps] = splitProps(props, ['items', 'onSelectItem', 'value']);

  const [tab, setTab] = local.value ?? createSignal(props.initItem ?? local.items[0].id);
  const index = () => local.items.findIndex((item) => item.id === tab());

  const onSelect = (item: ListItemData) => {
    setTab(item.id);
    local.onSelectItem?.(item);
  };

  return (
    <ul
      {...leftProps}
      class={cx('relative flex flex-col justify-start items-start p-4 gap-1', leftProps.class)}
    >
      <div
        style={`translate: 0px ${16 + index() * 40}px;`}
        class={'absolute w-[3px] h-4 bg-primary-500 rounded-full left-4 top-[10px] bottom-[10px] transition-all duration-300 ease-[cubic-bezier(0.87, 0, 0.13, 1)]'}
      />
      <For each={local.items}>
        {(item) => (
          <ListItem
            selected={tab() === item.id}
            icon={item.icon}
            title={item.label}
            onClick={() => onSelect(item)}
          />
        )}
      </For>
    </ul>
  );
};

export default ListView;
