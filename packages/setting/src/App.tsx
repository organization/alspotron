import { HashRouter, Navigate, Route } from '@solidjs/router';
import { setThemeMode } from '@alspotron/ui';

import { Layout } from './components/Layout';
import { InfoPage } from './pages/info';
import { SettingPanel } from './components/SettingPanel';
import { GeneralSetting } from './config';
import { ViewSetting } from './config/view.ts';
import { DeveloperSetting } from './config/developer.ts';

export const App = () => {
  setThemeMode('system');
  return (
    <HashRouter>
      <Route component={Layout}>
        <Route path={'/'} component={() => <Navigate href={'/general'}/>}/>
        <Route
          path={'/general'}
          component={() => (
            <SettingPanel
              name={'일반'}
              groups={GeneralSetting}
            />
          )}
        />
        <Route
          path={'/view'}
          component={() => (
            <SettingPanel
              name={'뷰어 및 테마'}
              groups={ViewSetting}
            />
          )}
        />
        <Route path={'/info'} component={InfoPage}/>
        <Route
          path={'/dev'}
          component={() => (
            <SettingPanel
              name={'개발 및 실험'}
              groups={DeveloperSetting}
            />
          )}
        />
      </Route>
    </HashRouter>
  );
};
