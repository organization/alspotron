// import { BrowserWindow } from 'electron'
import { Show } from 'solid-js';
import { cx } from '../utils/classNames';
import type { JSX } from 'solid-js/jsx-runtime';

const isMac = /Mac/.test(navigator.userAgent);

type ButtonProps = {
  onClick?: () => void;
  children: JSX.Element;
}

const Button = (props: ButtonProps) => {
  return (
    <button onClick={() => props?.onClick()} class={cx('w-11 h-10 text-slate-300 hover:text-white')}
      style={{
        '-webkit-app-region': 'no-drag'
      }}
    >
      {props.children}
    </button>
  )
}

const Titlebar = () => {
  return (
    <div
      class={cx('w-full h-10 z-50')}
      style={{
        '-webkit-user-select': 'none',
        '-webkit-app-region': 'drag'
      }}
    >
      <Show when={!isMac}>
        <div
          class={cx(
            'relative flex h-full w-full justify-end items-center'
          )}
        >
          <Button onClick={() => {
            window.ipcRenderer.send('window-minimize')
          }}>
            <svg class={cx('w-10 h-full p-3 mx-auto')}>
              <use href="./assets/titlebar_icons.svg#minimize-window" />
            </svg>
          </Button>
          <Button onClick={() => {
            window.ipcRenderer.send('window-maximize')
          }}>
            <svg class={cx('w-10 h-full p-3 mx-auto')}>
              <use href="./assets/titlebar_icons.svg#maximize-window" />
            </svg>
          </Button>
          <Button onClick={() => {
            window.ipcRenderer.send('window-close')
          }}>
            <svg class={cx('w-10 h-full p-3 mx-auto')}>
              <use href="./assets/titlebar_icons.svg#close-window" />
            </svg>
          </Button>
        </div>
      </Show>
    </div>
  )
};

export default Titlebar;
