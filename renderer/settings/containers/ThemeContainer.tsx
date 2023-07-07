import { Show, createSignal, onCleanup, onMount } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';

import { Config } from '../../../src/config';
import Card from '../../components/Card';
import Selector from '../../components/Select';

import useConfig from '../../hooks/useConfig';
import useHorizontalScroll from '../../hooks/useHorizontalScroll';
import LyricsItem from '../../main/components/LyricsItem';
import ColorPicker from '../components/ColorPicker';

const ANIMATION_LIST = [
  'none',
  'fade',
  'pretty',
  'slide',
  'show-up',
  'scale',
  'slime',
];

const ThemeContainer = () => {
  // eslint-disable-next-line prefer-const
  let presetContainer: HTMLDivElement | null = null;
  let interval: NodeJS.Timer | null = null;

  const [config, setConfig] = useConfig();
  const [fontList, setFontList] = createSignal<string[]>([]);
  const [preview, setPreview] = createSignal(false);

  void (async () => {
    setFontList(await window.getFont({ disableQuoting: true }));
  })();

  onMount(() => {
    if (presetContainer) useHorizontalScroll(presetContainer);

    interval = setInterval(() => {
      setPreview(!preview());
    }, 1500);
  });
  onCleanup(() => {
    if (interval) clearInterval(interval);
  });

  const getAnimationName = (value: string) => {
    if (value === 'none') return '없음';
    if (value === 'fade') return '페이드';
    if (value === 'pretty') return '예쁘게';
    if (value === 'slide') return '슬라이드';
    if (value === 'show-up') return 'Show Up';
    if (value === 'scale') return '크기조절';
    if (value === 'slime') return '슬라임';

    return `알 수 없음(${value})`;
  };

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
          options={fontList()}
          value={config()?.style?.font}
          onChange={(value) => void setConfig({ style: { font: value } })}
          renderItem={(props, option) => <li
            {...props}
            style={{ 'font-family': option }}
            class={'w-full p-2 hover:bg-white/10 rounded-lg'}
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
            class={'w-full p-2 hover:bg-white/10 rounded-lg truncate'}
          >
            {option} - 다람쥐 헌 쳇바퀴에 타고파
          </li>}
        />
      </Card>
      <Card
        class={'flex flex-row justify-between items-center gap-1'}
        subCards={[
          <div class={'flex flex-col justify-start items-stretch gap-1'}>
            <div class={'text-md'}> 
              미리보기
            </div>
            <div class={'relative w-full h-32 flex flex-col justify-start items-start gap-4'}>
              <TransitionGroup name={`lyric-${config()?.style?.animation ?? 'pretty'}`}>
                <Show when={preview()}>
                  <LyricsItem delay={0}>
                    가사 전환 애니메이션 미리보기용 가사입니다
                  </LyricsItem>
                  <LyricsItem
                    delay={config()?.style?.animation === 'none' ? 0 : 1}>
                    https://github.com/organization/alspotron
                  </LyricsItem>
                  <LyricsItem
                    delay={config()?.style?.animation === 'none' ? 0 : 2}
                  >
                    가사 전환 애니메이션을 바꾸는 중간에는 끊길수 있습니다
                  </LyricsItem>
                </Show>
              </TransitionGroup>
            </div>
          </div>,
          <div class={'w-full h-full flex justify-start items-center'}>
            <div class={'text-md'}>
              애니메이션 선택
            </div>
            <div class={'flex-1'} />
            <Selector
              format={getAnimationName}
              placeholder={'가사 전환 애니메이션'}
              class={'select w-48 font-select'}
              options={ANIMATION_LIST}
              value={config()?.style?.animation ?? 'pretty'}
              onChange={(value) => void setConfig({ style: { animation: value } })}
              renderItem={(props, option) => <li
                {...props}
                style={{ 'font-weight': option }}
                class={'w-full p-2 hover:bg-white/10 rounded-lg truncate'}
              >
                {getAnimationName(option)}
              </li>}
            />
          </div>
        ]}
      >
        <div class={'text-md'}>
          가사 전환 애니메이션
        </div>
        <div class={'flex-1'} />
        <div class={'text-md text-white/80 mr-2'}>
          {getAnimationName(config()?.style?.animation ?? 'pretty')}
        </div>
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
      테마 설정
    </div>
    <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
      <Card
        class={'flex flex-row justify-between items-center gap-1'}
        subCards={[
          <div class={'w-full h-full flex justify-start items-center'}>
            <button
              class={'btn-primary'}
              onClick={void (async () => {
                await setConfig(await window.ipcRenderer.invoke('get-default-config') as Config)
              })}
              >
              초기화
            </button>
          </div>,
        ]}
      >
        <div class={'w-full h-full flex flex-col justify-center items-start gap-0'}>
          <div class={'text-md'}>
            테마 초기화
          </div>
          <div class={'text-xs mt-[-2px] text-white/80'}>
            테마를 초기화 하게 되면 원상 복구 할 수 없습니다.
          </div>
        </div>
      </Card>
    </div>
  </div>
};

export default ThemeContainer;
