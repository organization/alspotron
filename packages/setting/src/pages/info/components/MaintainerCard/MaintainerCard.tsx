import { For, Show } from 'solid-js';
import { Box, Button, Text, Icon} from '@alspotron/ui';

import { buttonStyle, cardStyle, profileStyle } from './Maintainer.css';

export type MaintainerCardProps = {
  name: string;
  description: string | string[];
  image: string;
  link: string;
}
export const MaintainerCard = (props: MaintainerCardProps) => {
  return (
    <Box
      justify={'center'}
      align={'center'}
      r={'md'}
      gap={'md'}
      bg={'surface.highest'}
      p={'xl'}
      class={cardStyle}
    >
      <img
        src={props.image}
        alt={`${props.name} Profile Image`}
        class={profileStyle}
      />
      <Text variant={'title'}>
        {props.name}
      </Text>
      <Box align={'center'} gap={'xs'}>
        <Show
          when={Array.isArray(props.description)}
          fallback={
            <Text variant={'caption'}>
              {props.description}
            </Text>
          }
        >
          <For each={props.description as string[]}>
            {(description) => (
              <Text variant={'caption'}>
                {description}
              </Text>
            )}
          </For>
        </Show>
      </Box>
      <Button
        variant={'icon'}
        class={buttonStyle}
        onClick={() => window.open(props.link)}
      >
        <Icon name={'open_in_new'} />
      </Button>
    </Box>
  );
};