import { Box, Text } from "@alspotron/ui";
import { JSX } from 'solid-js';

export type SettingGroupProps = {
  name: string;
  children?: JSX.Element;
}
export const SettingGroup = (props: SettingGroupProps) => {
  return (
    <Box align={'stretch'} gap={'md'}>
      <Text variant={'title'}>
        {props.name}
      </Text>
      {props.children}
    </Box>
  )
};
