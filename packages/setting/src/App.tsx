import { HashRouter, Navigate, Route } from '@solidjs/router';

import { Layout } from './components/Layout';

import { GeneralPage } from './pages/general';

export const App = () => {
  return (
    <HashRouter>
      <Route component={Layout}>
        <Route path={'/'} component={() => <Navigate href={'/general'}/>}/>
        <Route path={'/general'} component={GeneralPage} />
      </Route>
    </HashRouter>
  );
};
