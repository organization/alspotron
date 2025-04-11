import { For } from 'solid-js';
import { Box, Text } from '@alspotron/ui';

import { SettingAction } from './SettingAction';

import { SettingGroup } from '../SettingGroup';
import { SettingItem } from '../SettingItem';

import { SettingGroup as SettingGroupType } from '../../config';

export type SettingPanelProps = {
  name: string;
  groups: SettingGroupType[];
}
export const SettingPanel = (props: SettingPanelProps) => {
  return (
    <Box p={'xl'} gap={'xl'}>
      <Text variant={'h2'}>
        {props.name}
      </Text>
      <For each={props.groups}>
        {(group) => (
          <SettingGroup name={group.name}>
            <For each={group.items}>
              {(item) => (
                <SettingItem
                  name={item.name}
                  description={item.description}
                  icon={item.icon}
                  items={item.items?.map((item) => ({
                    ...item,
                    children: <SettingAction {...item} />,
                  }))}
                >
                  <SettingAction {...item} />
                </SettingItem>
              )}
            </For>
          </SettingGroup>
        )}
      </For>
    </Box>
  );
};
