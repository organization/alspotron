
import { Marquee } from '@suyongs/solid-utility';

import { JSX, Show, createSignal } from 'solid-js';

import Card from '../../components/Card';

export interface GameCardProps {
  icon?: string;
  name: string;
  path?: string;
  children?: JSX.Element;
}

const GameCard = (props: GameCardProps) => {
  const [hover, setHover] = createSignal(false);

  return (
    <Card
      class={'w-full flex justify-start items-center gap-4'}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Show when={!!props.icon} fallback={<div class={'w-6 h-6 aspect-square'} />}>
        <img src={props.icon} class={'w-6 h-6 object-cover'} alt={'Icon'}/>
      </Show>
      <div class={'w-0 flex flex-col justify-center items-stretch flex-1'}>
        <div class={'w-full'}>
          {props.name}
        </div>
        <Marquee mode={hover() ? 'auto' : 'truncate'} class={'text-gray-400'} gap={18}>
          {props.path}
        </Marquee>
      </div>
      {props.children}
    </Card>
  );
};

export default GameCard;
