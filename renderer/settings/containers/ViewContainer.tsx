import { createSignal, For } from 'solid-js';
import { Trans, useTransContext } from '@jellybrick/solid-i18next';

import Card from '../../components/Card';
import Switch from '../../components/Switch';
import presetThemes from '../../../common/presets';
import { DEFAULT_CONFIG, PRESET_PREFIX } from '../../../common/constants';

import useConfig from '../../hooks/useConfig';
import { cx } from '../../utils/classNames';
import Selector from '../../components/Select';
import useThemeList from '../../hooks/useThemeList';

import icon from '../../../assets/icon_music.png';

import type { screen as electronScreen } from 'electron';
import Modal from '../../components/Modal';
import { t } from 'i18next';
import useGameList from '../../hooks/useGameList';

type ElectronScreenDisplay = ReturnType<typeof electronScreen.getPrimaryDisplay>;
const getAllDisplays = () => window.ipcRenderer.sendSync('get-all-screens') as ElectronScreenDisplay[];
const getPrimaryDisplay = () => window.ipcRenderer.sendSync('get-primary-screen') as ElectronScreenDisplay;

export const ViewContainer = () => {
  const [config, setConfig] = useConfig();
  const [themeList] = useThemeList();
  const [gameList, setGameList] = useGameList();
  const [t] = useTransContext();

  const [expand, setExpand] = createSignal(-1);
  const [target, setTarget] = createSignal<string | null>(null);
  const [name, setName] = createSignal('');
  const [nameConflictOpen, setNameConflictOpen] = createSignal(false);

  const views = () => config()?.views ?? [];

  const displays = () => getAllDisplays();
  const getCurrentDisplay = (display: number | null) => (displays().find((it) => it.id === display) ?? getPrimaryDisplay());

  const onAddView = () => {
    const newName = t('setting.view.new-view');
    let suffix = 1;

    while (views().some((view) => view.name === `${newName} ${suffix}`)) {
      suffix += 1;
    }

    setConfig({
      views: [
        ...views(),
        {
          ...DEFAULT_CONFIG.views[0],
          name: `${newName} ${suffix}`,
        },
      ],
    });
  };
  const onRenameView = () => {
    const targetName = target();
    const newName = name();

    if (!targetName || !newName) return;
    const newViews = [...views()];
    const targetIndex = newViews.findIndex((view) => view.name === targetName);
    const newNameConflict = newViews.some((view) => view.name === newName);

    if (targetIndex < 0) return;
    if (newNameConflict) {
      setNameConflictOpen(true);
      return;
    }
    newViews[targetIndex].name = newName;

    const newGameList = { ...gameList() };
    if (newGameList[targetName]) {
      newGameList[newName] = newGameList[targetName];
      delete newGameList[targetName];

      setGameList(newGameList, false);
    }

    setConfig({
      views: newViews,
    });
    setTarget(null);
  };

  return (
    <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 p-4 fluent-scrollbar'}>
      <div class={'text-3xl mb-1'}>
        <Trans key={'setting.title.view'}/>
      </div>
      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.view.list'}/>
      </div>
      <For each={views()}>
        {(view, index) => (
          <Card
            expand={expand() === index()}
            setExpand={(isExpand) => {
              if (isExpand) setExpand(index());
              else setExpand(-1);
            }}
            class={'flex flex-row justify-start items-center gap-4'}
            subCards={[
              <div class={'w-full h-full flex flex-row justify-start items-center gap-1'}>
                <div class={'font-md'}>
                  <Trans key={'setting.theme.theme'}/>
                </div>
                <div class={'flex-1'}/>
                <Selector
                  value={view.theme}
                  format={(theme) => {
                    if (theme.startsWith(PRESET_PREFIX)) {
                      return t(`setting.theme.preset.${theme.replace(PRESET_PREFIX, '')}`);
                    }

                    return theme;
                  }}
                  onChange={(newTheme) => {
                    const newViews = [...views()];
                    newViews[index()].theme = newTheme;

                    setConfig({
                      views: newViews,
                    });
                  }}
                  options={[
                    ...Object.keys(presetThemes).map((name) => `${PRESET_PREFIX}${name}`),
                    ...Object.keys(themeList()),
                  ]}
                  class={'select'}
                />
              </div>,
              <div
                class={`
                  w-full min-h-[unset] aspect-video
                  grid grid-rows-3 grid-cols-3 gap-4
              `}
              >
                <For each={[
                  'top-left' as const,
                  'top' as const,
                  'top-right' as const,
                  'left' as const,
                  'center' as const,
                  'right' as const,
                  'bottom-left' as const,
                  'bottom' as const,
                  'bottom-right' as const,
                ]}>
                  {(anchor) => {
                    let theme = themeList()[view.theme];
                    if (view.theme.startsWith(PRESET_PREFIX)) {
                      theme = presetThemes[view.theme.replace(PRESET_PREFIX, '')];
                    }

                    return (
                      <Card
                        class={cx(
                          'flex',
                          anchor.includes('top') && 'items-start',
                          !anchor.includes('top') && !anchor.includes('bottom') && 'items-center',
                          anchor.includes('bottom') && 'items-end',
                          anchor.includes('left') && 'justify-start',
                          !anchor.includes('left') && !anchor.includes('right') && 'justify-center',
                          anchor.includes('right') && 'justify-end',
                          !theme?.position.availableAnchor.includes(anchor) && '!opacity-30 !bg-gray-100/60 dark:!bg-white/5',
                          view.position.anchor === anchor && '!bg-primary-500/50 hover:!bg-primary-500/60 active:!bg-primary-500/40',
                        )}
                        onClick={() => {
                          const isEnable = theme?.position.availableAnchor.includes(anchor);
                          if (!isEnable) return;

                          const newViews = [...views()];
                          newViews[index()].position.anchor = anchor;

                          setConfig({
                            views: newViews,
                          });
                        }}
                      >
                        <Trans key={`setting.position.${anchor}`}/>
                      </Card>
                    );
                  }}
                </For>
              </div>,
              <div
                class={`
                  w-full min-h-[unset] aspect-video
                  grid grid-rows-3 grid-cols-3 gap-4
                `}
              >
                <div/>
                <label class={'input-group group'}>
                  <input
                    type={'number'}
                    class={'input w-full h-full'}
                    placeholder={t('setting.position.top-margin')}
                    value={view.position.top ?? undefined}
                    onChange={(event) => {
                      const newViews = [...views()];
                      newViews[index()].position.top = Number(event.target.value);

                      setConfig({
                        views: newViews,
                      });
                    }}
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
                    value={view.position.left ?? undefined}
                    onChange={(event) => {
                      const newViews = [...views()];
                      newViews[index()].position.left = Number(event.target.value);

                      setConfig({
                        views: newViews,
                      });
                    }}
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
                    value={view.position.right ?? undefined}
                    onChange={(event) => {
                      const newViews = [...views()];
                      newViews[index()].position.right = Number(event.target.value);

                      setConfig({
                        views: newViews,
                      });
                    }}
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
                    value={view.position.bottom ?? undefined}
                    onChange={(event) => {
                      const newViews = [...views()];
                      newViews[index()].position.bottom = Number(event.target.value);

                      setConfig({
                        views: newViews,
                      });
                    }}
                  />
                  <span class={'suffix group-focus-within:suffix-focus-within'}>
                    px
                  </span>
                </label>
              </div>,
              <div class={'w-full h-full flex flex-row justify-start items-center gap-1'}>
                <div class={'font-md'}>
                  <Trans key={'setting.position.select-monitor-to-display-lyrics'}/>
                </div>
                <div class={'flex-1'}/>
                <Selector
                  value={
                    !view.position.display ?
                      t('setting.position.use-primary-monitor') :
                      displays().find((display) => display.id === view.position.display) ?
                        t(
                          'setting.position.monitor-name-with-index',
                          {
                            index: (displays().findIndex((display) => display.id === getCurrentDisplay(view.position.display).id) + 1),
                            name: getCurrentDisplay(view.position.display).label,
                          },
                        ) :
                        t(
                          'setting.position.unknown-monitor',
                          {
                            id: view.position.display,
                          },
                        )
                  }
                  onChange={(value, displayIndex) => {
                    const display = displayIndex === 0 ? null : displays()[displayIndex - 1].id;
                    const newViews = [...views()];
                    newViews[index()].position.display = display;

                    setConfig({
                      views: newViews,
                    });
                  }}
                  options={[t('setting.position.use-primary-monitor'), ...displays().map((display, index) => `${index + 1} - ${display.label}`)]}
                  class={'select'}
                />
              </div>,
              <div class={'w-full h-full flex flex-row justify-between items-center'}>
                <button class={'btn-text'} onClick={() => setTarget(view.name)}>
                  <Trans key={'setting.view.rename-view'}/>
                </button>
                <button class={'btn-error'} onClick={() => {
                  const newViews = [...views()];
                  newViews.splice(index(), 1);

                  setConfig({
                    views: newViews,
                  });
                }}>
                  <Trans key={'common.delete'}/>
                </button>
              </div>
            ]}
          >
            <div class={'text-md'}>
              <div>
                {view.name}
              </div>
              <div class={'text-gray-400'}>
                <Trans key={'setting.view.applied-theme'}/>
                {': '}
                {view.theme.startsWith(PRESET_PREFIX) ? t(`setting.theme.preset.${view.theme.replace(PRESET_PREFIX, '')}`) : view.theme}
              </div>
            </div>
            <div class={'flex-1'}/>
            <Switch
              value={view.enabled}
              onChange={(checked) => {
                const newViews = [...views()];
                newViews[index()].enabled = checked;

                setConfig({
                  views: newViews,
                });
              }}
            />
          </Card>
        )}
      </For>

      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.view.edit-view'}/>
      </div>
      <Card class={'flex flex-row justify-start items-center gap-4'}>
        <Trans key={'setting.view.add-view'}/>
        <div class={'flex-1'}/>
        <button
          class={'btn-primary'}
          onClick={onAddView}
        >
          <Trans key={'setting.view.add-view'}/>
        </button>
      </Card>

      <Modal
        open={target() !== null}
        onClose={() => setTarget(null)}
        buttons={[
          {
            name: t('common.close'),
            onClick: () => setTarget(null),
          },
          {
            type: 'positive',
            name: t('common.okay'),
            onClick: onRenameView,
          },
        ]}
      >
        <div class={'text-xl mb-2'}>
          {t('setting.view.rename-alert-title')}
        </div>
        <div class={'text-md mb-1'}>
          {t('setting.view.rename-alert', { name: target() })}
        </div>
        <input class={'input w-full'} value={name()} onChange={(event) => setName(event.target.value)} />
      </Modal>
      <Modal
        open={nameConflictOpen()}
        onClose={() => setNameConflictOpen(false)}
        buttons={[
          {
            name: t('common.okay'),
            onClick: () => setNameConflictOpen(false),
          },
        ]}
      >
        <div class={'text-xl mb-2'}>
          {t('setting.view.rename-conflict-title')}
        </div>
        <div class={'text-md mb-1'}>
          {t('setting.view.rename-conflict', { name: name() })}
        </div>
      </Modal>
    </div>
  );
};
