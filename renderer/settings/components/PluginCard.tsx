import { Marquee } from '@suyongs/solid-utility';

import Card from '../../components/Card';
import { Plugin } from '../../../common/plugin';

export interface PluginCardProps {
  plugin: Plugin;
}

const PluginCard = (props: PluginCardProps) => {
  return (
    <Card class={'w-full flex justify-start items-center gap-4'}>
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
