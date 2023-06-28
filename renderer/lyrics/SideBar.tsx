import { Show, createEffect, createSignal, on } from 'solid-js';

import LyricProgressBar from '../main/components/LyricProgressBar';

import { UpdateData } from '../types';
import Card from '../components/Card';

import type alsong from 'alsong';
import useLyricMapper from '../hooks/useLyricMapper';
import Marquee from '../components/Marquee';

type Lyric = Awaited<ReturnType<typeof alsong.getLyricById>>;

const SideBar = () => {
  const [progress, setProgress] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [title, setTitle] = createSignal('Not Playing');
  const [artist, setArtist] = createSignal('N/A');
  const [status, setStatus] = createSignal('idle');
  const [coverUrl, setCoverUrl] = createSignal<string>();
  const [lyric, setLyric] = createSignal<Lyric | null>(null);

  const [originalData, setOriginalData] = createSignal<UpdateData | null>(null);

  const [lyricMapper] = useLyricMapper();
  
  window.ipcRenderer.on('update', async (_, message) => {
    const data: UpdateData = message.data;

    setOriginalData(data);

    setStatus(data.status);
    setTitle(data.title);
    setArtist(data.artists.join(', '));
    setProgress(data.progress);
    setDuration(data.duration);
    setCoverUrl(data.cover_url);
  });

  createEffect(on([title, coverUrl, lyricMapper], async () => {
    const data = originalData();
    const mapper = lyricMapper();
    if (!data) return;

    const id: number | undefined = mapper?.[`${data.title}:${data.cover_url}`];
    const lyric: Lyric = await window.ipcRenderer.invoke('get-lyric-by-id', id);

    if (lyric) setLyric(lyric);
    else setLyric(null);
  }));

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
      <LyricProgressBar
        coverUrl={coverUrl()}
        title={title()}
        artist={artist()}
        percent={progress() / duration()}
        status={status()}
        class={'!w-[280px]'}
      />
      <div class={'text-xl mt-4'}>
        현재 적용중인 가사
      </div>
      <Card class={'w-full flex flex-row justify-start items-start gap-1'}>
        <div class={'w-full flex flex-col justify-center items-start'}>
          <Show when={lyric()}>
            <div class={'text-xs text-white/50'}>
              ID: {lyric()?.lyricId}
             {' · '}
              작성자: {lyric()?.register.name ?? 'N/A'}
            </div>
          </Show>
          <Marquee class={'w-full'}>
            {lyric()?.title ?? '자동'}
          </Marquee>
          <div class={'text-sm'}>
            {lyric()?.artist ?? 'N/A'}
          </div>
        </div>
        <div class={'flex-1'} />
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class={'self-center'}>
          <path d="M8.293 4.293a1 1 0 0 0 0 1.414L14.586 12l-6.293 6.293a1 1 0 1 0 1.414 1.414l7-7a1 1 0 0 0 0-1.414l-7-7a1 1 0 0 0-1.414 0Z" fill="#ffffff"/>
        </svg>
      </Card>
    </div>
  )
};

export default SideBar;
