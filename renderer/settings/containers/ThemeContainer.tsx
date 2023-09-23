import { Show, createSignal, onCleanup, onMount, untrack } from 'solid-js';
import { Trans, useTransContext } from '@jellybrick/solid-i18next';

import { useNavigate, useParams } from '@solidjs/router';

import { StyleConfig } from '../../../common/config';
import Card from '../../components/Card';
import Selector from '../../components/Select';

import useConfig from '../../hooks/useConfig';
import LyricsTransition from '../../main/components/LyricsTransition';
import ColorPicker from '../components/ColorPicker';
import UserCSSEditor from '../components/UserCSSEditor';
import { cx } from '../../utils/classNames';
import Switch from '../../components/Switch';

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
  const params = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useConfig();
  const [t] = useTransContext();

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

  const [fontList, setFontList] = createSignal<string[]>([]);
  const [animationPreview, setAnimationPreview] = createSignal(PREVIEW_TEXT_A);

  const themeName = () => decodeURIComponent(params.name);
  const theme = () => config()?.themes[themeName()];

  let interval: ReturnType<typeof setInterval> | null = null;
  onMount(() => {
    let isTick = false;
    interval = setInterval(() => {
      const nextPreview = untrack(() => isTick ? PREVIEW_TEXT_A : PREVIEW_TEXT_B);

      isTick = !isTick;
      setAnimationPreview(nextPreview);
    }, 1500);
  });
  (async () => {
    setFontList(await window.getFont({ disableQuoting: true }));
  })();
  onCleanup(() => interval && clearInterval(interval));

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
  const setTheme = (style: DeepPartial<StyleConfig>) => {
    const nowThemeName = themeName();

    setConfig({
      themes: {
        [nowThemeName]: {
          ...style,
        },
      }
    });
  };
  const onThemeListPage = () => {
    navigate('/theme');
  };

  return <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 py-4 fluent-scrollbar'}>
    <div class={'text-3xl mb-1 px-4 flex justify-start items-center gap-2 select-none'}>
      <span class={'text-3xl opacity-80 hover:opacity-100'} onClick={onThemeListPage}>
        <Trans key={'setting.title.theme'} />
      </span>
      <svg class={'w-4 h-4'} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.47 4.22a.75.75 0 0 0 0 1.06L15.19 12l-6.72 6.72a.75.75 0 1 0 1.06 1.06l7.25-7.25a.75.75 0 0 0 0-1.06L9.53 4.22a.75.75 0 0 0-1.06 0Z" class={'fill-black dark:fill-white'} />
      </svg>
      <span class={'text-3xl'}>
        {themeName() ?? t('setting.theme.unknown')}
      </span>
    </div>
    <div class={'text-md mt-4 mb-1 px-4'}>
      <Trans key={'setting.theme.generic-theme-settings'} />
    </div>
    <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.font'} />
        </div>
        <Selector
          mode={'autocomplete'}
          placeholder={t('setting.theme.font.placeholder')}
          class={'select min-w-[210px] font-select'}
          style={{
            'font-family': theme()?.font,
          }}
          options={fontList()}
          value={theme()?.font}
          onChange={(value) => setTheme({ font: value })}
          renderItem={(props, option, isSelected) => <li
              {...props}
              class={cx(
                'w-full py-2 hover:bg-white/10 rounded-lg truncate flex items-center shrink-0',
                isSelected && 'bg-white/10',
              )}
              style={{ 'font-family': option }}
            >
              <Show when={isSelected}>
                <div class={'bg-primary-500 rounded w-1 h-4'} />
              </Show>
              <div class={'px-2'}>
                {option}
              </div>
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
            'font-family': theme()?.font,
            'font-weight': theme()?.fontWeight,
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
          value={theme()?.fontWeight ?? '400'}
          onChange={(value) => setTheme({ fontWeight: value })}
          renderItem={(props, option, isSelected) => <li
              {...props}
              class={cx(
                'w-full py-2 hover:bg-white/10 rounded-lg truncate flex items-center',
                isSelected && 'bg-white/10',
              )}
              style={{ 'font-family': theme()?.font, 'font-weight': option }}
            >
              <Show when={isSelected}>
                <div class={'bg-primary-500 rounded w-1 h-4'} />
              </Show>
              <div class={'px-2'}>
                <Trans key={'setting.theme.font-weight.option'} options={{ weight: option }} />
              </div>
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
              <LyricsTransition
                class={'w-full items-end'}
                style={`row-gap: ${theme()?.lyric.containerRowGap}rem;`}
                lyrics={animationPreview()}
                status="playing"
              />
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
              class={'select w-48'}
              options={ANIMATION_LIST}
              value={theme()?.animation ?? 'pretty'}
              onChange={(value) => setTheme({ animation: value })}
            />
          </div>,
          <div class={'w-full h-full flex justify-start items-center'}>
            <div class={'text-md'}>
              <Trans key={'setting.theme.animation.at-once'} />
            </div>
            <div class={'flex-1'} />
            <Switch
              value={theme()?.animationAtOnce}
              onChange={(checked) => setTheme({ animationAtOnce: checked })}
            />
          </div>,
        ]}
      >
        <div class={'text-md'}>
          <Trans key={'setting.theme.animation'} />
        </div>
        <div class={'flex-1'} />
        <div class={'text-md text-black/50 dark:text-white/80 mr-2'}>
          {getAnimationName(theme()?.animation ?? 'pretty')}
        </div>
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.proximity-opacity'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={theme()?.proximityOpacity}
          onChange={(event) => setTheme({ proximityOpacity: event.target.valueAsNumber })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.proximity-sensitivity'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={theme()?.proximitySensitivity}
          onChange={(event) => setTheme({ proximitySensitivity: event.target.valueAsNumber })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.max-height'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={theme()?.maxHeight}
          onChange={(event) => setTheme({ maxHeight: event.target.valueAsNumber })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.margin-between-lyrics-and-progressbar'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={theme()?.rowGap}
          onChange={(event) => setTheme({ rowGap: event.target.valueAsNumber })}
        />
      </Card>
      <Card class={'flex flex-row justify-start items-center gap-1'}>
        <div class={'font-md'}>
          <Trans key={'setting.position.select-to-show-now-playing-panel'} />
        </div>
        <div class={'flex-1'} />
        <Selector
          format={(value) => value === 'true' ? t('setting.position.show-now-playing-panel') : t('setting.position.hide-now-playing-panel')}
          value={theme()?.nowPlaying?.visible?.toString() ?? 'true'}
          onChange={(value) => setTheme({ nowPlaying: { visible: value === 'true' } })}
          options={['true', 'false']}
          class={'select'}
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
          value={theme()?.nowPlaying.fontSize}
          onChange={(event) => setTheme({ nowPlaying: { fontSize: event.target.valueAsNumber } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.font-color'} />
        </div>
        <ColorPicker
          value={theme()?.nowPlaying.color}
          onColorChange={(color) => setTheme({ nowPlaying: { color } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.background-color'} />
        </div>
        <ColorPicker
          value={theme()?.nowPlaying.background}
          onColorChange={(color) => setTheme({ nowPlaying: { background: color } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.progressbar-color'} />
        </div>
        <ColorPicker
          value={theme()?.nowPlaying.backgroundProgress}
          onColorChange={(color) => setTheme({ nowPlaying: { backgroundProgress: color } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.max-width'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={theme()?.nowPlaying.maxWidth}
          onChange={(event) => setTheme({ nowPlaying: { maxWidth: event.target.valueAsNumber } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.stopped-opacity'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={theme()?.nowPlaying.stoppedOpacity}
          onChange={(event) => setTheme({ nowPlaying: { stoppedOpacity: event.target.valueAsNumber } })}
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
          value={theme()?.lyric.fontSize}
          onChange={(event) => setTheme({ lyric: { fontSize: event.target.valueAsNumber } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.font-color'} />
        </div>
        <ColorPicker
          value={theme()?.lyric.color}
          onColorChange={(color) => setTheme({ lyric: { color } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.background-color'} />
        </div>
        <ColorPicker
          value={theme()?.lyric.background}
          onColorChange={(color) => setTheme({ lyric: { background: color } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.stopped-opacity'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={theme()?.lyric.stoppedOpacity}
          onChange={(event) => setTheme({ lyric: { stoppedOpacity: event.target.valueAsNumber } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.margin-between-lyrics-containers'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={theme()?.lyric.containerRowGap}
          onChange={(event) => setTheme({ lyric: { containerRowGap: event.target.valueAsNumber } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.margin-between-multiple-lyrics-containers'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={theme()?.lyric.multipleContainerRowGap}
          onChange={(event) => setTheme({ lyric: { multipleContainerRowGap: event.target.valueAsNumber } })}
        />
      </Card>
      <Card class={'flex flex-row justify-start items-center gap-1'}>
        <div class={'font-md'}>
          <Trans key={'setting.position.select-orientation-to-display-lyrics'} />
        </div>
        <div class={'flex-1'} />
        <Selector
          format={(value) => value === 'column' ? t('setting.position.from-top-to-bottom') : t('setting.position.from-bottom-to-top')}
          value={theme()?.lyric?.direction ?? 'column'}
          onChange={(value) => setTheme({ lyric: { direction: value } })}
          options={['column', 'column-reverse']}
          class={'select'}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.general.next-lyric-count'} />
        </div>
        <input
          type={'number'}
          min={0}
          step={1}
          class={'input w-48'}
          value={theme()?.lyric.nextLyric}
          onChange={(event) => setTheme({ lyric: { nextLyric: Math.round(event.target.valueAsNumber) } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.general.previous-lyric-count'} />
        </div>
        <input
          type={'number'}
          min={0}
          step={1}
          class={'input w-48'}
          value={theme()?.lyric.previousLyric}
          onChange={(event) => setTheme({ lyric: { previousLyric: Math.round(event.target.valueAsNumber) } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.next-lyrics-opacity'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={theme()?.lyric.nextLyricOpacity}
          onChange={(event) => setTheme({ lyric: { nextLyricOpacity: event.target.valueAsNumber } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.previous-lyrics-opacity'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={theme()?.lyric.previousLyricOpacity}
          onChange={(event) => setTheme({ lyric: { previousLyricOpacity: event.target.valueAsNumber } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.next-lyrics-scale'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={theme()?.lyric.nextLyricScale}
          onChange={(event) => setTheme({ lyric: { nextLyricScale: event.target.valueAsNumber } })}
        />
      </Card>
      <Card class={'flex flex-row justify-between items-center gap-1'}>
        <div class={'text-md'}>
          <Trans key={'setting.theme.previous-lyrics-scale'} />
        </div>
        <input
          type={'number'}
          class={'input w-48'}
          value={theme()?.lyric.previousLyricScale}
          onChange={(event) => setTheme({ lyric: { previousLyricScale: event.target.valueAsNumber } })}
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
          <UserCSSEditor
            css={theme()?.userCSS}
            onUpdate={(value) => setTheme({ userCSS: value })}
          />
        ]}
      >
        <div class={'w-full h-full flex flex-col justify-center items-start gap-0'}>
          <div class={'text-md'}>
            <Trans key={'setting.theme.user-css'} />
          </div>
        </div>
      </Card>
    </div>
  </div>;
};

export default ThemeContainer;
