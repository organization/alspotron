import { Match, Switch, createSignal } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { TransProvider, useTransContext } from '@jellybrick/solid-i18next';

import { TFunction } from 'i18next';

import ListView, { ListItemData } from './components/ListView';

import GameContainer from './containers/GameContainer';
import InfoContainer from './containers/InfoContainer';
import PositionContainer from './containers/PositionContainer';
import ThemeContainer from './containers/ThemeContainer';

import Layout from '../components/Layout';
import { LangResource } from '../../common/intl';
import useConfig from '../hooks/useConfig';


const getTabList = (t: TFunction) => {

  const TAB_LIST: ListItemData[] = [
    // {
    //   id: 'plugin',
    //   label: '플러그인',
    // },
  ];

  TAB_LIST.push(
    {
      id: 'position',
      label: t('setting.title.position'),
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.75 13A2.25 2.25 0 0 1 11 15.25v3.5A2.25 2.25 0 0 1 8.75 21h-3.5A2.25 2.25 0 0 1 3 18.75v-3.5A2.25 2.25 0 0 1 5.25 13h3.5Zm10 0A2.25 2.25 0 0 1 21 15.25v3.5A2.25 2.25 0 0 1 18.75 21h-3.5A2.25 2.25 0 0 1 13 18.75v-3.5A2.25 2.25 0 0 1 15.25 13h3.5Zm-10 1.5h-3.5a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75Zm10 0h-3.5a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75ZM8.75 3A2.25 2.25 0 0 1 11 5.25v3.5A2.25 2.25 0 0 1 8.75 11h-3.5A2.25 2.25 0 0 1 3 8.75v-3.5A2.25 2.25 0 0 1 5.25 3h3.5Zm10 0A2.25 2.25 0 0 1 21 5.25v3.5A2.25 2.25 0 0 1 18.75 11h-3.5A2.25 2.25 0 0 1 13 8.75v-3.5A2.25 2.25 0 0 1 15.25 3h3.5Zm-10 1.5h-3.5a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75Zm10 0h-3.5a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75Z"
            fill="#ffffff"/>
        </svg>
      )
    },
    {
      id: 'theme',
      label: t('setting.title.theme'),
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.839 5.858c2.94-3.916 9.03-5.055 13.364-2.36 4.28 2.66 5.854 7.777 4.1 12.577-1.655 4.533-6.016 6.328-9.159 4.048-1.177-.854-1.634-1.925-1.854-3.664l-.106-.987-.045-.398c-.123-.934-.311-1.352-.705-1.572-.535-.298-.892-.305-1.595-.033l-.351.146-.179.078c-1.014.44-1.688.595-2.541.416l-.2-.047-.164-.047c-2.789-.864-3.202-4.647-.565-8.157Zm.984 6.716.123.037.134.03c.439.087.814.015 1.437-.242l.602-.257c1.202-.493 1.985-.54 3.046.05.917.512 1.275 1.298 1.457 2.66l.053.459.055.532.047.422c.172 1.361.485 2.09 1.248 2.644 2.275 1.65 5.534.309 6.87-3.349 1.516-4.152.174-8.514-3.484-10.789-3.675-2.284-8.899-1.306-11.373 1.987-2.075 2.763-1.82 5.28-.215 5.816Zm11.225-1.994a1.25 1.25 0 1 1 2.414-.647 1.25 1.25 0 0 1-2.414.647Zm.494 3.488a1.25 1.25 0 1 1 2.415-.647 1.25 1.25 0 0 1-2.415.647ZM14.07 7.577a1.25 1.25 0 1 1 2.415-.647 1.25 1.25 0 0 1-2.415.647Zm-.028 8.998a1.25 1.25 0 1 1 2.414-.647 1.25 1.25 0 0 1-2.414.647Zm-3.497-9.97a1.25 1.25 0 1 1 2.415-.646 1.25 1.25 0 0 1-2.415.646Z"
            fill="#ffffff"/>
        </svg>
      )
    }
  );

  if (window.isWindows) {
    TAB_LIST.push({
      id: 'game',
      label: t('setting.title.game-overlay'),
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14.998 5a7 7 0 0 1 .24 13.996l-.24.004H9.002a7 7 0 0 1-.24-13.996L9.001 5h5.996Zm0 1.5H9.002a5.5 5.5 0 0 0-.221 10.996l.221.004h5.996a5.5 5.5 0 0 0 .221-10.996l-.221-.004ZM8 9a.75.75 0 0 1 .75.75v1.498h1.5a.75.75 0 0 1 0 1.5h-1.5v1.502a.75.75 0 0 1-1.5 0v-1.502h-1.5a.75.75 0 1 1 0-1.5h1.5V9.75A.75.75 0 0 1 8 9Zm6.75 3.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm2-3.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"
            class={'fill-white'}/>
        </svg>
      )
    });
  }

  TAB_LIST.push({
    id: 'about',
    label: t('setting.title.about'),
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 1.999c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001-5.524 0-10.002-4.478-10.002-10.001C1.998 6.477 6.476 1.999 12 1.999Zm0 1.5a8.502 8.502 0 1 0 0 17.003A8.502 8.502 0 0 0 12 3.5Zm-.004 7a.75.75 0 0 1 .744.648l.007.102.003 5.502a.75.75 0 0 1-1.493.102l-.007-.101-.003-5.502a.75.75 0 0 1 .75-.75ZM12 7.003a.999.999 0 1 1 0 1.997.999.999 0 0 1 0-1.997Z"
          fill="#ffffff"/>
      </svg>
    )
  });

  return TAB_LIST;

};

const App = () => {
  const [tabId, setTabId] = createSignal('position');

  return (
    <TransProvider options={{ resources: LangResource, lng: useConfig()[0]()?.language }}>
      <Layout>
        <div
          class={`
          w-full h-full
          flex flex-row justify-start items-stretch
          text-white
          overflow-hidden
        `}
        >
          <ListView
            value={[tabId, setTabId]}
            class={'w-[312px] shrink-0'}
            items={(() => {
              const [t] = useTransContext();
              return getTabList(t);
            })()}
          />
          <Transition name={'tab'} mode={'outin'}>
            <Switch>
              <Match when={tabId() === 'position'}>
                <PositionContainer />
              </Match>
              <Match when={tabId() === 'about'}>
                <InfoContainer />
              </Match>
              <Match when={tabId() === 'theme'}>
                <ThemeContainer />
              </Match>
              <Match when={tabId() === 'game'}>
                <GameContainer />
              </Match>
              <Match when={tabId() === 'plugin'}>
                <div class={'flex-1 fluent-scrollbar'}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </div>
              </Match>
            </Switch>
          </Transition>
        </div>
      </Layout>
    </TransProvider>
  )
};

export default App;
