import { Placement, offset } from '@floating-ui/dom';
import { useFloating } from 'solid-floating-ui';
import { For, Show, createEffect, createSignal, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';

import { Transition } from 'solid-transition-group';

import { cx } from '../utils/classNames';

import type { JSX } from 'solid-js/jsx-runtime';

export interface SelectProps extends Omit<JSX.HTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  mode?: 'select' | 'autocomplete';

  placeholder?: string;
  placement?: Placement;

  options: string[];
  value?: string;
  onChange?: (value: string, index: number) => void;
  format?: (value: string) => string;

  popupClass?: string;
  popupStyle?: string;

  renderItem?: (props: JSX.HTMLAttributes<HTMLLIElement>, option: string, isSelected: boolean) => JSX.Element;
}
const Selector = (props: SelectProps) => {
  const [local, popup, leftProps] = splitProps(
    mergeProps({ mode: 'select' }, props),
    ['format', 'options', 'value', 'onChange', 'renderItem', 'placement', 'mode'],
    ['popupClass', 'popupStyle']
  );

  const [keyword, setKeyword] = createSignal<string | null>(null);
  const [open, setOpen] = createSignal(false);
  const [anchor, setAnchor] = createSignal<HTMLInputElement>();
  const [popper, setPopper] = createSignal<HTMLUListElement>();
  const [input, setInput] = createSignal<HTMLInputElement>();
  const [options, setOptions] = createSignal(local.options);

  /* properties */
  const itemHeight = () => (popper()?.scrollHeight ?? popper()?.clientHeight ?? 0) / local.options.length;
  const selectIndex = () => local.options.findIndex((option) => option === local.value);

  /* defines */
  const position = useFloating(anchor, popper, {
    placement: local.placement ?? 'bottom-start',
    strategy: 'absolute',
    middleware: [
      offset(() => {
        const offset = (
          local.mode === 'select'
            ? (-1 * (anchor()?.clientHeight ?? 0)) - (itemHeight() * selectIndex())
            : 8
        );

        return {
          mainAxis: offset,
          crossAxis: 0,
        };
      }),
    ],
  });

  /* lifetimes */
  const listener = (event: MouseEvent) => {
    if (event.target instanceof Node && !popper()?.contains(event.target) && !anchor()?.contains(event.target)) {
      input()?.blur();
      setOpen(false);
      position.update();
    }
  };
  onMount(() => {
    window.addEventListener('mousedown', listener);
    position.update();
  });

  createEffect(() => {
    setOptions(local.options.filter((option) => (local.format?.(option) ?? option).includes(keyword() ?? '')));
    position.update();
  });

  createEffect(() => {
    const anchorDom = anchor();
    const popperDom = popper();
    
    anchorDom?.addEventListener('transitionstart', () => {
      position.update();
    }, { once: true });
    popperDom?.addEventListener('transitionstart', () => {
      position.update();
    }, { once: true });
  });

  onCleanup(() => {
    window.removeEventListener('mousedown', listener);
  });

  /* callbacks */
  const onSelect = (option: string, index: number) => {
    input()?.blur();
    setKeyword(null);
    setOpen(false);
    position.update();
    local.onChange?.(option, index);
  };
  const onOpen = () => {
    position.update();
    setOpen(true);
  };

  return (
    <>
      <div
        ref={setAnchor}
        class={'select-container'}
        onClick={() => input()?.focus()}
        data-active={open()}
      >
        <input
          {...leftProps}
          ref={setInput}
          class={cx('select', leftProps.class)}
          value={keyword() ?? local.format?.(local.value ?? '') ?? local.value}
          onInput={(event) => setKeyword(event.target.value)}
          onFocusIn={onOpen}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class={cx('w-4 h-4 fill-none transition-transform', open() && 'rotate-180')}
        >
          <path
            d="M4.293 8.293a1 1 0 0 1 1.414 0L12 14.586l6.293-6.293a1 1 0 1 1 1.414 1.414l-7 7a1 1 0 0 1-1.414 0l-7-7a1 1 0 0 1 0-1.414Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      </div>
      <div
        ref={setPopper}
        style={{
          'position': position.strategy,
          'top': `${position.y ?? 0}px`,
          'left': `${position.x ?? 0}px`,
          '--percent': (
            local.mode === 'select'
              ? `${((itemHeight() * selectIndex()) + (itemHeight() / 2)) / Math.max(popper()?.clientHeight ?? 0, 1) * 100}%`
              : '0%'
          ),
        }}
        class={'z-50'}
      >
        <Transition name={'selector'}>
          <Show when={open()}>
            <ul
              style={`width: ${anchor()?.clientWidth ? `${anchor()?.clientWidth ?? 0}px` : 'fit-content'}; ${popup.popupStyle ?? ''};`}
              class={cx(`
                w-full max-h-[50vh]
                flex flex-col justify-start items-start p-1 rounded-lg shadow-[0_0_0_1px_var(--tw-shadow-color),0_8px_16px_var(--tw-shadow-color)]
                
                bg-gray-100/60 shadow-gray-300/50 dark:bg-gray-800/60 dark:shadow-black/50 fluent-scrollbar backdrop-blur-xl
              `, popup.popupClass)}
            >
              <For each={options()}>
                {(option, index) => local.renderItem?.({ onClick: () => onSelect(option, index()) }, option, option === local.value) ?? (
                  <li
                    class={cx(
                      'w-full py-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg truncate flex items-center',
                      option === local.value && 'bg-white/10',
                    )}
                    onClick={() => onSelect(option, index())}
                  >
                    <Show when={option === local.value}>
                      <div class={'bg-primary-500 rounded w-1 h-4'} />
                    </Show>
                    <div class={'px-2'}>
                    {local.format?.(option) ?? option}
                    </div>
                  </li>
                )}
              </For>
            </ul>
          </Show>
        </Transition>
      </div>
    </>
  );
};

export default Selector;
