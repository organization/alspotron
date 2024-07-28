import { createSignal } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { HashRouter, Route } from '@solidjs/router';

import { DebugContainer, MainContainer } from './containers';

export const App = () => {
  const [url, setUrl] = createSignal('/');

  return (
    <div
      class={`
        w-full h-full p-4 fluent-scrollbar !overflow-x-hidden
        text-black dark:text-white bg-slate-100/80 dark:bg-gray-800/80
      `}
    >
      <Transition name={`page-${url() === '/' ? 'left' : 'right'}`} mode={'outin'}>
        <HashRouter
          transformUrl={(url) => {
            setUrl(url);
            return url;
          }}
        >
          <Route path={'/'} component={MainContainer}/>
          <Route path={'/debug'} component={DebugContainer}/>
        </HashRouter>
      </Transition>
    </div>
  );
};
