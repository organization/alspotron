import { Trans, useTransContext } from '@jellybrick/solid-i18next';

import icon from '../../../assets/icon_music.png';
import Card from '../../components/Card';
import Selector from '../../components/Select';

import useConfig from '../../hooks/useConfig';

import { cx } from '../../utils/classNames';

import type { screen as electronScreen } from 'electron';
import useStyle from '../../hooks/useStyle';

type ElectronScreenDisplay = ReturnType<typeof electronScreen.getPrimaryDisplay>;

const getAllDisplays = () => window.ipcRenderer.sendSync('get-all-screens') as ElectronScreenDisplay[];
const getPrimaryDisplay = () => window.ipcRenderer.sendSync('get-primary-screen') as ElectronScreenDisplay;

const PositionContainer = () => {
  const [config, setConfig] = useConfig();
  const style = useStyle();
  const [t] = useTransContext();

  const displays = getAllDisplays();
  const getCurrentDisplay = () => (displays.find((it) => it.id === config()?.windowPosition.display) ?? getPrimaryDisplay());

  return (
    <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 p-4 fluent-scrollbar'}>
      <div class={'text-3xl mb-1'}>
        <Trans key={'setting.title.position'}/>
      </div>
      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.position.select-position-to-display-lyrics'}/>
      </div>
      <Card
        class={`
          w-full min-h-[unset] aspect-video
          grid grid-rows-3 grid-cols-3 gap-4
        `}
      >
        <Card
          class={cx(
            !style().position.availableAnchor.includes('top-left') && '!opacity-30 !bg-gray-100/60 dark:!bg-white/5',
            'flex justify-start items-start',
            config()?.windowPosition.anchor === 'top-left' && '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40',
          )}
          onClick={() => style().position.availableAnchor.includes('top-left') && setConfig({ windowPosition: { anchor: 'top-left' } })}
        >
          <Trans key={'setting.position.top-left'}/>
        </Card>
        <Card
          class={cx(
            !style().position.availableAnchor.includes('top') && '!opacity-30 !bg-gray-100/60 dark:!bg-white/5',
            'flex justify-center items-start',
            config()?.windowPosition.anchor === 'top' && '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40',
          )}
          onClick={() => style().position.availableAnchor.includes('top') && setConfig({ windowPosition: { anchor: 'top' } })}
        >
          <Trans key={'setting.position.top'}/>
        </Card>
        <Card
          class={cx(
            !style().position.availableAnchor.includes('top-right') && '!opacity-30 !bg-gray-100/60 dark:!bg-white/5',
            'flex justify-end items-start',
            config()?.windowPosition.anchor === 'top-right' && '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40',
          )}
          onClick={() => style().position.availableAnchor.includes('top-right') && setConfig({ windowPosition: { anchor: 'top-right' } })}
        >
          <Trans key={'setting.position.top-right'}/>
        </Card>
        <Card
          class={cx(
            !style().position.availableAnchor.includes('left') && '!opacity-30 !bg-gray-100/60 dark:!bg-white/5',
            'flex justify-start items-center',
            config()?.windowPosition.anchor === 'left' && '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40',
          )}
          onClick={() => style().position.availableAnchor.includes('left') && setConfig({ windowPosition: { anchor: 'left' } })}
        >
          <Trans key="setting.position.left"/>
        </Card>
        <Card
          class={cx(
            !style().position.availableAnchor.includes('center') && '!opacity-30 !bg-gray-100/60 dark:!bg-white/5',
            'flex justify-center items-center',
            config()?.windowPosition.anchor === 'center' && '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40',
          )}
          onClick={() => style().position.availableAnchor.includes('center') && setConfig({ windowPosition: { anchor: 'center' } })}
        >
          <Trans key={'setting.position.center'}/>
        </Card>
        <Card
          class={cx(
            !style().position.availableAnchor.includes('right') && '!opacity-30 !bg-gray-100/60 dark:!bg-white/5',
            'flex justify-end items-center',
            config()?.windowPosition.anchor === 'right' && '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40',
          )}
          onClick={() => style().position.availableAnchor.includes('right') && setConfig({ windowPosition: { anchor: 'right' } })}
        >
          <Trans key={'setting.position.right'}/>
        </Card>
        <Card
          class={cx(
            !style().position.availableAnchor.includes('bottom-left') && '!opacity-30 !bg-gray-100/60 dark:!bg-white/5',
            'flex justify-start items-end',
            config()?.windowPosition.anchor === 'bottom-left' && '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40',
          )}
          onClick={() => style().position.availableAnchor.includes('bottom-left') && setConfig({ windowPosition: { anchor: 'bottom-left' } })}
        >
          <Trans key={'setting.position.bottom-left'}/>
        </Card>
        <Card
          class={cx(
            !style().position.availableAnchor.includes('bottom') && '!opacity-30 !bg-gray-100/60 dark:!bg-white/5',
            'flex justify-center items-end',
            config()?.windowPosition.anchor === 'bottom' && '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40',
          )}
          onClick={() => style().position.availableAnchor.includes('bottom') && setConfig({ windowPosition: { anchor: 'bottom' } })}
        >
          <Trans key={'setting.position.bottom'}/>
        </Card>
        <Card
          class={cx(
            !style().position.availableAnchor.includes('bottom-right') && '!opacity-30 !bg-gray-100/60 dark:!bg-white/5',
            'flex justify-end items-end',
            config()?.windowPosition.anchor === 'bottom-right' && '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40',
          )}
          onClick={() => style().position.availableAnchor.includes('bottom-right') && setConfig({ windowPosition: { anchor: 'bottom-right' } })}
        >
          <Trans key={'setting.position.bottom-right'}/>
        </Card>
      </Card>
      <Card class={'flex flex-row justify-start items-center gap-1'}>
        <div class={'font-md'}>
          <Trans key={'setting.position.select-monitor-to-display-lyrics'}/>
        </div>
        <div class={'flex-1'}/>
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
      <div class={'text-md mt-8 mb-1'}>
        <Trans key={'setting.position.adjust-margin'}/>
      </div>
      <Card
        class={`
          w-full min-h-[unset] aspect-video
          grid grid-rows-3 grid-cols-3 gap-4
          p-4 rounded
        `}
      >
        <div/>
        <label class={'input-group group'}>
          <input
            type={'number'}
            class={'input w-full h-full'}
            placeholder={t('setting.position.top-margin')}
            value={config()?.windowPosition.top ?? undefined}
            onChange={(event) => setConfig({ windowPosition: { top: Number(event.target.value) } })}
          />
          <span class={'suffix group-focus-within:suffix-focus-within'}>
            px
          </span>
        </label>
        <div/>
        <label class={'input-group group'}>
          <input
            type={'number'}
            class={'input w-full h-full'}
            placeholder={t('setting.position.left-margin')}
            value={config()?.windowPosition.left ?? undefined}
            onChange={(event) => setConfig({ windowPosition: { left: Number(event.target.value) } })}
          />
          <span class={'suffix group-focus-within:suffix-focus-within'}>
            px
          </span>
        </label>
        <img src={icon} class={'w-12 h-12 object-contain self-center justify-self-center'} alt={'Icon'}/>
        <label class={'input-group group'}>
          <input
            type={'number'}
            class={'input w-full h-full'}
            placeholder={t('setting.position.right-margin')}
            value={config()?.windowPosition.right ?? undefined}
            onChange={(event) => setConfig({ windowPosition: { right: Number(event.target.value) } })}
          />
          <span class={'suffix group-focus-within:suffix-focus-within'}>
            px
          </span>
        </label>
        <div/>
        <label class={'input-group group'}>
          <input
            type={'number'}
            class={'input w-full h-full'}
            placeholder={t('setting.position.bottom-margin')}
            value={config()?.windowPosition.bottom ?? undefined}
            onChange={(event) => setConfig({ windowPosition: { bottom: Number(event.target.value) } })}
          />
          <span class={'suffix group-focus-within:suffix-focus-within'}>
            px
          </span>
        </label>
      </Card>
    </div>
  );
};

export default PositionContainer;
