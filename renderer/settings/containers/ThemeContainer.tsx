import { Show, createSignal, onMount } from 'solid-js';

import { Config } from '../../../src/config';
import Card from '../../components/Card';
import Selector from '../../components/Select';
import useConfig from '../../hooks/useConfig';
import useHorizontalScroll from '../../hooks/useHorizontalScroll';
import ColorPicker from '../components/ColorPicker';


const ThemeContainer = () => {
  const presetContainer: HTMLDivElement | null = null;

  const [config, setConfig] = useConfig();
  const [keyword, setKeyword] = createSignal();
  const [fontList, setFontList] = createSignal<string[]>([]);

  void (async () => {
    setFontList(await window.getFont({ disableQuoting: true }));
  })();

  onMount(() => {
    if (presetContainer) {
      useHorizontalScroll(presetContainer);
    }
  });

  return <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 py-4 fluent-scrollbar'}>
    <div class={'text-3xl mb-1 px-4'}>
      테마
    </div>
    <Show when={false}>
      <div class={'text-md mt-4 mb-1 px-4'}>
        프리셋
      </div>
      <div
        ref={presetContainer}
        class={'min-h-[128px] flex flex-row justify-start items-center gap-1 fluent-scrollbar px-4'}
      >
        <Card class={'min-w-[128px] h-[128px]'}>
          대충 프리셋1
        </Card>
        <Card class={'min-w-[128px] h-[128px]'}>
          대충 프리셋2
        </Card>
        <Card class={'min-w-[128px] h-[128px]'}>
          대충 프리셋3
        </Card>
        <Card class={'min-w-[128px] h-[128px]'}>
          대충 프리셋4
        </Card>
        <Card class={'min-w-[128px] h-[128px]'}>
          대충 프리셋5
        </Card>
        <Card class={'min-w-[128px] h-[128px]'}>
          대충 프리셋6
        </Card>
      </div>
    </Show>
    <div class={'text-md mt-4 mb-1 px-4'}>
      일반 테마 설정
    </div>
    <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          폰트
        </div>
        <Selector
          placeholder={'폰트 선택'}
          class={'select min-w-[210px] font-select'}
          style={{
            'font-family': config()?.style?.font,
          }}
          popupClass={'p-1 bg-gray-800 rounded'}
          options={fontList()}
          value={config()?.style?.font}
          onChange={(value) => void setConfig({ style: { font: value } })}
          renderItem={(props, option) => <li
              {...props}
              style={{ 'font-family': option }}
              class={'w-full p-2 hover:bg-gray-700 rounded'}
            >
              {option}
            </li>}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          폰트 두께
        </div>
        <Selector
          placeholder={'1-100'}
          class={'select w-48 font-select'}
          style={{
            'font-family': config()?.style?.font,
            'font-weight': config()?.style?.fontWeight,
          }}
          popupClass={'p-1 bg-gray-800 rounded'}
          options={[
            '100',
            '200',
            '300',
            '400',
            '500',
            '600',
            '700',
            '800',
            '900',
          ]}
          value={config()?.style?.fontWeight ?? '400'}
          onChange={(value) => void setConfig({ style: { fontWeight: value } })}
          renderItem={(props, option) => <li
              {...props}
              style={{ 'font-weight': option }}
              class={'w-full p-2 hover:bg-gray-700 rounded truncate'}
            >
              {option} - 다람쥐 헌 쳇바퀴에 타고파
            </li>}
        />
      </Card>
    </div>
    <div class={'text-md mt-4 mb-1 px-4'}>
      Now Playing 테마 설정
    </div>
    <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          글씨 크기
        </div>
        <input
          type={'number'}
          class={'input'}
          value={config()?.style.nowPlaying.fontSize}
          onChange={(event) => void setConfig({ style: { nowPlaying: { fontSize: event.target.valueAsNumber } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          글씨 색상
        </div>
        <ColorPicker
          value={config()?.style.nowPlaying.color}
          onColorChange={(color) => void setConfig({ style: { nowPlaying: { color } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          배경 색상
        </div>
        <ColorPicker
          value={config()?.style.nowPlaying.background}
          onColorChange={(color) => void setConfig({ style: { nowPlaying: { background: color } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          재생바 색상
        </div>
        <ColorPicker
          value={config()?.style.nowPlaying.backgroundProgress}
          onColorChange={(color) => void setConfig({ style: { nowPlaying: { backgroundProgress: color } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          최대 크기
        </div>
        <input
          type={'number'}
          class={'input'}
          value={config()?.style.nowPlaying.maxWidth}
          onChange={(event) => void setConfig({ style: { nowPlaying: { maxWidth: event.target.valueAsNumber } } })}
        />
      </Card>
    </div>
    <div class={'text-md mt-4 mb-1 px-4'}>
      가사 테마 설정
    </div>
    <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          글씨 크기
        </div>
        <input
          type={'number'}
          class={'input'}
          value={config()?.style.lyric.fontSize}
          onChange={(event) => void setConfig({ style: { lyric: { fontSize: event.target.valueAsNumber } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          글씨 색상
        </div>
        <ColorPicker
          value={config()?.style.lyric.color}
          onColorChange={(color) => void setConfig({ style: { lyric: { color } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          배경 색상
        </div>
        <ColorPicker
          value={config()?.style.lyric.background}
          onColorChange={(color) => void setConfig({ style: { lyric: { background: color } } })}
        />
      </Card>
    </div>
    <div class={'text-md mt-4 mb-1 px-4'}>
      테마 리셋
    </div>
    <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          테마 초기화
        </div>
        <Card
          class={'py-[0.4rem] w-[12.7rem] text-center items-center'}
          onClick={() => void (async() => {
            await setConfig(await window.ipcRenderer.invoke('get-default-config') as Config)
          })()}
        >
          초기화
        </Card>
      </Card>
    </div>
  </div>
};

export default ThemeContainer;
