import { Box, BoxProps, Button, Icon, Text } from '@alspotron/ui';
import { createSignal, For, JSX, Show } from 'solid-js';

import { expandStyle, itemGroupStyle, itemStyle, withGroupStyle } from './SettingItem.css';

type BaseSettingItemProps = {
  name: string;
  description?: string;
  icon?: string | JSX.Element;

  children?: JSX.Element;
};
export type SettingItemProps = BaseSettingItemProps & {
  items?: BaseSettingItemProps[];
}
const BaseSettingItem = (props: BoxProps<'div'> & BaseSettingItemProps) => {
  return (
    <Box
      {...props}
      direction={'row'}
      w={'100%'}
      p={'lg'}
      gap={'md'}
      align={'center'}
      justify={'space-between'}
    >
      <Box direction={'row'} gap={'md'} align={'center'}>
        <Show
          when={typeof props.icon === 'string'}
          fallback={props.icon}
        >
          <Icon name={props.icon as string} size={'2.0rem'}/>
        </Show>
        <Box gap={'xs'}>
          <Text variant={'body'}>
            {props.name}
          </Text>
          <Show when={props.description}>
            <Text variant={'caption'}>
              {props.description}
            </Text>
          </Show>
        </Box>
      </Box>
      <Box
        direction={'row'}
        justify={'flex-end'}
        align={'center'}
        gap={'sm'}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export const SettingItem = (props: SettingItemProps) => {
  const hasGroup = () => (props.items?.length ?? 0) > 0;
  const [expand, setExpand] = createSignal(false);

  return (
    <Box
      w={'100%'}
      bd={'md'}
      bc={'surface.highest'}
      r={'lg'}
    >
      <BaseSettingItem
        name={props.name}
        description={props.description}
        icon={props.icon}
        classList={{
          [withGroupStyle]: hasGroup() && expand(),
        }}
      >
        {props.children}
        <Show when={hasGroup()}>
          <Button
            variant={'icon'}
            onClick={() => setExpand(!expand())}
          >
            <Icon
              name={'expand_more'}
              classList={{
                [expandStyle.default]: true,
                [expandStyle.expand]: expand(),
              }}
            />
          </Button>
        </Show>
      </BaseSettingItem>
      <Show when={hasGroup() && expand()}>
        <div class={itemGroupStyle}>
          <For each={props.items}>
            {(item) => (
              <BaseSettingItem
                name={item.name}
                description={item.description}
                icon={item.icon}
                class={itemStyle}
              >
                {item.children}
              </BaseSettingItem>
            )}
          </For>
        </div>
      </Show>
    </Box>
  );
};
