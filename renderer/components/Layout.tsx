import Titlebar from './Titlebar';

import { cx } from '../utils/classNames';

import type { JSX } from 'solid-js/jsx-runtime';

const isMac = /Mac/.test(navigator.userAgent);
const isWindow = /Windows/.test(navigator.userAgent);

interface LayoutProps {
  children: JSX.Element;
}
const Layout = (props: LayoutProps) => {
  return ( 
    <div
      class={cx(
        'w-full h-full flex flex-col items-stretch overflow-hidden text-black dark:text-white',
        isMac && 'bg-gray-200/90 dark:bg-gray-800/90',
        isWindow && 'bg-slate-100/80 dark:bg-gray-800/80'
      )}
    >
      <Titlebar />
      <div class={'w-full min-h-0 flex-1'}>
        {props.children}
      </div>
    </div>
  )
};

export default Layout;
