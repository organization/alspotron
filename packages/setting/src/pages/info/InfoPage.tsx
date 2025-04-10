import { For } from 'solid-js';
import { Box, Text, Icon, Item, Button } from '@alspotron/ui';

import { MaintainerCard } from './components/MaintainerCard';

import { SettingGroup } from '../../components/SettingGroup';
import { SettingItem } from '../../components/SettingItem';

import { logoStyle, profileStyle } from './InfoPage.css';
import Logo from '../../assets/icon_music.png';

import rootPackage from '../../../../../package.json';

const Maintainers = [
  {
    name: 'Khinenw',
    description: 'Alspotify 원작자',
    image: 'https://avatars.githubusercontent.com/u/3919433?s=256&v=4',
    link: 'https://github.com/Helloworld017',
  },
  {
    name: 'Su-Yong',
    description: 'Alspotron 메인테이너',
    image: 'https://avatars.githubusercontent.com/u/13764936?s=256&v=4',
    link: 'https://github.com/Su-Yong',
  },
  {
    name: 'JellyBrick',
    description: 'Alspotron 메인테이너',
    image: 'https://avatars.githubusercontent.com/u/16558115?s=256&v=4',
    link: 'https://github.com/JellyBrick',
  },
];

const Contributors = [
  {
    link: 'https://github.com/smnis',
    image: 'https://avatars.githubusercontent.com/u/13712304?s=64&v=4',
    name: 'SeongMin Park',
    description: 'Alspotron 개발자'
  },
  {
    link: 'https://github.com/alvin0319',
    image: 'https://avatars.githubusercontent.com/u/32565818?s=64&v=4',
    name: 'alvin0319',
    description: 'Alspotron 기여자'
  },
  {
    link: 'https://github.com/SemteulGaram',
    image: 'https://avatars.githubusercontent.com/u/6727533?s=64&v=4',
    name: 'STGR',
    description: 'Alspotron 기여자'
  },
  {
    link: 'https://github.com/Flaplim',
    image: 'https://avatars.githubusercontent.com/u/6704921?s=64&v=4',
    name: 'Hyeseo Lee',
    description: 'Alspotron 번역자 (독일어)'
  },
  {
    link: 'https://github.com/hwangseonu',
    image: 'https://avatars.githubusercontent.com/u/30190259?s=64&v=4',
    name: 'mocha',
    description: 'Alspotron 번역자 (일본어)'
  },
  {
    link: 'https://github.com/ReturnToFirst',
    image: 'https://avatars.githubusercontent.com/u/19341560?s=64&v=4',
    name: 'ReturnToFirst',
    description: 'Alspotron 번역자 (영어)'
  },
  {
    link: 'https://github.com/sbaik2',
    image: 'https://avatars.githubusercontent.com/u/16580092?s=64&v=4',
    name: 'Seungho Baik',
    description: 'Alspotron 번역자 (영어)'
  },
  {
    link: 'https://github.com/Aden1126',
    image: 'https://avatars.githubusercontent.com/u/129780719?s=64&v=4',
    name: 'Aden1126',
    description: 'Alspotron 번역자 (영어)'
  },
  {
    link: 'https://github.com/lewohy',
    image: 'https://avatars.githubusercontent.com/u/47781302?s=64&v=4',
    name: 'Lee Woo Hyun',
    description: 'Special Thanks'
  },
];

export const InfoPage = () => {
  const env = import.meta.env;

  return (
    <Box p={'xl'} gap={'xl'}>
      <Box align={'center'} gap={'xl'} m={'xxl'}>
        <Box align={'center'} gap={'sm'}>
          <Box p={'lg'}>
            <img src={Logo} class={logoStyle}/>
          </Box>
          <Text variant={'h2'}>
            Alspotron
          </Text>
          <Text variant={'caption'}>
            {rootPackage.description}
          </Text>
        </Box>
        <Box w={'50%'} bc={'surface.highest'} bd={'md'} r={'md'}>
          <Item.Group>
            <Item
              leftIcon={'verified'}
              name={'버전'}
              right={(
                <Text variant={'caption'}>
                  {rootPackage.version}{env.dev ? ' (dev)' : ''}
                </Text>
              )}
            />
            <Item
              leftIcon={'code'}
              name={'Repository'}
              rightIcon={'open_in_new'}
              onClick={() => window.open('https://github.com/organization/alspotron')}
            />
            <Item
              leftIcon={'bug_report'}
              name={'버그 및 오류 제보'}
              rightIcon={'open_in_new'}
              onClick={() => window.open('https://github.com/organization/alspotron/issues/new')}
            />
          </Item.Group>
        </Box>
      </Box>
      <SettingGroup name={'제작자'}>
        <Box direction={'row'} gap={'md'}>
          <For each={Maintainers}>
            {(maintainer) => (
              <MaintainerCard
                name={maintainer.name}
                description={maintainer.description}
                image={maintainer.image}
                link={maintainer.link}
              />
            )}
          </For>
        </Box>
      </SettingGroup>
      <SettingGroup name={'기여자'}>
        <For each={Contributors}>
          {(contributor) => (
            <SettingItem
              icon={(
                <img
                  src={contributor.image}
                  class={profileStyle}
                  alt={`${contributor.name} Profile Image`}
                />
              )}
              name={contributor.name}
              description={contributor.description}
            >
              <Button
                variant={'icon'}
                gap={'xs'}
                onClick={() => window.open(contributor.link)}
              >
                <Icon name={'open_in_new'} size={'1.4rem'} />
              </Button>
            </SettingItem>
          )}
        </For>
      </SettingGroup>
    </Box>
  );
};
