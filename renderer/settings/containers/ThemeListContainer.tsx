import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { For, Show, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';

import Card from '../../components/Card';
import Modal from '../../components/Modal';
import useConfig from '../../hooks/useConfig';
import { DEFAULT_STYLE } from '../../../common/constants';
import useThemeList from '../../hooks/useThemeList';

const ThemeListContainer = () => {
  const [config, setConfig] = useConfig();
  const navigate = useNavigate();
  const [t] = useTransContext();
  const [themeList, setTheme] = useThemeList();

  const [nameConflictOpen, setNameConflictOpen] = createSignal(false);
  const [deleteOpen, setDeleteOpen] = createSignal(false);
  const [nameOpen, setNameOpen] = createSignal(false);
  const [target, setTarget] = createSignal<string | null>(null);
  const [name, setName] = createSignal('');
  
  const onSelectTheme = (name: string) => {
    setConfig({
      selectedTheme: name,
    });
  };
  const onThemeSetting = (name: string) => {
    navigate(`/theme/${name}`);
  };
  const onRename = (name: string) => {
    setTarget(name);
    setName(name);
    setNameOpen(true);
  };
  const onDelete = (name: string) => {
    setTarget(name);
    setDeleteOpen(true);
  };
  const onAdd = () => {
    const newName = t('setting.theme.new-theme');
    let suffix = 1;

    while (themeList()[`${newName} ${suffix}`]) {
      suffix += 1;
    }

    setTheme(`${newName} ${suffix}`, DEFAULT_STYLE);
  };

  const onRenameConfirm = () => {
    const newName = name();
    const oldName = target();
    
    if (typeof oldName !== 'string') return;
    const original = themeList()[oldName];

    if (themeList()[newName]) {
      setNameOpen(false);
      setNameConflictOpen(true);
      return;
    }

    const isSelected = config()?.selectedTheme === oldName;
    setTheme(newName, original);
    setTheme(oldName, null);
    setConfig({
      selectedTheme: isSelected ? newName : config()?.selectedTheme,
    });
    setNameOpen(false);
  };
  const onDeleteConfirm = () => {
    const name = target();
    if (typeof name !== 'string') return;

    const isSelected = config()?.selectedTheme === name;
    setTheme(name, null);
    setConfig({
      selectedTheme: isSelected ? Object.keys(themeList())[0] : config()?.selectedTheme,
    });
    setDeleteOpen(false);
  };

  return (
    <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 p-4 fluent-scrollbar'}>
      <div class={'text-3xl mb-1'}>
        <Trans key={'setting.title.theme'} />
      </div>
      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.theme.available-themes'} />
      </div>
      <For each={Object.keys(themeList())}>
        {(name) => (
          <Card
            class={'flex flex-row justify-start items-center gap-4'}
            subCards={[
              <div class={'w-full h-full flex justify-start items-center gap-3'}>
                <button
                  disabled={Object.keys(themeList()).length <= 1}
                  class={'btn-error flex justify-center items-center'}
                  onClick={() => onDelete(name)}
                >
                  <Trans key={'setting.theme.delete-theme'} />
                </button>
                <div class={'flex-1'} />
                <button
                  class={'btn-text flex justify-center items-center'}
                  onClick={() => onRename(name)}
                >
                  <Trans key={'setting.theme.rename-theme'} />
                </button>
                <button
                  class={'btn-primary flex justify-center items-center'}
                  onClick={() => onThemeSetting(name)}
                >
                  <Trans key={'setting.theme.edit-theme'} />
                  <svg class={'w-[18px] h-[18px] fill-none'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8.47 4.22a.75.75 0 0 0 0 1.06L15.19 12l-6.72 6.72a.75.75 0 1 0 1.06 1.06l7.25-7.25a.75.75 0 0 0 0-1.06L9.53 4.22a.75.75 0 0 0-1.06 0Z"
                      class={'fill-black dark:fill-white'}
                    />
                  </svg>
                </button>
              </div>,
            ]}
          >
            <Show
              when={config()?.selectedTheme === name}
              fallback={<div class={'w-6 h-6'} />}
            >
              <svg
                class={'w-6 h-6 fill-none'}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.53 12.97a.75.75 0 0 0-1.06 1.06l4.5 4.5a.75.75 0 0 0 1.06 0l11-11a.75.75 0 0 0-1.06-1.06L8.5 16.94l-3.97-3.97Z"
                  class={'fill-green-500'}
                />
              </svg>
            </Show>
            <div class={'text-md'}>
              {name}
            </div>
            <div class={'flex-1'} />
            <button
              class={config()?.selectedTheme === name ? 'btn-primary-disabled' : 'btn-primary'}
              onClick={() => onSelectTheme(name)}
            >
              <Trans key={'setting.theme.apply-theme'} />
            </button>
          </Card>
        )}
      </For>
      <button
        class={'btn-primary'}
        onClick={onAdd}
      >
        <Trans key={'setting.theme.add-theme'} />
      </button>
      <Modal
        open={nameOpen()}
        onClose={() => setNameOpen(false)}
        buttons={[
          {
            name: t('common.close'),
            onClick: () => setNameOpen(false),
          },
          {
            type: 'positive',
            name: t('common.okay'),
            onClick: onRenameConfirm,
          },
        ]}
      >
        <div class={'text-xl mb-2'}>
          {t('setting.theme.rename-alert-title')}
        </div>
        <div class={'text-md mb-1'}>
          {t('setting.theme.rename-alert', { name: target() })}
        </div>
        <input class={'input w-full'} value={name()} onChange={(event) => setName(event.target.value)} />
      </Modal>
      <Modal
        open={deleteOpen()}
        onClose={() => setDeleteOpen(false)}
        buttons={[
          {
            type: 'negative',
            name: t('common.delete'),
            onClick: onDeleteConfirm,
          },
        ]}
      >
        <div class={'text-xl'}>
          {t('common.delete.confirm', { name: target() })}
        </div>
      </Modal>
      <Modal
        open={nameConflictOpen()}
        onClose={() => setNameConflictOpen(false)}
        buttons={[
          {
            name: t('common.okay'),
            onClick: () => {
              setNameConflictOpen(false);
              if (target()) onRename(target()!);
            },
          },
        ]}
      >
        <div class={'text-xl mb-2'}>
          {t('setting.theme.rename-conflict-title')}
        </div>
        <div class={'text-md mb-1'}>
          {t('setting.theme.rename-conflict', { name: name() })}
        </div>
      </Modal>
    </div>
  )
};

export default ThemeListContainer;
