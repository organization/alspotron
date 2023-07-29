import { Show, createSignal, onCleanup, onMount, untrack } from 'solid-js';
import { Trans, useTransContext } from '@jellybrick/solid-i18next';

import { Config } from '../../../common/config';
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
  const [t] = useTransContext();

  (async () => {
    setFontList(await window.getFont({ disableQuoting: true }));
  })();

  const getAnimationName = (value: string) => {
    if (value === 'none') return t('setting.theme.animation.none');
    if (value === 'fade') return t('setting.theme.animation.fade');
    if (value === 'pretty') return t('setting.theme.animation.pretty');
    if (value === 'slide') return t('setting.theme.animation.slide');
    if (value === 'show-up') return t('setting.theme.animation.show-up');
    if (value === 'scale') return t('setting.theme.animation.scale');
    if (value === 'slime') return t('setting.theme.animation.slime');
    if (value === 'custom') return t('setting.theme.animation.custom-css');

    return t('setting.theme.animation.unknown', {
      code: value,
    });
  };

  const PREVIEW_TEXT_A = [
    t('setting.theme.animation.preview-text-a.0'),
    t('setting.theme.animation.preview-text-a.1'),
    t('setting.theme.animation.preview-text-a.2'),
  ];

  const PREVIEW_TEXT_B = [
    t('setting.theme.animation.preview-text-b.0'),
    t('setting.theme.animation.preview-text-b.1'),
    t('setting.theme.animation.preview-text-b.2'),
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
      <Trans key={'setting.title.theme'} />
    </div>
    <Show when={false}>
      <div class={'text-md mt-4 mb-1 px-4'}>
        <Trans key={'setting.theme.preset'} />
      </div>
      <div
        ref={setPresetContainer}
        class={'min-h-[128px] flex flex-row justify-start items-center gap-1 fluent-scrollbar px-4'}
      >
        <Card class={'min-w-[128px] h-[128px]'}>
          Preset1
        </Card>
        <Card class={'min-w-[128px] h-[128px]'}>
          Preset2
        </Card>
        <Card class={'min-w-[128px] h-[128px]'}>
          Preset3
        </Card>
        <Card class={'min-w-[128px] h-[128px]'}>
          Preset4
        </Card>
        <Card class={'min-w-[128px] h-[128px]'}>
          Preset5
        </Card>
        <Card class={'min-w-[128px] h-[128px]'}>
          Preset6
        </Card>
      </div>
    </Show>
    <div class={'text-md mt-4 mb-1 px-4'}>
      <Trans key={'setting.theme.generic-theme-settings'} />
    </div>
    <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.font'} />
        </div>
        <Selector
          placeholder={t('setting.theme.font.placeholder')}
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
          <Trans key={'setting.theme.font-weight'} />
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
            <Trans key={'setting.theme.font-weight.option'} options={{ weight: option }} />
          </li>}
        />
      </Card>
      <Card
        class={'flex flex-row justify-between items-center gap-1'}
        subCards={[
          <div class={'flex flex-col justify-start items-stretch gap-1'}>
            <div class={'text-md'}> 
              <Trans key={'setting.theme.preview'} />
            </div>
            <div class={'relative w-full h-32 flex flex-col justify-start items-start gap-4'}>
              <LyricsTransition class={'w-full items-end'} lyrics={animationPreview()} status="playing" />
            </div>
          </div>,
          <div class={'w-full h-full flex justify-start items-center'}>
            <div class={'text-md'}>
              <Trans key={'setting.theme.select-animation'} />
            </div>
            <div class={'flex-1'} />
            <Selector
              format={getAnimationName}
              placeholder={t('setting.theme.animation.placeholder')}
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
              <Trans key={'setting.theme.animation.at-once'} />
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
          <Trans key={'setting.theme.animation'} />
        </div>
        <div class={'flex-1'} />
        <div class={'text-md text-white/80 mr-2'}>
          {getAnimationName(config()?.style?.animation ?? 'pretty')}
        </div>
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.proximity-opacity'} />
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
          <Trans key={'setting.theme.proximity-sensitivity'} />
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
          <Trans key={'setting.theme.max-height'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={config()?.style.maxHeight}
          onChange={(event) => setConfig({ style: { maxHeight: event.target.valueAsNumber } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.margin-between-lyrics-and-progressbar'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={config()?.style.rowGap}
          onChange={(event) => setConfig({ style: { rowGap: event.target.valueAsNumber } })}
        />
      </Card>
    </div>
    <div class={'text-md mt-4 mb-1 px-4'}>
      <Trans key={'setting.theme.now-playing'} />
    </div>
    <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.font-size'} />
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
          <Trans key={'setting.theme.font-color'} />
        </div>
        <ColorPicker
          value={config()?.style.nowPlaying.color}
          onColorChange={(color) => setConfig({ style: { nowPlaying: { color } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.background-color'} />
        </div>
        <ColorPicker
          value={config()?.style.nowPlaying.background}
          onColorChange={(color) => setConfig({ style: { nowPlaying: { background: color } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.progressbar-color'} />
        </div>
        <ColorPicker
          value={config()?.style.nowPlaying.backgroundProgress}
          onColorChange={(color) => setConfig({ style: { nowPlaying: { backgroundProgress: color } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.max-width'} />
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
          <Trans key={'setting.theme.stopped-opacity'} />
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
      <Trans key={'setting.theme.lyric'} />
    </div>
    <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.font-size'} />
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
          <Trans key={'setting.theme.font-color'} />
        </div>
        <ColorPicker
          value={config()?.style.lyric.color}
          onColorChange={(color) => setConfig({ style: { lyric: { color } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.background-color'} />
        </div>
        <ColorPicker
          value={config()?.style.lyric.background}
          onColorChange={(color) => setConfig({ style: { lyric: { background: color } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.stopped-opacity'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={config()?.style.lyric.stoppedOpacity}
          onChange={(event) => setConfig({ style: { lyric: { stoppedOpacity: event.target.valueAsNumber } } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.margin-between-lyrics-containers'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={config()?.style.lyric.containerRowGap}
          onChange={(event) => setConfig({ style: { lyric: { containerRowGap: event.target.valueAsNumber } } })}
        />
      </Card>
    </div>
    <div class={'text-md mt-4 mb-1 px-4'}>
      <Trans key={'setting.theme.theme'} />
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
            <Trans key={'setting.theme.user-css'} />
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
              <Trans key={'setting.theme.reset'} />
            </button>
          </div>,
        ]}
      >
        <div class={'w-full h-full flex flex-col justify-center items-start gap-0'}>
          <div class={'text-md'}>
            <Trans key={'setting.theme.theme-reset'} />
          </div>
          <div class={'text-xs mt-[-2px] text-white/80'}>
            <Trans key={'setting.theme.theme-reset-warning'} />
          </div>
        </div>
      </Card>
    </div>
  </div>
};

export default ThemeContainer;
