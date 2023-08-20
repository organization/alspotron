import { For, Signal, createSignal, onMount, splitProps } from 'solid-js';

import ListItem from './ListItem';

import { cx } from '../../utils/classNames';

import type { JSX } from 'solid-js/jsx-runtime';


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

  // eslint-disable-next-line solid/reactivity
  const [tab, setTab] = local.value ?? createSignal(props.initItem ?? local.items[0].id);
  const [tabHeight, setTabHeight] = createSignal<number[]>([]);
  const index = () => local.items.findIndex((item) => item.id === tab());

  let listParent: HTMLUListElement | undefined;

  onMount(() => {
    const newTabHeight: number[] = [];

    const offset = listParent?.getBoundingClientRect()?.y ?? 0;
    Array.from(listParent?.children ?? [])
      .forEach((item) => {
        if (!item.classList.contains('list-view-item')) return;

        const rect = item.getBoundingClientRect();
        newTabHeight.push(rect.y - offset);
      });

    setTabHeight(newTabHeight);
  });

  const onSelect = (item: ListItemData) => {
    setTab(item.id);
    local.onSelectItem?.(item);
  };

  return (
    <ul
      {...leftProps}
      ref={listParent}
      class={cx('relative flex flex-col justify-start items-start p-4 gap-1', leftProps.class)}
    >
      <div
        style={`translate: 0px ${tabHeight()[index()] + 1}px;`}
        class={cx(
          'absolute w-[3px] h-4 bg-primary-500 rounded-full left-4 top-[10px] bottom-[10px] transition-all duration-300 ease-[cubic-bezier(0.87, 0, 0.13, 1)]',
          typeof tabHeight()[index()] !== 'number' && 'opacity-0 scale-0',
        )}
      />
      <For each={local.items}>
        {(item) => (
          <ListItem
            selected={tab() === item.id}
            icon={item.icon}
            title={item.label}
            class={'list-view-item'}
            onClick={() => onSelect(item)}
          />
        )}
      </For>
    </ul>
  );
};

export default ListView;
