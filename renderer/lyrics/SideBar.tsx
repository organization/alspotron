import { createEffect, createMemo, For, Match, Show, Switch } from 'solid-js';
import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { Marquee } from '@suyongs/solid-utility';
import { Entry } from 'tstl';

import Card from '../components/Card';
import { LyricMode, usePlayingInfo } from '../components/PlayingInfoProvider';
import useLyric from '../hooks/useLyric';
import useLyricMapper from '../hooks/useLyricMapper';
import LyricProgressBar from '../main/components/LyricProgressBar';
import Selector from '../components/Select';
import { LyricMapperMode } from '../../common/schema';
import { getLyricMapperId } from '../../common/utils';

const SideBar = () => {
  const { coverUrl, title, lyrics, playerLyrics, lyricData, lyricMode, isMapped } = usePlayingInfo();
  const [, lyricTime] = useLyric();
  const [lyricMapper, setLyricMapper] = useLyricMapper();
  const [t] = useTransContext();

  const lyricMapperItem = () => lyricMapper()[getLyricMapperId(title(), coverUrl())];
  const lyricItems = createMemo(() => {
    if (lyricMode() === 'player') {
      return Object.entries(playerLyrics() ?? {}).map(([time, lyrics]) => new Entry(~~time, lyrics));
    } else {
      return lyrics()?.toJSON() ?? [];
    }
  });

  createEffect(() => {
    const time = lyricTime();

    document.querySelector(`#lyric-${time ?? '0'}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });

  const onChangeLyricMode = (mode: LyricMode) => {
    let newMode: LyricMapperMode | undefined = undefined;
    if (mode === 'player') newMode = { type: 'player' };
    if (mode === 'none') newMode = { type: 'none' };

    const newMapper = {
      [getLyricMapperId(title(), coverUrl())]: {
        mode: newMode,
      },
    };

    setLyricMapper(newMapper);
  };

  return (
    <div
      class={`
        w-[312px] h-full p-4
        flex flex-col justify-start items-stretch gap-2
        text-black dark:text-white
      `}
    >
      <div class={'text-xl'}>
        <Trans key={'lyrics.current-playing-track'}/>
      </div>
      <LyricProgressBar class={'!w-[280px]'}/>
      <div class={'text-xl mt-4'}>
        <Trans key={'lyrics.current-applied-lyric'}/>
      </div>
      <Card
        class={'w-full flex flex-row justify-start items-center gap-1'}
        subCards={[
          <div class={'w-full h-full flex justify-between items-center'}>
            <Trans key={'lyrics.mode'}/>
            <Selector
              mode={'select'}
              options={['auto', 'player', 'none'] as LyricMode[]}
              value={lyricMode()}
              format={(mode) => t(`lyrics.mode.${mode}`)}
              onChange={onChangeLyricMode}
            />
          </div>,
          <div class={'w-full h-full flex justify-between items-center'}>
            <Trans key={'lyrics.delay'}/>
            <label class={'input-group group'}>
              <input
                type={'number'}
                class={'input'}
                value={lyricMapperItem()?.delay ?? 0}
                onChange={(e) => {
                  setLyricMapper({
                    [getLyricMapperId(title(), coverUrl())]: {
                      delay: ~~(e.currentTarget.valueAsNumber ?? 0),
                    },
                  });
                }}
              />
              <div class={'suffix group-focus-within:suffix-focus-within'}>
                ms
              </div>
            </label>
          </div>,
        ]}
      >
        <div class={'w-[calc(100%-24px)] flex flex-col justify-center items-start'}>
          <Show when={lyricData()}>
            <Marquee class={'w-full'} gap={32}>
              <div class={'text-xs text-black/50 dark:text-white/50'}>
                <Trans key={'lyrics.lyric-id'}/>: {lyricData()?.id ?? 'N/A'}
                {' · '}
                <Trans key={'lyrics.lyric-author'}/>: {lyricData()?.register?.name ?? 'N/A'}
                {' · '}
                <Switch fallback={t('lyrics.auto-recognized')}>
                  <Match when={isMapped()}>
                    <Trans key={'lyrics.manually-specified'}/>
                  </Match>
                </Switch>
              </div>
            </Marquee>
          </Show>
          <Marquee class={'w-full'} gap={32}>
            {lyricData()?.title ?? 'N/A'}
          </Marquee>
          <div class={'text-sm'}>
            {lyricData()?.artist ?? 'N/A'}
          </div>
        </div>
      </Card>
      <div
        class={'fluent-scrollbar flex-1 block text-center overflow-scroll overflow-x-visible overflow-y-auto will-change-scroll'}>
        <For each={lyricItems()}>
          {({ first: time, second: lyrics }) => (
            <div
              id={`lyric-${time}`}
              class={'my-4 whitespace-pre-line'}
              classList={{
                'text-primary-500': lyricTime() === time,
              }}
            >
              {lyrics.join('\n')}
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default SideBar;
