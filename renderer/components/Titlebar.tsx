// import { BrowserWindow } from 'electron'
import { Show } from 'solid-js';
// eslint-disable-next-line import/no-unresolved
import { JSX } from 'solid-js/jsx-runtime';
import { cx } from '../utils/classNames';

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
  const svgStyle = cx('w-10 h-full p-3 mx-auto')
  return (
    <div
      class={cx('fixed h-10 top-0 left-0 right-0 z-50')}
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
            <svg class={svgStyle}>
              <use href="./assets/titlebar_icons.svg#minimize-window" />
            </svg>
          </Button>
          <Button onClick={() => {
            window.ipcRenderer.send('window-maximize')
          }}>
            <svg class={svgStyle}>
              <use href="./assets/titlebar_icons.svg#maximize-window" />
            </svg>
          </Button>
          <Button onClick={() => {
            window.ipcRenderer.send('window-close')
          }}>
            <svg class={svgStyle}>
              <use href="./assets/titlebar_icons.svg#close-window" />
            </svg>
          </Button>
        </div>
      </Show>
    </div>
  )
};

export default Titlebar;
