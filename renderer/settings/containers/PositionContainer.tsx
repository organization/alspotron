import icon from '../../../assets/icon_music.png';
import Card from '../../components/Card';

import useConfig from '../../hooks/useConfig';


const PositionContainer = () => {
  const [config, setConfig] = useConfig();

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
          onClick={() => void setConfig({ windowPosition: { anchor: 'top-left' }})}
        >
          왼쪽 위
        </Card>
        <Card
          class={'flex justify-center items-start'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'top',
          }}
          onClick={() => void setConfig({ windowPosition: { anchor: 'top' }})}
        >
          위
        </Card>
        <Card
          class={'flex justify-end items-start'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'top-right',
          }}
          onClick={() => void setConfig({ windowPosition: { anchor: 'top-right' }})}
        >
          오른쪽 위
        </Card>
        <Card
          class={'flex justify-start items-center'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'left',
          }}
          onClick={() => void setConfig({ windowPosition: { anchor: 'left' }})}
        >
          왼쪽
        </Card>
        <Card
          class={'flex justify-center items-center'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'center',
          }}
          onClick={() => void setConfig({ windowPosition: { anchor: 'center' }})}
        >
          중앙
        </Card>
        <Card
          class={'flex justify-end items-center'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'right',
          }}
          onClick={() => void setConfig({ windowPosition: { anchor: 'right' }})}
        >
          오른쪽
        </Card>
        <Card
          class={'flex justify-start items-end'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'bottom-left',
          }}
          onClick={() => void setConfig({ windowPosition: { anchor: 'bottom-left' }})}
        >
          왼쪽 아래
        </Card>
        <Card
          class={'flex justify-center items-end'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'bottom',
          }}
          onClick={() => void setConfig({ windowPosition: { anchor: 'bottom' }})}
        >
          아래
        </Card>
        <Card
          class={'flex justify-end items-end'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'bottom-right',
          }}
          onClick={() => void setConfig({ windowPosition: { anchor: 'bottom-right' }})}
        >
          오른쪽 아래
        </Card>
      </div>
      
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
          value={config()?.windowPosition.top}
          onChange={(event) => void setConfig({ windowPosition: { top: Number(event.target.value) }})}
        />
        <div />
        <input
          type={'number'}
          class={'input'}
          placeholder={'왼쪽 여백'}
          value={config()?.windowPosition.left}
          onChange={(event) => void setConfig({ windowPosition: { left: Number(event.target.value) }})}
        />
        <img src={icon} class={'w-12 h-12 object-contain self-center justify-self-center'} />
        <input
          type={'number'}
          class={'input'}
          placeholder={'오른쪽 여백'}
          value={config()?.windowPosition.right}
          onChange={(event) => void setConfig({ windowPosition: { right: Number(event.target.value) }})}
        />
        <div />
        <input
          type={'number'}
          class={'input'}
          placeholder={'아래쪽 여백'}
          value={config()?.windowPosition.bottom}
          onChange={(event) => void setConfig({ windowPosition: { bottom: Number(event.target.value) }})}
        />
      </div>
    </div>
  )
};

export default PositionContainer;
