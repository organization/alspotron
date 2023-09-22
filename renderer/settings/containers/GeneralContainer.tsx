import { Trans, useTransContext } from '@jellybrick/solid-i18next';

import { createSignal } from 'solid-js';

import Card from '../../components/Card';
import Selector from '../../components/Select';

import useConfig from '../../hooks/useConfig';
import { getTranslation } from '../../../common/intl';
import Modal from '../../components/Modal';
import Switch from '../../components/Switch';

const LanguageContainer = () => {
  const [t, { changeLanguage }] = useTransContext();
  const [config, setConfig] = useConfig();

  const [open, setOpen] = createSignal(false);
  
  return (
    <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 py-4 fluent-scrollbar'}>
      <div class={'text-3xl mb-1 px-4'}>
        <Trans key={'setting.title.general'} />
      </div>
      <div class={'text-md mt-4 mb-1 px-4'}>
        <Trans key={'setting.general.select-language-menu'} />
      </div>
      <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
        <Card class={'flex flex-row justify-between items-center gap-1'}>
          <div class={'text-md'}>
            <Trans key={'setting.general.select-language'} />
          </div>
          <Selector
            mode={'select'}
            placeholder={t('setting.general.placeholder')}
            class={'select min-w-[210px]'}
            options={['ko', 'en', 'ja', 'de']}
            value={config()?.language ?? 'ko'}
            onChange={(value) => {
              setConfig({ language: value });
              changeLanguage(value);
              setOpen(true);
            }}
            format={(str) => getTranslation('language.name', str)}
          />
        </Card>
      </div>
      <div class={'text-md mt-4 mb-1 px-4'}>
        <Trans key={'setting.general.lyric-menu'} />
      </div>
      <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
        <Card class={'flex flex-row justify-between items-center gap-1'}>
          <div class={'text-md'}>
            <Trans key={'setting.general.next-lyric-count'} />
          </div>
          <input
            type={'number'}
            min={0}
            step={1}
            class={'input w-48'}
            value={config()?.lyric.nextLyric}
            onChange={(event) => setConfig({ lyric: { nextLyric: Math.round(event.target.valueAsNumber) } })}
          />
        </Card>
        <Card class={'flex flex-row justify-between items-center gap-1'}>
          <div class={'text-md'}>
            <Trans key={'setting.general.previous-lyric-count'} />
          </div>
          <input
            type={'number'}
            min={0}
            step={1}
            class={'input w-48'}
            value={config()?.lyric.previousLyric}
            onChange={(event) => setConfig({ lyric: { previousLyric: Math.round(event.target.valueAsNumber) } })}
          />
        </Card>
      </div>
      <div class={'text-md mt-4 mb-1 px-4'}>
        <Trans key={'setting.general.developer-menu'} />
      </div>
      <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
        <Card
          expand={config()?.developer}
          subCards={config()?.developer ? [
            <div
              class={'w-full h-full flex justify-start items-center'}
              onClick={() => window.ipcRenderer.invoke('open-devtool', 'main')}
            >
              <div class={'text-md'}>
                <Trans key={'tray.devtools.lyric-viewer.label'} />
              </div>
              <div class={'flex-1'} />
              <svg class={'w-[16px] h-[16px] fill-none'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z" class={'fill-black dark:fill-white'} />
              </svg>
            </div>,
            <div
              class={'w-full h-full flex justify-start items-center'}
              onClick={() => window.ipcRenderer.invoke('open-devtool', 'lyrics')}
            >
              <div class={'text-md'}>
                <Trans key={'tray.devtools.lyrics.label'} />
              </div>
              <div class={'flex-1'} />
              <svg class={'w-[16px] h-[16px] fill-none'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z" class={'fill-black dark:fill-white'} />
              </svg>
            </div>,
            <div
              class={'w-full h-full flex justify-start items-center'}
              onClick={() => window.ipcRenderer.invoke('open-devtool', 'settings')}
            >
              <div class={'text-md'}>
                <Trans key={'tray.devtools.setting.label'} />
              </div>
              <div class={'flex-1'} />
              <svg class={'w-[16px] h-[16px] fill-none'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z" class={'fill-black dark:fill-white'} />
              </svg>
            </div>
          ] : undefined}
          class={'flex flex-row justify-between items-center gap-1'}
        >
          <div class={'text-md'}>
            <Trans key={'setting.general.developer'} />
          </div>
          <div class={'flex-1'} />
          <Switch value={config()?.developer} onChange={(checked) => setConfig({ developer: checked })} />
        </Card>
      </div>
      <Modal
        open={open()}
        onClose={() => setOpen(false)}
        buttons={[
          {
            type: 'positive',
            name: t('common.okay'),
            onClick: () => setOpen(false),
          },
        ]}
      >
        <div class={'text-white text-lg'}>
          {t('setting.general.language.alert')}
        </div>
      </Modal>
    </div>
  )
};

export default LanguageContainer;