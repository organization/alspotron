import { createSignal, JSX, Show } from 'solid-js'
import { Portal } from 'solid-js/web'

const Modal = (props: { open?: boolean, closer?: () => void, children: JSX.Element, }) => {

  const [isOpen, setIsOpen] = createSignal(true)

  if(document.getElementById('Modal') != null) setIsOpen(false)

  return (
    <Show when={props.open && isOpen()}>
      <Portal mount={document.getElementById('app')}>
        <div class={'fixed inset-0 backdrop-grayscale bg-slate-400/50 w-full h-full'}>
          <div
            id={'Modal'}
            class={'flex w-full h-full justify-center items-center'}
            onClick={(e) => {
              if(e.currentTarget == e.target) setIsOpen(false);
            }}
          >
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export default Modal;