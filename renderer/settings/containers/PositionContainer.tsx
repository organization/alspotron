import icon from '../../../assets/icon_music.png';
import Card from '../../components/Card';
import Selector from '../../components/Select';

import useConfig from '../../hooks/useConfig';

import type { screen as electronScreen } from 'electron';

type ElectronScreenDisplay = ReturnType<typeof electronScreen.getPrimaryDisplay>;

const getAllDisplays = () => window.ipcRenderer.sendSync('get-all-screens') as ElectronScreenDisplay[];
const getPrimaryDisplay = () => window.ipcRenderer.sendSync('get-primary-screen') as ElectronScreenDisplay;

const PositionContainer = () => {
  const [config, setConfig] = useConfig();

  const displays = getAllDisplays();
  const getCurrentDisplay = () => (displays.find((it) => it.id === config()?.windowPosition.display) ?? getPrimaryDisplay());

  return (
    <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 p-4 fluent-scrollbar'}>
      <div class={'text-3xl mb-1'}>
        위치
      </div>
      <div class={'text-md mt-4 mb-1'}>
        가사 표시 위치
      </div>
      <div
        class={`
          w-full aspect-video
          grid grid-rows-3 grid-cols-3 gap-4
          p-4 bg-white/5 rounded
        `}
      >
        <Card
          class={'flex justify-start items-start'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'top-left',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'top-left' } })}
        >
          왼쪽 위
        </Card>
        <Card
          class={'flex justify-center items-start'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'top',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'top' } })}
        >
          위
        </Card>
        <Card
          class={'flex justify-end items-start'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'top-right',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'top-right' } })}
        >
          오른쪽 위
        </Card>
        <Card
          class={'flex justify-start items-center'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'left',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'left' } })}
        >
          왼쪽
        </Card>
        <Card
          class={'flex justify-center items-center'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'center',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'center' } })}
        >
          중앙
        </Card>
        <Card
          class={'flex justify-end items-center'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'right',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'right' } })}
        >
          오른쪽
        </Card>
        <Card
          class={'flex justify-start items-end'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'bottom-left',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'bottom-left' } })}
        >
          왼쪽 아래
        </Card>
        <Card
          class={'flex justify-center items-end'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'bottom',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'bottom' } })}
        >
          아래
        </Card>
        <Card
          class={'flex justify-end items-end'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'bottom-right',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'bottom-right' } })}
        >
          오른쪽 아래
        </Card>
      </div>
      <Card class={'flex flex-row justify-start items-center gap-1'}>
        <div class={'font-md'}>
          가사를 표시할 모니터
        </div>
        <div class={'flex-1'} />
        <Selector
          value={
            !config()?.windowPosition.display || !displays.find((display) => display.id === config()?.windowPosition.display) ?
                '기본 모니터 사용' :
                `${displays.findIndex((display) => display.id === getCurrentDisplay().id) + 1} - ${getCurrentDisplay().label}`
        }
          onChange={(value, index) => {
            if (value === '기본 모니터 사용') {
              setConfig({ windowPosition: { display: null } });
            } else {
              setConfig({ windowPosition: { display: displays[index - 1].id } });
            }
          }}
          options={['기본 모니터 사용'].concat(displays.map((display, index) => `${index + 1} - ${display.label}`))}
          class={'select'}
          popupClass={'p-1 bg-gray-800 rounded'}
          renderItem={(props, option) => <li
            {...props}
            class={'w-full p-2 hover:bg-white/10 rounded-lg truncate'}
          >
            {option}
          </li>}
        />
      </Card>
      <Card class={'flex flex-row justify-start items-center gap-1'}>
        <div class={'font-md'}>
          가사 표시 방향
        </div>
        <div class={'flex-1'} />
        <Selector
          format={(value) => value === 'column' ? '위에서 아래로' : '아래에서 위로'}
          value={config()?.windowPosition?.direction ?? 'column'}
          onChange={(value) => setConfig({ windowPosition: { direction: value as 'column' | 'column-reverse' } })}
          options={['column', 'column-reverse']}
          class={'select'}
          popupClass={'p-1 bg-gray-800 rounded'}
          renderItem={(props, option) => <li
            {...props}
            class={'w-full p-2 hover:bg-white/10 rounded-lg truncate'}
          >
            {option === 'column' ? '위에서 아래로' : '아래에서 위로'}
          </li>}
        />
      </Card>
      <Card class={'flex flex-row justify-start items-center gap-1'}>
        <div class={'font-md'}>
          현재 노래 표시하기
        </div>
        <div class={'flex-1'} />
        <Selector
          format={(value) => value === 'true' ? '표시' : '표시안함'}
          value={config()?.style?.nowPlaying?.visible?.toString() ?? 'true'}
          onChange={(value) => setConfig({ style: { nowPlaying: { visible: value === 'true' } } })}
          options={['true', 'false']}
          class={'select'}
          renderItem={(props, option) => <li
            {...props}
            class={'w-full p-2 hover:bg-white/10 rounded-lg truncate'}
          >
            {option === 'true' ? '표시' : '표시안함'}
          </li>}
        />
      </Card>

      <div class={'text-md mt-8 mb-1'}>
        여백 조절
      </div>
      <div
        class={`
          w-full aspect-video
          grid grid-rows-3 grid-cols-3 gap-4
          p-4 bg-white/5 rounded
        `}
      >
        <div />
        <input
          type={'number'}
          class={'input'}
          placeholder={'위쪽 여백'}
          value={config()?.windowPosition.top ?? undefined}
          onChange={(event) => setConfig({ windowPosition: { top: Number(event.target.value) } })}
        />
        <div />
        <input
          type={'number'}
          class={'input'}
          placeholder={'왼쪽 여백'}
          value={config()?.windowPosition.left ?? undefined}
          onChange={(event) => setConfig({ windowPosition: { left: Number(event.target.value) } })}
        />
        <img src={icon} class={'w-12 h-12 object-contain self-center justify-self-center'} alt={'아이콘'}/>
        <input
          type={'number'}
          class={'input'}
          placeholder={'오른쪽 여백'}
          value={config()?.windowPosition.right ?? undefined}
          onChange={(event) => setConfig({ windowPosition: { right: Number(event.target.value) } })}
        />
        <div />
        <input
          type={'number'}
          class={'input'}
          placeholder={'아래쪽 여백'}
          value={config()?.windowPosition.bottom ?? undefined}
          onChange={(event) => setConfig({ windowPosition: { bottom: Number(event.target.value) } })}
        />
      </div>
    </div>
  )
};

export default PositionContainer;
