import { createEffect, createSignal } from 'solid-js';

import ListView, { ListItemData } from './components/ListView';
import type { Config } from '../../src/config';

const TAB_LIST: ListItemData[] = [
  {
    id: 'theme',
    label: '테마',
  },
  {
    id: 'plugin',
    label: '플러그인',
  },
  {
    id: 'about',
    label: '정보',
  },
];

const App = () => {
  const [value, setValue] = createSignal('');

  createEffect(() => {
    window.ipcRenderer.invoke('set-config', {
      style: {
        font: value(),
      },
    });
  });

  (async () => {
    const config: Config = await window.ipcRenderer.invoke('get-config');

    setValue(config.style.font);
  })();

  return (
    <div
      class={`
        w-full h-full
        flex flex-row justify-start items-stretch
        text-white
      `}
    >
      <ListView
        class={'w-[312px] '}
        items={TAB_LIST}
      />
      <div class={'flex-1 fluent-scrollbar'}>
        <input class={'input'} value={value()} onChange={(event) => setValue((event.target as HTMLInputElement).value)}></input>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nec elit sed velit gravida viverra eleifend non diam. Quisque turpis dui, posuere eu accumsan a, porttitor vitae orci. Nullam placerat elementum massa gravida laoreet. In blandit urna sit amet justo ultricies facilisis. Proin eget dictum purus. In condimentum facilisis mauris a pretium. Maecenas sollicitudin arcu id vestibulum fringilla. Maecenas dictum tincidunt nisl eu tristique. Suspendisse potenti. Mauris sit amet augue at purus dictum tempor id sit amet nibh. Aenean quis justo ac sem egestas tristique. Sed purus enim, pellentesque vitae dictum a, pretium vehicula velit.

Aenean purus ipsum, mattis id ante at, imperdiet semper nisi. Mauris et nisi vulputate, imperdiet ante vitae, aliquam elit. Curabitur rutrum, ante finibus vestibulum ornare, est ligula congue ipsum, ac tincidunt nisi nisl vitae purus. Proin condimentum orci vel justo volutpat ullamcorper. Aliquam in facilisis erat, id auctor erat. Suspendisse convallis facilisis odio, at dictum ex placerat non. Mauris eget augue dapibus, facilisis augue sed, tincidunt ante. Ut non finibus nisl, id vestibulum lorem. Duis iaculis elementum purus, quis convallis nisi tempus sed.

Sed dictum nec magna a fringilla. Nullam quis venenatis odio, ac vehicula ligula. Suspendisse imperdiet pellentesque cursus. Donec tempus, nunc id lobortis porta, ante sem maximus metus, at hendrerit massa est vel ligula. Vivamus at lacinia augue, vitae elementum augue. Vestibulum rutrum, diam nec molestie dignissim, eros leo faucibus mi, ac posuere ante orci eget est. Duis facilisis a metus vitae vestibulum. Sed laoreet massa convallis commodo ullamcorper. Pellentesque metus leo, faucibus sit amet finibus vitae, dictum vitae lectus. Ut ut rutrum ligula.

Praesent suscipit sem sed ipsum porttitor pretium. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent ut odio a tellus faucibus dictum non at massa. Phasellus sed neque lacinia, aliquam purus sit amet, suscipit tortor. Etiam ultricies aliquam lectus eu lobortis. Cras ultricies sagittis fermentum. Suspendisse consequat arcu in urna lobortis pellentesque. Aliquam elementum aliquam nulla quis finibus. Mauris ac purus suscipit, imperdiet est a, lacinia purus. Etiam condimentum dapibus eros, ac aliquam dolor condimentum ac. Pellentesque placerat eros ac nisl tempor, a faucibus erat dapibus. Nulla facilisi. Maecenas risus nisl, accumsan in accumsan vel, faucibus sit amet mi.

Integer sollicitudin risus id lorem congue, quis consequat massa laoreet. Praesent imperdiet justo a odio eleifend, ac vestibulum nisl iaculis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin et laoreet eros, vel lobortis arcu. Donec fermentum placerat risus, sit amet semper neque tincidunt nec. Morbi semper magna ac lorem sagittis sollicitudin. Vestibulum sed ligula at lacus porta egestas in quis nisl.
      </div>
    </div>
  )
};

export default App;
