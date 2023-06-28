import { createSignal } from 'solid-js';

import LyricProgressBar from '../main/components/LyricProgressBar';

import { UpdateData } from '../types';
import Card from '../components/Card';

const SideBar = () => {
  const [progress, setProgress] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [title, setTitle] = createSignal('Not Playing');
  const [artist, setArtist] = createSignal('N/A');
  const [status, setStatus] = createSignal('idle');
  const [coverUrl, setCoverUrl] = createSignal<string>();
  
  window.ipcRenderer.on('update', async (event, message) => {
    const data: UpdateData = message.data;

    setStatus(data.status);
    setTitle(data.title);
    setArtist(data.artists.join(', '));
    setProgress(data.progress);
    setDuration(data.duration);
    setCoverUrl(data.cover_url);
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
      <Card class={''}>
        아티스트 - 제목
        <div class={'flex-1'} />
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.293 4.293a1 1 0 0 0 0 1.414L14.586 12l-6.293 6.293a1 1 0 1 0 1.414 1.414l7-7a1 1 0 0 0 0-1.414l-7-7a1 1 0 0 0-1.414 0Z" fill="#ffffff"/>
        </svg>
      </Card>
    </div>
  )
};

export default SideBar;
