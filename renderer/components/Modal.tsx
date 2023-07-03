import { JSX, Show } from 'solid-js'
import { Portal } from 'solid-js/web'

const Modal = (props: { open?: boolean, closer?: () => void, children: JSX.Element, }) => (
  <Show when={props.open && (document.getElementById('Modal') == null)}>
    <Portal mount={document.getElementById('app')}>
      <div class={'fixed inset-0 backdrop-blur-sm backdrop-grayscale bg-primary-500/5 w-full h-full'}>
        <div class={'flex w-full h-full justify-center items-center'}>
          {props.children}
        </div>
      </div>
    </Portal>
  </Show>
);

export default Modal;