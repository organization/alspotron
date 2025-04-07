import { Show, splitProps } from 'solid-js';

import Card from '../../components/Card';
import { cx } from '../../utils/classNames';

import type { JSX } from 'solid-js/jsx-runtime';

export interface PresetCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  name: string;
  url?: string;
}
const PresetCard = (props: PresetCardProps) => {
  const [local, leftProps] = splitProps(props, ['selected', 'name', 'url']);

  return (
    <Card
      {...leftProps}
      class={cx('relative group h-full aspect-square !p-0 overflow-hidden z-0 cursor-pointer', leftProps.class)}
    >
      <img
        src={local.url}
        class={'-z-1 group-hover:opacity-50'}
        alt={'Preset Image'}
      />
      <div
        class={`
          absolute left-0 right-0 bottom-0
          text-lg z-0 p-3 bg-gradient-to-t from-black/100 to-black/0
          flex flex-row justify-start items-center gap-1
        `}
        classList={{
          'text-primary-500': !!local.selected,
          'text-white': !local.selected,
        }}
      >
        <Show when={local.selected}>
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
              class={'fill-primary-500'}
            />
          </svg>
        </Show>
        {local.name}
      </div>
      <Show when={local.selected}>
        <div
          class={
            'absolute inset-0 pointer-events-none shadow-[0_0_0_4px_var(--tw-shadow-color)_inset] shadow-primary-500 rounded z-[1]'
          }
        />
      </Show>
    </Card>
  );
};

export default PresetCard;
