import { Match, Switch, createSignal } from 'solid-js';
import { Transition } from 'solid-transition-group';
import Titlebar from '../components/Titlebar';

import ListView, { ListItemData } from './components/ListView';
import InfoContainer from './containers/InfoContainer';
import PositionContainer from './containers/PositionContainer';
import ThemeContainer from './containers/ThemeContainer';
import UpdaterContainer from './containers/UpdaterContainer';

const TAB_LIST: ListItemData[] = [
  {
    id: 'position',
    label: '위치',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.75 13A2.25 2.25 0 0 1 11 15.25v3.5A2.25 2.25 0 0 1 8.75 21h-3.5A2.25 2.25 0 0 1 3 18.75v-3.5A2.25 2.25 0 0 1 5.25 13h3.5Zm10 0A2.25 2.25 0 0 1 21 15.25v3.5A2.25 2.25 0 0 1 18.75 21h-3.5A2.25 2.25 0 0 1 13 18.75v-3.5A2.25 2.25 0 0 1 15.25 13h3.5Zm-10 1.5h-3.5a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75Zm10 0h-3.5a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75ZM8.75 3A2.25 2.25 0 0 1 11 5.25v3.5A2.25 2.25 0 0 1 8.75 11h-3.5A2.25 2.25 0 0 1 3 8.75v-3.5A2.25 2.25 0 0 1 5.25 3h3.5Zm10 0A2.25 2.25 0 0 1 21 5.25v3.5A2.25 2.25 0 0 1 18.75 11h-3.5A2.25 2.25 0 0 1 13 8.75v-3.5A2.25 2.25 0 0 1 15.25 3h3.5Zm-10 1.5h-3.5a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75Zm10 0h-3.5a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75Z" fill="#ffffff"/>
      </svg>
    )
  },
  {
    id: 'theme',
    label: '테마',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.839 5.858c2.94-3.916 9.03-5.055 13.364-2.36 4.28 2.66 5.854 7.777 4.1 12.577-1.655 4.533-6.016 6.328-9.159 4.048-1.177-.854-1.634-1.925-1.854-3.664l-.106-.987-.045-.398c-.123-.934-.311-1.352-.705-1.572-.535-.298-.892-.305-1.595-.033l-.351.146-.179.078c-1.014.44-1.688.595-2.541.416l-.2-.047-.164-.047c-2.789-.864-3.202-4.647-.565-8.157Zm.984 6.716.123.037.134.03c.439.087.814.015 1.437-.242l.602-.257c1.202-.493 1.985-.54 3.046.05.917.512 1.275 1.298 1.457 2.66l.053.459.055.532.047.422c.172 1.361.485 2.09 1.248 2.644 2.275 1.65 5.534.309 6.87-3.349 1.516-4.152.174-8.514-3.484-10.789-3.675-2.284-8.899-1.306-11.373 1.987-2.075 2.763-1.82 5.28-.215 5.816Zm11.225-1.994a1.25 1.25 0 1 1 2.414-.647 1.25 1.25 0 0 1-2.414.647Zm.494 3.488a1.25 1.25 0 1 1 2.415-.647 1.25 1.25 0 0 1-2.415.647ZM14.07 7.577a1.25 1.25 0 1 1 2.415-.647 1.25 1.25 0 0 1-2.415.647Zm-.028 8.998a1.25 1.25 0 1 1 2.414-.647 1.25 1.25 0 0 1-2.414.647Zm-3.497-9.97a1.25 1.25 0 1 1 2.415-.646 1.25 1.25 0 0 1-2.415.646Z" fill="#ffffff"/>
      </svg>
    )
  },
  {
    id: 'updater',
    label: '업데이트',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.75 2A2.25 2.25 0 0 1 18 4.25v15.5A2.25 2.25 0 0 1 15.75 22h-7.5A2.25 2.25 0 0 1 6 19.75V4.25A2.25 2.25 0 0 1 8.25 2h7.5Zm0 1.5h-7.5a.75.75 0 0 0-.75.75v15.5c0 .414.336.75.75.75h7.5a.75.75 0 0 0 .75-.75V4.25a.75.75 0 0 0-.75-.75ZM12 7.03a.75.75 0 0 1 .743.65l.007.1v6.712l.961-.961a.75.75 0 0 1 .977-.073l.084.073a.75.75 0 0 1 .073.976l-.073.085-2.242 2.241-.038.036-.062.049-.067.041-.06.03-.101.036-.063.015-.092.011h-.094l-.091-.011-.097-.025-.112-.047-.076-.046-.107-.089-2.242-2.241a.75.75 0 0 1 .976-1.134l.085.073.96.96.001-6.71a.75.75 0 0 1 .55-.723l.098-.02L12 7.03Z" fill="#ffffff"/>
      </svg>
    )
  },
  // {
  //   id: 'plugin',
  //   label: '플러그인',
  // },
  {
    id: 'about',
    label: '정보',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1.999c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001-5.524 0-10.002-4.478-10.002-10.001C1.998 6.477 6.476 1.999 12 1.999Zm0 1.5a8.502 8.502 0 1 0 0 17.003A8.502 8.502 0 0 0 12 3.5Zm-.004 7a.75.75 0 0 1 .744.648l.007.102.003 5.502a.75.75 0 0 1-1.493.102l-.007-.101-.003-5.502a.75.75 0 0 1 .75-.75ZM12 7.003a.999.999 0 1 1 0 1.997.999.999 0 0 1 0-1.997Z" fill="#ffffff"/>
      </svg>
    )
  },
];

