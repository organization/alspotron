import { HashRouter, Navigate, Route } from '@solidjs/router';
import { setThemeMode } from '@alspotron/ui';

import { Layout } from './components/Layout';

import { GeneralPage } from './pages/general';
import { InfoPage } from './pages/info';

export const App = () => {
  setThemeMode('system');
  return (
    <HashRouter>
      <Route component={Layout}>
        <Route path={'/'} component={() => <Navigate href={'/general'}/>}/>
        <Route path={'/general'} component={GeneralPage}/>
        <Route path={'/info'} component={InfoPage}/>
        <Route path={'/dev'} component={() => ''}/>
      </Route>
    </HashRouter>
  );
};
