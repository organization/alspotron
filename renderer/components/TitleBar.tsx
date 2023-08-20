import { createSignal, Match, Show, Switch } from 'solid-js';

import { cx } from '../utils/classNames';

import type { JSX } from 'solid-js/jsx-runtime';

const isMac = /Mac/.test(navigator.userAgent);

type ButtonProps = {
  onClick?: () => void;
  children: JSX.Element;
}

const Button = (props: ButtonProps) => {
  return (
    <button
      onClick={() => props?.onClick?.()}
      class={`
        w-11 h-10 flex justify-center items-center
        fill-slate-500 hover:fill-black text-slate-300 hover:text-black
        dark:fill-slate-300 dark:hover:fill-white dark:text-slate-300 dark:hover:text-white
      `}
      style={{
        '-webkit-app-region': 'no-drag'
      }}
    >
      {props.children}
    </button>
  );
};

const TitleBar = () => {
  const [isMaximized, setMaximized] = createSignal(false);

  return (
    <div
      class={cx('w-full h-10 z-50 flex justify-end items-center')}
      style={{
        '-webkit-user-select': 'none',
        '-webkit-app-region': 'drag'
      }}
    >
        <button
          class={cx(
            'flex justify-center items-center rounded ml-1 hover:bg-black/10 dark:hover:bg-white/10',
            isMac ? 'w-6 h-6 ml-[70px] mt-[4px]' : 'w-8 h-8',
          )}
          style={{
            '-webkit-app-region': 'no-drag'
          }}
          onClick={() => history.back()}
        >
          <svg
            class={cx(isMac ? 'w-4 h-4' : 'w-5 h-5')}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.733 19.79a.75.75 0 0 0 1.034-1.086L5.516 12.75H20.25a.75.75 0 0 0 0-1.5H5.516l6.251-5.955a.75.75 0 0 0-1.034-1.086l-7.42 7.067a.995.995 0 0 0-.3.58.754.754 0 0 0 .001.289.995.995 0 0 0 .3.579l7.419 7.067Z"
              class={`
                fill-slate-500 hover:fill-black text-slate-300 hover:text-black
                dark:fill-slate-300 dark:hover:fill-white dark:text-slate-300 dark:hover:text-white
              `}
            />
          </svg>
        </button>
        <div class={'flex-1'} />
        <Show when={!isMac}>
          <Button onClick={() => {
            window.ipcRenderer.invoke('window-minimize')
          }}>
            <svg class={'w-5 h-5'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.755 12.5h16.492a.75.75 0 0 0 0-1.5H3.755a.75.75 0 0 0 0 1.5Z" />
            </svg>
          </Button>
          <Button onClick={() => {
            window.ipcRenderer.invoke('window-maximize').then(async () => {
              setMaximized(await window.ipcRenderer.invoke('window-is-maximized'));
            });
          }}>
            <Switch fallback={
              <svg class={'w-5 h-5'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.518 5H6.009a3.25 3.25 0 0 1 3.24-3h8.001A4.75 4.75 0 0 1 22 6.75v8a3.25 3.25 0 0 1-3 3.24v-1.508a1.75 1.75 0 0 0 1.5-1.732v-8a3.25 3.25 0 0 0-3.25-3.25h-8A1.75 1.75 0 0 0 7.518 5ZM5.25 6A3.25 3.25 0 0 0 2 9.25v9.5A3.25 3.25 0 0 0 5.25 22h9.5A3.25 3.25 0 0 0 18 18.75v-9.5A3.25 3.25 0 0 0 14.75 6h-9.5ZM3.5 9.25c0-.966.784-1.75 1.75-1.75h9.5c.967 0 1.75.784 1.75 1.75v9.5a1.75 1.75 0 0 1-1.75 1.75h-9.5a1.75 1.75 0 0 1-1.75-1.75v-9.5Z"
                />
              </svg>
            }>
              <Match when={!isMaximized()}>
                <svg class={'w-5 h-5'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Zm0 2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H6Z"
                  />
                </svg>
              </Match>
            </Switch>
          </Button>
          <Button onClick={() => {
            window.ipcRenderer.invoke('window-close')
          }}>
            <svg class={'w-5 h-5'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z"
              />
            </svg>
          </Button>
        </Show>
    </div>
  )
};

export default TitleBar;