const App = () => {
  const [tabId, setTabId] = createSignal(TAB_LIST[0].id);

  return (
    <>
      <Titlebar />
      <div
        class={`
          mt-10
          w-full h-full
          flex flex-row justify-start items-stretch
          text-white
          overflow-hidden
        `}
      >
        <ListView
          value={[tabId, setTabId]}
          class={'w-[312px] shrink-0'}
          items={TAB_LIST}
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
            <Match when={tabId() === 'updater'}>
              <UpdaterContainer />
            </Match>
            <Match when={tabId() === 'plugin'}>
              <div class={'flex-1 fluent-scrollbar'}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nec elit sed velit gravida viverra eleifend non diam. Quisque turpis dui, posuere eu accumsan a, porttitor vitae orci. Nullam placerat elementum massa gravida laoreet. In blandit urna sit amet justo ultricies facilisis. Proin eget dictum purus. In condimentum facilisis mauris a pretium. Maecenas sollicitudin arcu id vestibulum fringilla. Maecenas dictum tincidunt nisl eu tristique. Suspendisse potenti. Mauris sit amet augue at purus dictum tempor id sit amet nibh. Aenean quis justo ac sem egestas tristique. Sed purus enim, pellentesque vitae dictum a, pretium vehicula velit.

              Aenean purus ipsum, mattis id ante at, imperdiet semper nisi. Mauris et nisi vulputate, imperdiet ante vitae, aliquam elit. Curabitur rutrum, ante finibus vestibulum ornare, est ligula congue ipsum, ac tincidunt nisi nisl vitae purus. Proin condimentum orci vel justo volutpat ullamcorper. Aliquam in facilisis erat, id auctor erat. Suspendisse convallis facilisis odio, at dictum ex placerat non. Mauris eget augue dapibus, facilisis augue sed, tincidunt ante. Ut non finibus nisl, id vestibulum lorem. Duis iaculis elementum purus, quis convallis nisi tempus sed.

              Sed dictum nec magna a fringilla. Nullam quis venenatis odio, ac vehicula ligula. Suspendisse imperdiet pellentesque cursus. Donec tempus, nunc id lobortis porta, ante sem maximus metus, at hendrerit massa est vel ligula. Vivamus at lacinia augue, vitae elementum augue. Vestibulum rutrum, diam nec molestie dignissim, eros leo faucibus mi, ac posuere ante orci eget est. Duis facilisis a metus vitae vestibulum. Sed laoreet massa convallis commodo ullamcorper. Pellentesque metus leo, faucibus sit amet finibus vitae, dictum vitae lectus. Ut ut rutrum ligula.

              Praesent suscipit sem sed ipsum porttitor pretium. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent ut odio a tellus faucibus dictum non at massa. Phasellus sed neque lacinia, aliquam purus sit amet, suscipit tortor. Etiam ultricies aliquam lectus eu lobortis. Cras ultricies sagittis fermentum. Suspendisse consequat arcu in urna lobortis pellentesque. Aliquam elementum aliquam nulla quis finibus. Mauris ac purus suscipit, imperdiet est a, lacinia purus. Etiam condimentum dapibus eros, ac aliquam dolor condimentum ac. Pellentesque placerat eros ac nisl tempor, a faucibus erat dapibus. Nulla facilisi. Maecenas risus nisl, accumsan in accumsan vel, faucibus sit amet mi.

              Integer sollicitudin risus id lorem congue, quis consequat massa laoreet. Praesent imperdiet justo a odio eleifend, ac vestibulum nisl iaculis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin et laoreet eros, vel lobortis arcu. Donec fermentum placerat risus, sit amet semper neque tincidunt nec. Morbi semper magna ac lorem sagittis sollicitudin. Vestibulum sed ligula at lacus porta egestas in quis nisl.
              </div>
            </Match>
          </Switch>
        </Transition>
      </div>
    </>
  )
};

export default App;
