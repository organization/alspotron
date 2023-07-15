import { createSignal, JSX, Show } from 'solid-js'
import { Portal } from 'solid-js/web'

const Modal = (props: { open?: boolean, closer?: () => void, children: JSX.Element, }) => {

  const [isOpen, setIsOpen] = createSignal(true)


  return (
    <Show when={props.open && isOpen()}>
      <Portal mount={document.getElementById('app')}>
        <div class={'fixed inset-0 backdrop-grayscale bg-slate-400/25 w-full h-full'}>
          <div
            class={'flex w-full h-full justify-center items-center'}
            onClick={(e) => {
              if(e.currentTarget == e.target) {
                if(props.closer != null) props.closer();
                else setIsOpen(false);
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