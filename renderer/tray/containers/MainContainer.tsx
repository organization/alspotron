import { useNavigate } from '@solidjs/router';
import { Show } from 'solid-js';
import useConfig from '../../hooks/useConfig';

export const MainContainer = () => {
  const navigate = useNavigate();
  const [config] = useConfig();

  const onSetting = () => {
    window.ipcRenderer.invoke('open-window', 'settings');
  };
  const onSearch = () => {
    window.ipcRenderer.invoke('open-window', 'lyrics');
  };
  const onQuit = () => {
    window.ipcRenderer.invoke('quit-application');
  };
  const onDebug = () => {
    navigate('/debug');
  };

  return (
    <div class={'w-full h-full flex flex-col justify-start items-stretch gap-4'}>
      <input
        class={'input w-full'}
      />
      <div class={'w-full h-[1px] bg-white/20'}/>
      <button class={'btn-text w-full'}>
        Lyric Search
      </button>
      <button class={'btn-text w-full'}>
        Settings
      </button>
      <div class={'flex-1'}/>
      <div class={'w-full h-[1px] bg-white/20'}/>
      <div class={'flex justify-start items-center gap-2'}>
        <button class={'btn-text btn-icon'} onClick={onSetting}>
          <svg class={'w-[18px] h-[18px] fill-none'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.012 2.25c.734.008 1.465.093 2.182.253a.75.75 0 0 1 .582.649l.17 1.527a1.384 1.384 0 0 0 1.927 1.116l1.401-.615a.75.75 0 0 1 .85.174 9.792 9.792 0 0 1 2.204 3.792.75.75 0 0 1-.271.825l-1.242.916a1.381 1.381 0 0 0 0 2.226l1.243.915a.75.75 0 0 1 .272.826 9.797 9.797 0 0 1-2.204 3.792.75.75 0 0 1-.848.175l-1.407-.617a1.38 1.38 0 0 0-1.926 1.114l-.169 1.526a.75.75 0 0 1-.572.647 9.518 9.518 0 0 1-4.406 0 .75.75 0 0 1-.572-.647l-.168-1.524a1.382 1.382 0 0 0-1.926-1.11l-1.406.616a.75.75 0 0 1-.849-.175 9.798 9.798 0 0 1-2.204-3.796.75.75 0 0 1 .272-.826l1.243-.916a1.38 1.38 0 0 0 0-2.226l-1.243-.914a.75.75 0 0 1-.271-.826 9.793 9.793 0 0 1 2.204-3.792.75.75 0 0 1 .85-.174l1.4.615a1.387 1.387 0 0 0 1.93-1.118l.17-1.526a.75.75 0 0 1 .583-.65c.717-.159 1.45-.243 2.201-.252Zm0 1.5a9.135 9.135 0 0 0-1.354.117l-.109.977A2.886 2.886 0 0 1 6.525 7.17l-.898-.394a8.293 8.293 0 0 0-1.348 2.317l.798.587a2.881 2.881 0 0 1 0 4.643l-.799.588c.32.842.776 1.626 1.348 2.322l.905-.397a2.882 2.882 0 0 1 4.017 2.318l.11.984c.889.15 1.798.15 2.687 0l.11-.984a2.881 2.881 0 0 1 4.018-2.322l.905.396a8.296 8.296 0 0 0 1.347-2.318l-.798-.588a2.881 2.881 0 0 1 0-4.643l.796-.587a8.293 8.293 0 0 0-1.348-2.317l-.896.393a2.884 2.884 0 0 1-4.023-2.324l-.11-.976a8.988 8.988 0 0 0-1.333-.117ZM12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5Zm0 1.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
              class={'fill-black dark:fill-white'}
            />
          </svg>
        </button>
        <button class={'btn-text btn-icon'} onClick={onSearch}>
          <svg class={'w-[18px] h-[18px] fill-none'} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path
              d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
              class={'fill-black dark:fill-white'}
            />
          </svg>
        </button>
        <Show when={config()?.developer}>
          <div class={'w-[1px] h-full bg-white/20'}/>
          <button class={'btn-text btn-icon'} onClick={onDebug}>
            <svg class={'w-[18px] h-[18px] fill-none'} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path
                d="M480-200q66 0 113-47t47-113v-160q0-66-47-113t-113-47q-66 0-113 47t-47 113v160q0 66 47 113t113 47Zm-80-120h160v-80H400v80Zm0-160h160v-80H400v80Zm80 40Zm0 320q-65 0-120.5-32T272-240H160v-80h84q-3-20-3.5-40t-.5-40h-80v-80h80q0-20 .5-40t3.5-40h-84v-80h112q14-23 31.5-43t40.5-35l-64-66 56-56 86 86q28-9 57-9t57 9l88-86 56 56-66 66q23 15 41.5 34.5T688-640h112v80h-84q3 20 3.5 40t.5 40h80v80h-80q0 20-.5 40t-3.5 40h84v80H688q-32 56-87.5 88T480-120Z"
                class={'fill-black dark:fill-white'}
              />
            </svg>
          </button>
        </Show>
        <div class={'flex-1'}/>
        <button class={'btn-error w-fit btn-icon'} onClick={onQuit}>
          <svg class={'w-[18px] h-[18px] fill-none'} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path
              d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-84 31.5-156.5T197-763l56 56q-44 44-68.5 102T160-480q0 134 93 227t227 93q134 0 227-93t93-227q0-67-24.5-125T707-707l56-56q54 54 85.5 126.5T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-360v-440h80v440h-80Z"
              class={'fill-black dark:fill-white'}
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
