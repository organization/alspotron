import { createSignal } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { HashRouter, Route } from '@solidjs/router';

import { DebugContainer, MainContainer } from './containers';

import PlayingInfoProvider from '../components/PlayingInfoProvider';
// import { Check, Check2 } from '@alspotron/ui';
// import '@alspotron/ui/style.css';

export const App = () => {
  const [url, setUrl] = createSignal('/');

  return (
    <div
      class={`
        w-full h-full overflow-hidden
        text-black dark:text-white bg-slate-100/80 dark:bg-gray-800/80
      `}
    >
      {/*<Check />*/}
      {/*<Check2 />*/}
      <PlayingInfoProvider>
        <Transition
          name={`page-${url() === '/' ? 'left' : 'right'}`}
          mode={'outin'}
        >
          <HashRouter
            transformUrl={(url) => {
              setUrl(url);
              return url;
            }}
          >
            <Route path={'/'} component={MainContainer} />
            <Route path={'/debug'} component={DebugContainer} />
          </HashRouter>
        </Transition>
      </PlayingInfoProvider>
    </div>
  );
};
