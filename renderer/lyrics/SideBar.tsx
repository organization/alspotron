import { Show, createMemo, For } from 'solid-js';

import Card from '../components/Card';
import Marquee from '../components/Marquee';
import LyricProgressBar from '../main/components/LyricProgressBar';
import { usePlayingInfo } from '../main/components/PlayingInfoProvider';

const SideBar = () => {
  const { lyrics, originalLyric } = usePlayingInfo();

  const alsongLyric = () => {
    const lyricInfo = originalLyric();
    return lyricInfo?.kind === 'alsong' ? lyricInfo.data : null;
  };

  const lyricItems = createMemo(() => {
    const items: string[] = [];
    lyrics()?.forEach(([_, lyric]) => items.push(lyric.join('\n')));
    return items;
  });


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
      <Card class={'w-full flex flex-row justify-start items-start gap-1'}>
        <div class={'w-full flex flex-col justify-center items-start'}>
          <Show when={originalLyric()}>
            <div class={'text-xs text-white/50'}>
              ID: {alsongLyric()?.lyricId}
             {' · '}
              작성자: {alsongLyric()?.register?.name ?? 'N/A'}
            </div>
          </Show>
          <Marquee class={'w-full'}>
            {alsongLyric()?.title ?? '자동'}
          </Marquee>
          <div class={'text-sm'}>
            {alsongLyric()?.artist ?? 'N/A'}
          </div>
        </div>
        <div class={'flex-1'} />
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class={'self-center'}>
          <path d="M8.293 4.293a1 1 0 0 0 0 1.414L14.586 12l-6.293 6.293a1 1 0 1 0 1.414 1.414l7-7a1 1 0 0 0 0-1.414l-7-7a1 1 0 0 0-1.414 0Z" fill="#ffffff"/>
        </svg>
      </Card>
      <div class={'fluent-scrollbar flex-1 block text-center overflow-scroll overflow-x-visible overflow-y-auto whitespace-pre-line py-2'}>
        <For each={lyricItems()}>{(value) => value + '\n\n'}</For>
      </div>
    </div>
  )
};

export default SideBar;
