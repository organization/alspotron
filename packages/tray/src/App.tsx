import { HashRouter, Route } from '@solidjs/router';

import { MainPage } from './pages/main';

export const App = () => {
  return (
    <HashRouter>
      <Route path={'/'} component={MainPage} />
    </HashRouter>
  );
};
