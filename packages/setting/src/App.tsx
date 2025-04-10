import { HashRouter, Navigate, Route } from '@solidjs/router';

import { Layout } from './components/Layout';

import { GeneralPage } from './pages/general';
import { setThemeMode } from '@alspotron/ui';

export const App = () => {
  setThemeMode('system');
  return (
    <HashRouter>
      <Route component={Layout}>
        <Route path={'/'} component={() => <Navigate href={'/general'}/>}/>
        <Route path={'/general'} component={GeneralPage}/>
      </Route>
    </HashRouter>
  );
};
