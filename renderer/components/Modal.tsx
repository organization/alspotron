import { For, JSX, onCleanup, onMount, Show, splitProps } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Transition } from 'solid-transition-group';

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
  let lastOpen = local.open;
  
  const listener = (event: MouseEvent) => {
    if (lastOpen !== local.open) {
      lastOpen = local.open;
      return;
    }

    lastOpen = local.open;
    if (!local.open) return;

    const isOutside = !event.composedPath().some((it) => it === content);

    if (isOutside) local.onClose?.();
  };
  onMount(() => {
    document.addEventListener('click', listener);
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
              class={'w-fit h-fit flex flex-col bg-stone-700 rounded shadow-[0_0_0_1px] shadow-white/25'}
            >
              <div class={'px-6 py-5'}>
                {props.children}
              </div>
              <div class={'flex justify-end items-center gap-2 bg-stone-800  px-6 py-5 '}>
                <For each={local.buttons ?? []}>
                  {(button) => (
                    <button
                      class={
                        button.type === 'positive' ? 'btn-primary' :
                        button.type === 'negative' ? 'btn-error' :
                        'btn-text'
                      }
                      onClick={button.onClick}
                    >
                      {button.name}
                    </button>
                  )}
                </For>
              </div>
            </div>
          </div>
        </Show>
      </Transition>
    </Portal>
  );
};

export default Modal;