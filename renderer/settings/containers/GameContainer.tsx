import { For, Show, createSignal } from 'solid-js';

import { HMC } from 'hmc-win32';

import Card from '../../components/Card';
import Marquee from '../../components/Marquee';

interface ProcessData {
  name: string;
  pid: number;
  path: string;
  icon?: any;
}

const GameContainer = () => {
  const [processList, setProcessList] = createSignal<ProcessData[]>([]);

  const onProcess = async () => {
    const availableWindows = window.hmc.getAllWindowsHandle(true);
    const availableWindowsPID = availableWindows.map((it) => window.hmc.getHandleProcessID(it));

    const result: ProcessData[] = await Promise.all(
      window.hmc.getDetailsProcessList()
      .filter((process) => availableWindowsPID.includes(process.pid))
      .map(async (data) => {
        if (data.path.startsWith('C:\\Windows\\')) return null;
        const icon = await window.ipcRenderer.invoke('get-icon', data.path);

        return { ...data, icon };
      }),
    );

    setProcessList(result.filter((it) => !!it));
  };
  onProcess();

  return (
    <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 p-4 fluent-scrollbar'}>
      <div class={'text-3xl mb-1'}>
        게임
      </div>
      <div class={'text-md mt-4 mb-1'}>
        현재 실행중인 게임
      </div>
      <Card>
        대충 현재 인식된 게임
        이름?
      </Card>
      <div class={'text-md mt-4 mb-1'}>
        저장된 게임 목록
      </div>
      <Card class={'w-full flex justify-start items-center gap-4'}>
        <div class={'w-0 flex flex-col justify-center items-start flex-1'}>
          <div class={'w-full'}>
            저장된 게임들
          </div>
          <div class={'text-sm text-gray-400'}>
            130개
          </div>
        </div>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.47 4.22a.75.75 0 0 0 0 1.06L15.19 12l-6.72 6.72a.75.75 0 1 0 1.06 1.06l7.25-7.25a.75.75 0 0 0 0-1.06L9.53 4.22a.75.75 0 0 0-1.06 0Z" class={'fill-white'} />
        </svg>
      </Card>
      <div class={'text-md mt-4 mb-1'}>
        게임 찾기
      </div>
      <For each={processList()}>
        {(process) => (
          <Card class={'w-full flex justify-start items-center gap-4'}>
            <Show when={!!process.icon} fallback={<div class={'w-6 h-6 aspect-square'} />}>
              <img src={process.icon} class={'w-6 h-6 object-cover'} />
            </Show>
            <div class={'w-0 flex flex-col justify-center items-stretch flex-1'}>
              <div class={'w-full'}>
                {process.name}
              </div>
              <Marquee class={'text-sm text-gray-400'}>
                {process.path}
              </Marquee>
            </div>
            <button class={'btn-primary'}>
              게임 등록
            </button>
          </Card>
        )}
      </For>
      <button class={'btn-text flex justify-center items-center gap-1'}>
        <svg class={'w-4 h-4'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.22 8.47a.75.75 0 0 1 1.06 0L12 15.19l6.72-6.72a.75.75 0 1 1 1.06 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L4.22 9.53a.75.75 0 0 1 0-1.06Z" class={'fill-white'} />
        </svg>
        현재 실행중인 모든 프로그램 확인
      </button>
    </div>
  );
};

export default GameContainer;
