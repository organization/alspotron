import { Trans, useTransContext } from '@jellybrick/solid-i18next';

import { createSignal } from 'solid-js';

import Card from '../../components/Card';
import Selector from '../../components/Select';

import useConfig from '../../hooks/useConfig';
import { getTranslation } from '../../../common/intl';
import Modal from '../../components/Modal';

const LanguageContainer = () => {
  const [t, { changeLanguage }] = useTransContext();
  const [config, setConfig] = useConfig();

  const [open, setOpen] = createSignal(false);
  
  return (
    <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 py-4 fluent-scrollbar'}>
      <div class={'text-3xl mb-1 px-4'}>
        <Trans key={'setting.title.language'} />
      </div>
      <div class={'text-md mt-4 mb-1 px-4'}>
        <Trans key={'setting.language.select-language-menu'} />
      </div>
      <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
        <Card class={'flex flex-row justify-between items-center gap-1'}>
          <div class={'text-md'}>
            <Trans key={'setting.language.select-language'} />
          </div>
          <Selector
          mode='select'
            placeholder={t('setting.language.placeholder')}
            class={'select min-w-[210px]'}
            options={['ko', 'en', 'ja', 'de']}
            value={config()?.language ?? 'ko'}
            onChange={(value) => {
              setConfig({ language: value as 'ko' | 'en' | 'ja' | 'de' });
              changeLanguage(value);
              setOpen(true);
            }}
            format={(str) => getTranslation('language.name', str)}
          />
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
          {t('setting.language.alert')}
        </div>
      </Modal>
    </div>
  )
};

export default LanguageContainer;