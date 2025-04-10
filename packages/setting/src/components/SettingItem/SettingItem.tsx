import { Box, Icon, Text } from '@alspotron/ui';
import { JSX, Show } from 'solid-js';

export type SettingItemProps = {
  name: string;
  description?: string;
  icon?: string;

  children?: JSX.Element;
}
export const SettingItem = (props: SettingItemProps) => {
  return (
    <Box
      direction={'row'}
      w={'100%'}
      r={'lg'}
      p={'lg'}
      gap={'md'}
      bd={'md'}
      bc={'surface.highest'}
      align={'center'}
      justify={'space-between'}
    >
      <Box direction={'row'} gap={'md'} align={'center'}>
        <Show when={props.icon}>
          {(icon) => (
            <Icon name={icon()} size={'2.0rem'} />
          )}
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
      {props.children}
    </Box>
  );
};
