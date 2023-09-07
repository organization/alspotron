import { Marquee } from '@suyongs/solid-utility';

import { useNavigate } from '@solidjs/router';

import { Show } from 'solid-js';

import Card from '../../components/Card';
import { Plugin } from '../../../common/plugin';

export interface PluginCardProps {
  state?: 'enable' | 'disable';
  plugin: Plugin;
}

const PluginCard = (props: PluginCardProps) => {
  const navigate = useNavigate();

  const onPluginPage = () => {
    navigate(`/plugin/${props.plugin.id}`);
  };

  return (
    <Card class={'w-full flex justify-start items-center gap-4'} onClick={onPluginPage}>
      <svg
        class={'w-6 h-6 fill-none'}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Show
          when={props.state !== 'disable'}
          fallback={
            <path
              d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm4.25 7.75a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5h8.5Z"
              class={'fill-red-500'}
            />
          }
        >
          <path
            d="M4.53 12.97a.75.75 0 0 0-1.06 1.06l4.5 4.5a.75.75 0 0 0 1.06 0l11-11a.75.75 0 0 0-1.06-1.06L8.5 16.94l-3.97-3.97Z"
            class={'fill-green-500'}
          />
        </Show>
      </svg>
      <div class={'w-0 flex flex-col justify-center items-stretch flex-1'}>
        <div class={'w-full'}>
          {props.plugin.name}
          <span class={'text-gray-400'}>
            {' - '}
            {props.plugin.author}
          </span>
        </div>
        <Marquee class={'text-gray-400'} gap={18}>
          {props.plugin.description}
        </Marquee>
      </div>
      <div class={'text-gray-400'}>
        {props.plugin.version ?? `v${props.plugin.versionCode}`}
      </div>
      <svg class={'w-[18px] h-[18px] fill-none'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.47 4.22a.75.75 0 0 0 0 1.06L15.19 12l-6.72 6.72a.75.75 0 1 0 1.06 1.06l7.25-7.25a.75.75 0 0 0 0-1.06L9.53 4.22a.75.75 0 0 0-1.06 0Z"
          class={'fill-black dark:fill-white'}
        />
      </svg>
    </Card>
  )
};

export default PluginCard;
