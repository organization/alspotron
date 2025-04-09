import { createSignal, For } from 'solid-js';
import { Box, Button, Icon, Popover, Item, Text, createClickAway } from '@alspotron/ui';

import { useConfig } from '../../../../hooks/useConfig';

import { activeButtonStyle, popupStyle } from './DevtoolButton.css';
import { vars } from '@alspotron/ui';

export const DevtoolButton = () => {
  const [open, setOpen] = createSignal(false);
  const [config] = useConfig();

  const onDebug = async (target: 'lyrics' | 'settings' | 'tray') => {
    await window.ipcRenderer.invoke('open-devtool', target);
    setOpen(false);
  };
  const onMainDebug = async (index: number) => {
    await window.ipcRenderer.invoke('open-devtool', 'main', index);
    setOpen(false);
  };

  const track = createClickAway(() => setOpen(false));

  return (
    <Popover
      open={open()}
      placement={'top-end'}
      offset={8}
      size={8}
      element={
        <Box
          ref={track}
          w={`calc(24rem - ${vars.space.md})`}
          r={'md'}
          shadow={'md'}
          class={popupStyle}
        >
          <Item.Group>
            <Text variant={'caption'} px={'sm'} py={'xs'}>
              렌더링 창
            </Text>
            <For each={config()?.views}>
              {(view, index) => (
                <Item
                  name={view.name}
                  description={`"${view.theme}" 적용중`}
                  disabled={!view.enabled}
                  rightIcon={view.enabled ? 'chevron_right' : undefined}
                  onClick={() => onMainDebug(index())}
                />
              )}
            </For>
          </Item.Group>
          <Item.Group>
            <Text variant={'caption'} px={'sm'} py={'xs'}>
              기타
            </Text>
            <Item
              name={'고급 검색 창'}
              rightIcon={'chevron_right'}
              onClick={() => onDebug('lyrics')}
            />
            <Item
              name={'설정 창'}
              rightIcon={'chevron_right'}
              onClick={() => onDebug('settings')}
            />
            <Item
              name={'트레이 창'}
              rightIcon={'chevron_right'}
              onClick={() => onDebug('tray')}
            />
          </Item.Group>
        </Box>
      }
    >
      <Button
        variant={'icon'}
        class={open() ? activeButtonStyle : undefined}
        onClick={() => setOpen(!open())}
      >
        <Icon name={'bug_report'} size={'1.8rem'}/>
      </Button>
    </Popover>
  );
};