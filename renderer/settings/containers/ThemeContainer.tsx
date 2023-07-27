import { Show, createSignal, onCleanup, onMount, untrack } from 'solid-js';

import { Config } from '../../../src/config';
import Card from '../../components/Card';
import Selector from '../../components/Select';

import useConfig from '../../hooks/useConfig';
import useHorizontalScroll from '../../hooks/useHorizontalScroll';
import LyricsTransition from '../../main/components/LyricsTransition';
import ColorPicker from '../components/ColorPicker';
import UserCSSEditor from '../components/UserCSSEditor';

const ANIMATION_LIST = [
  'none',
  'fade',
  'pretty',
  'slide',
  'show-up',
  'scale',
  'slime',
  'custom',
];

const ThemeContainer = () => {
  const [presetContainer, setPresetContainer] = createSignal<HTMLDivElement | null>(null);
  onMount(() => {
    const container = presetContainer();
    if (container) {
      useHorizontalScroll(container);
    }
  });

  const [config, setConfig] = useConfig();
  const [fontList, setFontList] = createSignal<string[]>([]);

  (async () => {
    setFontList(await window.getFont({ disableQuoting: true }));
  })();

  const getAnimationName = (value: string) => {
    if (value === 'none') return '없음';
    if (value === 'fade') return '페이드';
    if (value === 'pretty') return '예쁘게';
    if (value === 'slide') return '슬라이드';
    if (value === 'show-up') return 'Show Up';
    if (value === 'scale') return '크기조절';
    if (value === 'slime') return '슬라임';
    if (value === 'custom') return '사용자 CSS';

    return `알 수 없음(${value})`;
  };

  const PREVIEW_TEXT_A = [
    '가사 전환 애니메이션 미리보기용 가사입니다',
    'https://github.com/organization/alspotron',
    '가사 전환 애니메이션을 바꾸는 중간에는 끊길수 있습니다',
  ];

  const PREVIEW_TEXT_B = [
    '계절이 지나가는 하늘에는',
    '가을로 가득 차 있습니다.',
    '나는 아무 걱정도 없이'
  ];

  const [animationPreview, setAnimationPreview] = createSignal(PREVIEW_TEXT_A);

  let interval: NodeJS.Timer | null = null;
  onMount(() => {
    let isTick = false;
    interval = setInterval(() => {
      const nextPreview = untrack(() => isTick ? PREVIEW_TEXT_A : PREVIEW_TEXT_B);

      isTick = !isTick;
      setAnimationPreview(nextPreview);
    }, 1500);
  });
  onCleanup(() => interval && clearInterval(interval));

  return <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 py-4 fluent-scrollbar'}>
    <div class={'text-3xl mb-1 px-4'}>
      테마
    </div>
    <Show when={false}>
      <div class={'text-md mt-4 mb-1 px-4'}>
        프리셋
      </div>
      <div
        ref={setPresetContainer}
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
          onChange={(value) => setConfig({ style: { font: value } })}
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
          onChange={(value) => setConfig({ style: { fontWeight: value } })}
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
              <LyricsTransition class={'w-full items-end'} lyrics={animationPreview()} status="playing" />
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
              onChange={(value) => setConfig({ style: { animation: value } })}
              renderItem={(props, option) => <li
                {...props}
                class={'w-full p-2 hover:bg-white/10 rounded-lg truncate'}
              >
                {getAnimationName(option)}
              </li>}
            />
          </div>,
          <div class={'w-full h-full flex justify-start items-center'}>
            <div class={'text-md'}>
              한번에 전환
            </div>
            <div class={'flex-1'} />
            <input
              class={'checkbox'}
              type="checkbox" 
              checked={config()?.style?.animationAtOnce}
              onChange={({ target: { checked } }) => setConfig({ style: { animationAtOnce: checked } })}
            />
          </div>,
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
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          마우스 커서 근접 시 불투명도
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={config()?.style.proximityOpacity}
          onChange={(event) => setConfig({ style: { proximityOpacity: event.target.valueAsNumber } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          마우스 커서 근접 민감도
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={config()?.style.proximitySensitivity}
          onChange={(event) => setConfig({ style: { proximitySensitivity: event.target.valueAsNumber } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          최대 높이
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={config()?.style.maxHeight}
          onChange={(event) => setConfig({ style: { maxHeight: event.target.valueAsNumber } })}
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
          class={'input w-48'}
          value={config()?.style.nowPlaying.fontSize}
          onChange={(event) => setConfig({ style: { nowPlaying: { fontSize: event.target.valueAsNumber } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          글씨 색상
        </div>
        <ColorPicker
          value={config()?.style.nowPlaying.color}
          onColorChange={(color) => setConfig({ style: { nowPlaying: { color } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          배경 색상
        </div>
        <ColorPicker
          value={config()?.style.nowPlaying.background}
          onColorChange={(color) => setConfig({ style: { nowPlaying: { background: color } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          재생바 색상
        </div>
        <ColorPicker
          value={config()?.style.nowPlaying.backgroundProgress}
          onColorChange={(color) => setConfig({ style: { nowPlaying: { backgroundProgress: color } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          최대 크기
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={config()?.style.nowPlaying.maxWidth}
          onChange={(event) => setConfig({ style: { nowPlaying: { maxWidth: event.target.valueAsNumber } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          일시정지 시 불투명도
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={config()?.style.nowPlaying.stoppedOpacity}
          onChange={(event) => setConfig({ style: { nowPlaying: { stoppedOpacity: event.target.valueAsNumber } } })}
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
          class={'input w-48'}
          value={config()?.style.lyric.fontSize}
          onChange={(event) => setConfig({ style: { lyric: { fontSize: event.target.valueAsNumber } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          글씨 색상
        </div>
        <ColorPicker
          value={config()?.style.lyric.color}
          onColorChange={(color) => setConfig({ style: { lyric: { color } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          배경 색상
        </div>
        <ColorPicker
          value={config()?.style.lyric.background}
          onColorChange={(color) => setConfig({ style: { lyric: { background: color } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          일시정지 시 불투명도
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={config()?.style.lyric.stoppedOpacity}
          onChange={(event) => setConfig({ style: { lyric: { stoppedOpacity: event.target.valueAsNumber } } })}
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
          <UserCSSEditor />
        ]}
      >
        <div class={'w-full h-full flex flex-col justify-center items-start gap-0'}>
          <div class={'text-md'}>
            사용자 CSS
          </div>
        </div>
      </Card>
    </div>
    <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
      <Card
        class={'flex flex-row justify-between items-center gap-1'}
        subCards={[
          <div class={'w-full h-full flex justify-start items-center'}>
            <button
              class={'btn-primary'}
              onClick={(async () => {
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
