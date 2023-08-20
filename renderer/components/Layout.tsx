import Titlebar from './Titlebar';

import { cx } from '../utils/classNames';

import type { JSX } from 'solid-js/jsx-runtime';

const isMac = /Mac/.test(navigator.userAgent);

interface LayoutProps {
  children: JSX.Element;
}
const Layout = (props: LayoutProps) => {
  return ( 
    <div
      class={cx(
        'w-full h-full flex flex-col items-stretch overflow-hidden',
        isMac && `
        text-black bg-gray-200/90
        dark:text-white dark:bg-gray-800/90
        `,
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
