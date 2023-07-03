import { Show, createMemo, For, createEffect } from 'solid-js';

import Card from '../components/Card';
import Marquee from '../components/Marquee';
import LyricProgressBar from '../main/components/LyricProgressBar';
import { usePlayingInfo } from '../components/PlayingInfoProvider';
import useLyric from '../hooks/useLyric';
import useLyricMapper from '../hooks/useLyricMapper';

const SideBar = () => {
  const { coverUrl, title, lyrics, originalLyric } = usePlayingInfo();
  const [_, lyricTime] = useLyric();
  const [__, setLyricMapper] = useLyricMapper();

  const alsongLyric = () => {
    const lyricInfo = originalLyric();
    return lyricInfo?.kind === 'alsong' ? lyricInfo.data : null;
  };

  const lyricItems = createMemo(() => {
    const items: [number, string[]][] = [];

    lyrics()?.forEach((item) => items.push(item));

    return items;
  });

  createEffect(() => {
    const time = lyricTime();

    document.querySelector(`#lyric-${time}`)?.scrollIntoView({
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

  return (
    <div
      class={`
        w-[312px] h-full p-4
        flex flex-col justify-start items-stretch gap-2
        text-white
      `}
    >
      <div class={'text-xl'}>
        현재 재생중인 음악
      </div>
      <LyricProgressBar class={'!w-[280px]'} />
      <div class={'text-xl mt-4'}>
        현재 적용중인 가사
      </div>
      <Card
        class={'w-full flex flex-row justify-start items-center gap-1'}
        subCards={[
          <div class={'w-full h-full flex items-center'}>
            <button class={'btn-primary'} onClick={onResetLyric}>
              자동 인식으로 변경
            </button>
          </div>,
        ]}
      >
        <div class={'w-[calc(100%-24px)] flex flex-col justify-center items-start'}>
          <Show when={originalLyric()}>
            <Marquee class={'w-full'} gap={32}>
              <div class={'text-xs text-white/50'}>
                ID: {alsongLyric()?.lyricId ?? 'N/A'}
              {' · '}
                작성자: {alsongLyric()?.register?.name ?? 'N/A'}
              </div>
            </Marquee>
          </Show>
          <Marquee class={'w-full'} gap={32}>
            {alsongLyric()?.title ?? '자동'}
          </Marquee>
          <div class={'text-sm'}>
            {alsongLyric()?.artist ?? 'N/A'}
          </div>
        </div>
      </Card>
      <div class={'fluent-scrollbar flex-1 block text-center overflow-scroll overflow-x-visible overflow-y-auto'}>
        <For each={lyricItems()}>
          {([time, value]) => (
            <div
              id={`lyric-${time}`}
              class={'my-4 whitespace-pre-line'}
              classList={{
                'text-primary-500': lyricTime() === time,
              }}
            >
              {value.join('\n')}
            </div>
          )}
        </For>
      </div>
    </div>
  )
};

export default SideBar;
