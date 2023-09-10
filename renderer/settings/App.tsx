import { For, JSX, Setter } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { useTransContext } from '@jellybrick/solid-i18next';

import { Navigate, Route, Routes, useLocation, useNavigate } from '@solidjs/router';

import ListView, { ListItemData } from './components/ListView';

import GameContainer from './containers/GameContainer';
import InfoContainer from './containers/InfoContainer';
import GeneralContainer from './containers/GeneralContainer';
import PositionContainer from './containers/PositionContainer';
import ThemeContainer from './containers/ThemeContainer';
import GameListContainer from './containers/GameListContainer';
import PluginContainer from './containers/PluginContainer';
import PluginSettingsContainer from './containers/PluginSettingsContainer';

import Layout from '../components/Layout';
import usePluginsCSS from '../hooks/usePluginsCSS';

export interface TabItemData extends Omit<ListItemData, 'label'> {
  container: () => JSX.Element;
}

const TAB_LIST = (() => {
  const result: TabItemData[] = [];

  result.push(
    {
      id: 'general',
      icon: (
        <svg class={'w-[18px] h-[18px] fill-none'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.012 2.25c.734.008 1.465.093 2.182.253a.75.75 0 0 1 .582.649l.17 1.527a1.384 1.384 0 0 0 1.927 1.116l1.401-.615a.75.75 0 0 1 .85.174 9.792 9.792 0 0 1 2.204 3.792.75.75 0 0 1-.271.825l-1.242.916a1.381 1.381 0 0 0 0 2.226l1.243.915a.75.75 0 0 1 .272.826 9.797 9.797 0 0 1-2.204 3.792.75.75 0 0 1-.848.175l-1.407-.617a1.38 1.38 0 0 0-1.926 1.114l-.169 1.526a.75.75 0 0 1-.572.647 9.518 9.518 0 0 1-4.406 0 .75.75 0 0 1-.572-.647l-.168-1.524a1.382 1.382 0 0 0-1.926-1.11l-1.406.616a.75.75 0 0 1-.849-.175 9.798 9.798 0 0 1-2.204-3.796.75.75 0 0 1 .272-.826l1.243-.916a1.38 1.38 0 0 0 0-2.226l-1.243-.914a.75.75 0 0 1-.271-.826 9.793 9.793 0 0 1 2.204-3.792.75.75 0 0 1 .85-.174l1.4.615a1.387 1.387 0 0 0 1.93-1.118l.17-1.526a.75.75 0 0 1 .583-.65c.717-.159 1.45-.243 2.201-.252Zm0 1.5a9.135 9.135 0 0 0-1.354.117l-.109.977A2.886 2.886 0 0 1 6.525 7.17l-.898-.394a8.293 8.293 0 0 0-1.348 2.317l.798.587a2.881 2.881 0 0 1 0 4.643l-.799.588c.32.842.776 1.626 1.348 2.322l.905-.397a2.882 2.882 0 0 1 4.017 2.318l.11.984c.889.15 1.798.15 2.687 0l.11-.984a2.881 2.881 0 0 1 4.018-2.322l.905.396a8.296 8.296 0 0 0 1.347-2.318l-.798-.588a2.881 2.881 0 0 1 0-4.643l.796-.587a8.293 8.293 0 0 0-1.348-2.317l-.896.393a2.884 2.884 0 0 1-4.023-2.324l-.11-.976a8.988 8.988 0 0 0-1.333-.117ZM12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5Zm0 1.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      ),
      container: GeneralContainer,
    },
    {
      id: 'position',
      icon: (
        <svg class={'w-[18px] h-[18px] fill-none'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.75 13A2.25 2.25 0 0 1 11 15.25v3.5A2.25 2.25 0 0 1 8.75 21h-3.5A2.25 2.25 0 0 1 3 18.75v-3.5A2.25 2.25 0 0 1 5.25 13h3.5Zm10 0A2.25 2.25 0 0 1 21 15.25v3.5A2.25 2.25 0 0 1 18.75 21h-3.5A2.25 2.25 0 0 1 13 18.75v-3.5A2.25 2.25 0 0 1 15.25 13h3.5Zm-10 1.5h-3.5a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75Zm10 0h-3.5a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75ZM8.75 3A2.25 2.25 0 0 1 11 5.25v3.5A2.25 2.25 0 0 1 8.75 11h-3.5A2.25 2.25 0 0 1 3 8.75v-3.5A2.25 2.25 0 0 1 5.25 3h3.5Zm10 0A2.25 2.25 0 0 1 21 5.25v3.5A2.25 2.25 0 0 1 18.75 11h-3.5A2.25 2.25 0 0 1 13 8.75v-3.5A2.25 2.25 0 0 1 15.25 3h3.5Zm-10 1.5h-3.5a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75Zm10 0h-3.5a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      ),
      container: PositionContainer,
    },
    {
      id: 'theme',
      icon: (
        <svg class={'w-[18px] h-[18px] fill-none'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.839 5.858c2.94-3.916 9.03-5.055 13.364-2.36 4.28 2.66 5.854 7.777 4.1 12.577-1.655 4.533-6.016 6.328-9.159 4.048-1.177-.854-1.634-1.925-1.854-3.664l-.106-.987-.045-.398c-.123-.934-.311-1.352-.705-1.572-.535-.298-.892-.305-1.595-.033l-.351.146-.179.078c-1.014.44-1.688.595-2.541.416l-.2-.047-.164-.047c-2.789-.864-3.202-4.647-.565-8.157Zm.984 6.716.123.037.134.03c.439.087.814.015 1.437-.242l.602-.257c1.202-.493 1.985-.54 3.046.05.917.512 1.275 1.298 1.457 2.66l.053.459.055.532.047.422c.172 1.361.485 2.09 1.248 2.644 2.275 1.65 5.534.309 6.87-3.349 1.516-4.152.174-8.514-3.484-10.789-3.675-2.284-8.899-1.306-11.373 1.987-2.075 2.763-1.82 5.28-.215 5.816Zm11.225-1.994a1.25 1.25 0 1 1 2.414-.647 1.25 1.25 0 0 1-2.414.647Zm.494 3.488a1.25 1.25 0 1 1 2.415-.647 1.25 1.25 0 0 1-2.415.647ZM14.07 7.577a1.25 1.25 0 1 1 2.415-.647 1.25 1.25 0 0 1-2.415.647Zm-.028 8.998a1.25 1.25 0 1 1 2.414-.647 1.25 1.25 0 0 1-2.414.647Zm-3.497-9.97a1.25 1.25 0 1 1 2.415-.646 1.25 1.25 0 0 1-2.415.646Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      ),
      container: ThemeContainer,
    },
    {
      id: 'plugin',
      icon: (
        <svg class={'w-[18px] h-[18px] fill-none'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13 2.004a2.998 2.998 0 0 1 2.994 2.819l.005.176h2.251c.867 0 1.587.631 1.726 1.46l.018.147.006.144v3.75l-1.998.001a1.5 1.5 0 0 0-1.48 1.239l-.016.132-.005.129a1.5 1.5 0 0 0 1.24 1.48l.132.015.128.005H20L20 17.252a1.75 1.75 0 0 1-1.607 1.745l-.143.005H16l-.005.172a3 3 0 0 1-2.638 2.803l-.18.016-.177.005a3 3 0 0 1-2.995-2.82L10 19.002H7.75a1.75 1.75 0 0 1-1.726-1.458l-.018-.148L6 17.253V15l-.164-.005a3 3 0 0 1-2.803-2.638l-.016-.18L3.012 12a3 3 0 0 1 2.824-2.995l.163-.005L6 6.75c0-.867.63-1.587 1.458-1.726l.148-.019L7.75 5 10 4.999l.005-.171a3 3 0 0 1 2.638-2.803l.18-.016.177-.005Zm0 1.5a1.5 1.5 0 0 0-1.493 1.356l-.007.145-.001 1.494H7.75a.25.25 0 0 0-.243.193L7.5 6.75v3.75l-1.488.001a1.5 1.5 0 0 0-.144 2.993l.144.007H7.5l.001 3.751a.25.25 0 0 0 .193.244l.057.006h3.749l.001 1.496a1.5 1.5 0 0 0 2.993.145L14.5 19l-.001-1.497h3.751a.25.25 0 0 0 .244-.192l.006-.057V15h-.524l-.18-.006a3.003 3.003 0 0 1-2.79-2.841l-.004-.177.006-.18a3 3 0 0 1 2.819-2.79l.174-.005h.498L18.5 6.75a.25.25 0 0 0-.13-.22l-.063-.024-.057-.006-3.751-.001.001-1.495a1.5 1.5 0 0 0-1.5-1.5Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      ),
      container: PluginContainer,
    },
  );

  if (window.isWindows) {
    result.push({
      id: 'game-overlay',
      icon: (
        <svg class={'w-[18px] h-[18px] fill-none'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14.998 5a7 7 0 0 1 .24 13.996l-.24.004H9.002a7 7 0 0 1-.24-13.996L9.001 5h5.996Zm0 1.5H9.002a5.5 5.5 0 0 0-.221 10.996l.221.004h5.996a5.5 5.5 0 0 0 .221-10.996l-.221-.004ZM8 9a.75.75 0 0 1 .75.75v1.498h1.5a.75.75 0 0 1 0 1.5h-1.5v1.502a.75.75 0 0 1-1.5 0v-1.502h-1.5a.75.75 0 1 1 0-1.5h1.5V9.75A.75.75 0 0 1 8 9Zm6.75 3.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm2-3.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      ),
      container: GameContainer
    });
  }

  result.push({
    id: 'about',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 1.999c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001-5.524 0-10.002-4.478-10.002-10.001C1.998 6.477 6.476 1.999 12 1.999Zm0 1.5a8.502 8.502 0 1 0 0 17.003A8.502 8.502 0 0 0 12 3.5Zm-.004 7a.75.75 0 0 1 .744.648l.007.102.003 5.502a.75.75 0 0 1-1.493.102l-.007-.101-.003-5.502a.75.75 0 0 1 .75-.75ZM12 7.003a.999.999 0 1 1 0 1.997.999.999 0 0 1 0-1.997Z"
          class={'fill-black dark:fill-white'}
        />
      </svg>
    ),
    container: InfoContainer,
  });

  return result;
})();

const App = () => {
  usePluginsCSS();

  const [t] = useTransContext();
  const navigate = useNavigate();
  const location = useLocation();

  /* properties */
  const tabId = () => location.pathname.match(/(?<=\/)[^/]+/)?.[0] ?? '';
  const listItem = () => TAB_LIST.map((item) => ({
    ...item,
    label: t(`setting.title.${item.id}`),
  }));

  /* methods */
  const setTabId = ((id: string) => {
    navigate(`/${id}`);
  }) as Setter<string>;

  return (
    <Layout>
      <div
        class={`
        w-full h-full
        flex flex-row justify-start items-stretch
        overflow-hidden
      `}
      >
        <ListView
          value={[tabId, setTabId]}
          class={'w-[312px] shrink-0'}
          items={listItem()}
          onSelectItem={(tab) => setTabId(tab.id)}
        />
        <Transition name={'tab'} mode={'outin'}>
          <Routes>
            <For each={TAB_LIST}>
              {(tab) => <Route path={tab.id} component={tab.container} />}
            </For>
            <Route path={'/game-overlay/list'} component={GameListContainer} />
            <Route path={'/plugin/:id'} component={PluginSettingsContainer} />
            <Route path={'*'} element={<Navigate href={`/${TAB_LIST[0].id}`} />} />
          </Routes>
        </Transition>
      </div>
    </Layout>
  );
};

export default App;
