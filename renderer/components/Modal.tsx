import { createSignal, JSX, Show } from 'solid-js'
import { Portal } from 'solid-js/web'

interface ModalProps extends JSX.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;
}

const Modal = (props: ModalProps) => {

  const [isOpen, setIsOpen] = createSignal(true)


  return (
    <Show when={props.open && isOpen()}>
      <Portal mount={document.getElementById('app')}>
        <div class={'fixed inset-0 backdrop-grayscale bg-slate-400/25 w-full h-full'}>
          <div
            class={'flex w-full h-full justify-center items-center'}
            onClick={(event) => {
              if(event.currentTarget === event.target) {
                props.onClose?.() ?? setIsOpen(false);
              }
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