import { createEffect, For, type JSX, onCleanup, Show, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Transition } from 'solid-transition-group';

import { cx } from '../utils/classNames';

export interface ButtonOptions {
  type?: 'positive' | 'negative' | 'normal';
  name?: string;
  onClick?: () => void;
}
export interface ModalProps extends JSX.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;

  buttons?: ButtonOptions[];
}

const Modal = (props: ModalProps) => {
  const [local, leftProps] = splitProps(props, ['open', 'onClose', 'buttons']);

  let content!: HTMLDivElement;

  const listener = (event: MouseEvent) => {
    const isOutside = !event.composedPath().some((it) => it === content);

    if (isOutside) local.onClose?.();
  };

  createEffect(() => {
    if (local.open) {
      document.removeEventListener('click', listener);
      document.addEventListener('click', listener);
    }
  });

  onCleanup(() => {
    document.removeEventListener('click', listener);
  });

  return (
    <Portal mount={document.querySelector('#app')!}>
      <Transition name={'modal'}>
        <Show when={local.open}>
          <div class={'fixed inset-0 bg-gray-900/40 w-full h-full flex justify-center items-center '}>
            <div
              {...leftProps}
              ref={content}
              class={cx(
                `
                w-fit h-fit max-h-[80vh] flex flex-col rounded overflow-hidden
                shadow-xl shadow-black/10 border-[1px]
                bg-stone-100 border-black/10 dark:bg-stone-700 dark:border-white/10
              `,
                leftProps.class,
              )}
            >
              <div class={'text-black dark:text-white px-6 py-5 fluent-scrollbar'}>{props.children}</div>
              <Show when={local.buttons}>
                <div class={'flex justify-end items-center gap-2 bg-stone-200 dark:bg-stone-800 px-6 py-5'}>
                  <For each={local.buttons ?? []}>
                    {(button) => (
                      <button
                        class={
                          button.type === 'positive'
                            ? 'btn-primary'
                            : button.type === 'negative'
                              ? 'btn-error'
                              : 'btn-text'
                        }
                        onClick={button.onClick}
                      >
                        {button.name}
                      </button>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </div>
        </Show>
      </Transition>
    </Portal>
  );
};

export default Modal;
