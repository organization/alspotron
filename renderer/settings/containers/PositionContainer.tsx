import { Trans, useTransContext } from '@jellybrick/solid-i18next';

import { Show } from 'solid-js';

import icon from '../../../assets/icon_music.png';
import Card from '../../components/Card';
import Selector from '../../components/Select';

import useConfig from '../../hooks/useConfig';

import { cx } from '../../utils/classNames';

import type { screen as electronScreen } from 'electron';

type ElectronScreenDisplay = ReturnType<typeof electronScreen.getPrimaryDisplay>;

const getAllDisplays = () => window.ipcRenderer.sendSync('get-all-screens') as ElectronScreenDisplay[];
const getPrimaryDisplay = () => window.ipcRenderer.sendSync('get-primary-screen') as ElectronScreenDisplay;

const PositionContainer = () => {
  const [config, setConfig] = useConfig();
  const [t] = useTransContext();

  const displays = getAllDisplays();
  const getCurrentDisplay = () => (displays.find((it) => it.id === config()?.windowPosition.display) ?? getPrimaryDisplay());

  return (
    <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 p-4 fluent-scrollbar'}>
      <div class={'text-3xl mb-1'}>
        <Trans key={'setting.title.position'} />
      </div>
      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.position.select-position-to-display-lyrics'} />
      </div>
      <Card
        class={`
          w-full min-h-[unset] aspect-video
          grid grid-rows-3 grid-cols-3 gap-4
        `}
      >
        <Card
          class={'flex justify-start items-start'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'top-left',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'top-left' } })}
        >
          <Trans key={'setting.position.left-top'} />
        </Card>
        <Card
          class={'flex justify-center items-start'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'top',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'top' } })}
        >
          <Trans key={'setting.position.center-top'} />
        </Card>
        <Card
          class={'flex justify-end items-start'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'top-right',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'top-right' } })}
        >
          <Trans key={'setting.position.right-top'} />
        </Card>
        <Card
          class={'flex justify-start items-center'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'left',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'left' } })}
        >
          <Trans key='setting.position.left-center' />
        </Card>
        <Card
          class={'flex justify-center items-center'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'center',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'center' } })}
        >
          <Trans key={'setting.position.center-center'} />
        </Card>
        <Card
          class={'flex justify-end items-center'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'right',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'right' } })}
        >
          <Trans key={'setting.position.right-center'} />
        </Card>
        <Card
          class={'flex justify-start items-end'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'bottom-left',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'bottom-left' } })}
        >
          <Trans key={'setting.position.left-bottom'} />
        </Card>
        <Card
          class={'flex justify-center items-end'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'bottom',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'bottom' } })}
        >
          <Trans key={'setting.position.center-bottom'} />
        </Card>
        <Card
          class={'flex justify-end items-end'}
          classList={{
            '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40': config()?.windowPosition.anchor === 'bottom-right',
          }}
          onClick={() => setConfig({ windowPosition: { anchor: 'bottom-right' } })}
        >
          <Trans key={'setting.position.right-bottom'} />
        </Card>
      </Card>
      <Card class={'flex flex-row justify-start items-center gap-1'}>
        <div class={'font-md'}>
          <Trans key={'setting.position.select-monitor-to-display-lyrics'} />
        </div>
        <div class={'flex-1'} />
        <Selector
          value={
            !config()?.windowPosition.display ?
              t('setting.position.use-primary-monitor') :
              displays.find((display) => display.id === config()?.windowPosition.display) ?
                t(
                  'setting.position.monitor-name-with-index',
                  {
                    index: (displays.findIndex((display) => display.id === getCurrentDisplay().id) + 1),
                    name: getCurrentDisplay().label,
                  },
                ) :
                t(
                  'setting.position.unknown-monitor',
                  {
                    id: config()?.windowPosition.display,
                  },
                )
          }
          onChange={(value, index) => {
            if (index === 0) {
              setConfig({ windowPosition: { display: null } });
            } else {
              setConfig({ windowPosition: { display: displays[index - 1].id } });
            }
          }}
          options={[t('setting.position.use-primary-monitor')].concat(
            displays.map((display, index) => `${index + 1} - ${display.label}`)
          )}
          class={'select'}
        />
      </Card>
      <Card class={'flex flex-row justify-start items-center gap-1'}>
        <div class={'font-md'}>
          <Trans key={'setting.position.select-orientation-to-display-lyrics'} />
        </div>
        <div class={'flex-1'} />
        <Selector
          format={(value) => value === 'column' ? t('setting.position.from-top-to-bottom') : t('setting.position.from-bottom-to-top')}
          value={config()?.windowPosition?.direction ?? 'column'}
          onChange={(value) => setConfig({ windowPosition: { direction: value } })}
          options={['column', 'column-reverse']}
          class={'select'}
        />
      </Card>
      <div class={'text-md mt-8 mb-1'}>
        <Trans key={'setting.position.adjust-margin'} />
      </div>
      <Card
        class={`
          w-full min-h-[unset] aspect-video
          grid grid-rows-3 grid-cols-3 gap-4
          p-4 rounded
        `}
      >
        <div />
        <input
          type={'number'}
          class={'input'}
          placeholder={t('setting.position.top-margin')}
          value={config()?.windowPosition.top ?? undefined}
          onChange={(event) => setConfig({ windowPosition: { top: Number(event.target.value) } })}
        />
        <div />
        <input
          type={'number'}
          class={'input'}
          placeholder={t('setting.position.left-margin')}
          value={config()?.windowPosition.left ?? undefined}
          onChange={(event) => setConfig({ windowPosition: { left: Number(event.target.value) } })}
        />
        <img src={icon} class={'w-12 h-12 object-contain self-center justify-self-center'} alt={'Icon'}/>
        <input
          type={'number'}
          class={'input'}
          placeholder={t('setting.position.right-margin')}
          value={config()?.windowPosition.right ?? undefined}
          onChange={(event) => setConfig({ windowPosition: { right: Number(event.target.value) } })}
        />
        <div />
        <input
          type={'number'}
          class={'input'}
          placeholder={t('setting.position.bottom-margin')}
          value={config()?.windowPosition.bottom ?? undefined}
          onChange={(event) => setConfig({ windowPosition: { bottom: Number(event.target.value) } })}
        />
      </Card>
    </div>
  )
};

export default PositionContainer;
