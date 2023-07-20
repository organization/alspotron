import Titlebar from './Titlebar';

import type { JSX } from 'solid-js/jsx-runtime';

interface LayoutProps {
  children: JSX.Element;
}
const Layout = (props: LayoutProps) => {
  return ( 
    <div class={'w-full h-full flex flex-col items-stretch overflow-hidden'}>
      <Titlebar />
      <div class={'w-full min-h-0 flex-1'}>
        {props.children}
      </div>
    </div>
  )
};

export default Layout;
