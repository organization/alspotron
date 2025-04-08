import { createSignal, For } from 'solid-js';
import { Box, Button, Icon, Popover, Item, Text, createClickAway } from '@alspotron/ui';

import { useConfig } from '../../../../hooks/useConfig';

export const DevtoolButton = () => {
  const [open, setOpen] = createSignal(false);
  const [config] = useConfig();

  const onDebug = (target: 'lyrics' | 'settings' | 'tray') => {
    window.ipcRenderer.invoke('open-devtool', target);
  };
  const onMainDebug = (index: number) => {
    window.ipcRenderer.invoke('open-devtool', 'main', index);
  };

  const track = createClickAway(() => setOpen(false));

  return (
    <Popover
      open={open()}
      placement={'top-end'}
      element={
        <Box
          ref={track}
          w={'20rem'}
          r={'md'}
          bg={'gray.50'}
          shadow={'md'}
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
                  leftIcon={view.enabled ? 'check' : undefined}
                  rightIcon={'chevron_right'}
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
        onClick={() => setOpen(!open())}
      >
        <Icon name={'bug_report'} size={'1.8rem'}/>
      </Button>
    </Popover>
  );
};