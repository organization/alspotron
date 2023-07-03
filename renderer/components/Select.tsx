import { For, Show, createEffect, createSignal, onCleanup, onMount, splitProps } from 'solid-js';
import usePopper from 'solid-popper';

import { cx } from '../utils/classNames';

import type { Options } from '@popperjs/core';
import type { JSX } from 'solid-js/jsx-runtime';

export interface SelectProps extends Omit<JSX.HTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  placeholder?: string;
  placement?: Options['placement'];

  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  format?: (value: string) => string;

  popupClass?: string;
  popupStyle?: string;

  renderItem?: (props: JSX.HTMLAttributes<HTMLLIElement>, option: string) => JSX.Element;
}
const Selector = (props: SelectProps) => {
  const [local, popup, leftProps] = splitProps(
    props,
    ['format', 'options', 'value', 'onChange', 'renderItem', 'placement'],
    ['popupClass', 'popupStyle']
  );

  const [keyword, setKeyword] = createSignal<string | null>(null);
  const [open, setOpen] = createSignal(false);
  const [anchor, setAnchor] = createSignal<HTMLInputElement>();
  const [popper, setPopper] = createSignal<HTMLUListElement>();
  const [options, setOptions] = createSignal(local.options);

  /* defines */
  usePopper(anchor, popper, {
    placement: local.placement ?? 'bottom-end',
  });

  /* callbacks */
  const onSelect = (option: string) => {
    setKeyword(null);
    setOpen(false);
    local.onChange?.(option);
  };

  /* lifetimes */
  const listener = (event: MouseEvent) => {
    if (event.target instanceof Node && !popper()?.contains(event.target) && !anchor()?.contains(event.target)) {
      setOpen(false);
    }
  };
  onMount(() => {
    window.addEventListener('click', listener);
  });

  createEffect(() => {
    setOptions(local.options.filter((option) => (local.format?.(option) ?? option).includes(keyword() ?? '')));
  })

  onCleanup(() => {
    window.removeEventListener('click', listener);
  });

  return (
    <>
      <input
        {...leftProps}
        ref={setAnchor}
        class={cx('input', leftProps.class)}
        value={keyword() ?? local.format?.(local.value) ?? local.value}
        onInput={(event) => setKeyword(event.target.value)}
        onFocusIn={() => setOpen(true)}
      />
      <Show when={open()}>
        <ul
          ref={setPopper}
          style={`max-width: ${anchor()?.clientWidth}px; ${popup.popupStyle}`}
          class={cx(`
            max-h-[50vh]
            flex flex-col justify-start items-start
            bg-gray-900 z-50 fluent-scrollbar
          `, popup.popupClass)}
        >
          <For each={options()}>
            {(option) => local.renderItem?.({ onClick: () => onSelect(option) }, option) ?? (
              <li class={'flex'} onClick={() => onSelect(option)}>
                {option}
              </li>
            )}
          </For>
        </ul>
      </Show>
    </>
  );
};

export default Selector;
