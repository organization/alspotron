import { Show, createMemo, For, createEffect, Match, Switch } from 'solid-js';

import { Trans, useTransContext } from '@jellybrick/solid-i18next';

import Card from '../components/Card';
import Marquee from '../components/Marquee';
import { usePlayingInfo } from '../components/PlayingInfoProvider';
import useLyric from '../hooks/useLyric';
import useLyricMapper from '../hooks/useLyricMapper';
import LyricProgressBar from '../main/components/LyricProgressBar';

const SideBar = () => {
  const { coverUrl, title, lyrics, originalLyric } = usePlayingInfo();
  const [, lyricTime] = useLyric();
  const [, setLyricMapper] = useLyricMapper();
  const [t] = useTransContext();

  const alsongLyric = () => {
    const lyricInfo = originalLyric();
    return lyricInfo?.kind === 'alsong' ? lyricInfo.data : null;
  };

  const lyricItems = createMemo(() => lyrics()?.toJSON() ?? []);

  createEffect(() => {
    const time = lyricTime();

    document.querySelector(`#lyric-${time ?? '0'}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });

  const onResetLyric = () => {
    const newMapper = {
      [`${title()}:${coverUrl()}`]: undefined,
    };

    setLyricMapper(newMapper);
  };

  const isMappedLyric = () => originalLyric()?.useMapper ?? false;

  return (
    <div
      class={`
        w-[312px] h-full p-4
        flex flex-col justify-start items-stretch gap-2
        text-white
      `}
    >
      <div class={'text-xl'}>
        <Trans key={'lyrics.current-playing-track'} />
      </div>
      <LyricProgressBar class={'!w-[280px]'} />
      <div class={'text-xl mt-4'}>
        <Trans key={'lyrics.current-applied-lyric'} />
      </div>
      <Card
        class={'w-full flex flex-row justify-start items-center gap-1'}
        subCards={[
          <div class={'w-full h-full flex items-center'}>
            <button class={isMappedLyric() ? 'btn-primary' : 'btn-primary-disabled disabled'} onClick={onResetLyric} disabled={!isMappedLyric()}>
              <Switch fallback={t('lyrics.auto-recognizing')}>
                <Match when={isMappedLyric()}>
                  <Trans key={'lyrics.change-to-auto-recognize-mode'} />
                </Match>
              </Switch>
            </button>
          </div>,
        ]}
      >
        <div class={'w-[calc(100%-24px)] flex flex-col justify-center items-start'}>
          <Show when={originalLyric()}>
            <Marquee class={'w-full'} gap={32}>
              <div class={'text-xs text-white/50'}>
                <Trans key={'lyrics.lyric-id'} />: {alsongLyric()?.lyricId ?? 'N/A'}
              {' · '}
                <Trans key={'lyrics.lyric-author'} />: {alsongLyric()?.register?.name ?? 'N/A'}
              {' · '}
                <Switch fallback={t('lyrics.auto-recognized')}>
                  <Match when={isMappedLyric()}>
                    <Trans key={'lyrics.manually-specified'} />
                  </Match>
                </Switch>
              </div>
            </Marquee>
          </Show>
          <Marquee class={'w-full'} gap={32}>
            {alsongLyric()?.title ?? 'N/A'}
          </Marquee>
          <div class={'text-sm'}>
            {alsongLyric()?.artist ?? 'N/A'}
          </div>
        </div>
      </Card>
      <div class={'fluent-scrollbar flex-1 block text-center overflow-scroll overflow-x-visible overflow-y-auto will-change-scroll'}>
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
  )
};

export default SideBar;
