import { JSX } from 'solid-js';

import useConfig from '../../hooks/useConfig';

const AnchoredView = (props: { children: JSX.Element }) => {
  const [config] = useConfig();
  return (
      <div
        class="fixed w-full h-fit flex flex-col gap-4"
        classList={{
          'top-0': config()?.windowPosition.anchor.includes('top'),
          'bottom-0': config()?.windowPosition.anchor.includes('bottom'),
          'left-0': config()?.windowPosition.anchor.includes('left'),
          'right-0': config()?.windowPosition.anchor.includes('right'),
          'left-[50%] right-[50%] translate-x-[-50%]': ['top', 'bottom', 'center'].includes(config()?.windowPosition.anchor ?? 'bottom-right'),
          'top-[50%] bottom-[50%] translate-y-[-50%]': ['left', 'right', 'center'].includes(config()?.windowPosition.anchor ?? 'bottom-right'),

          'justify-start': config()?.windowPosition.anchor.includes('top'),
          'justify-center': ['left', 'right', 'center'].includes(config()?.windowPosition.anchor ?? 'bottom-right'),
          'justify-end': config()?.windowPosition.anchor.includes('bottom'),
          'items-start': config()?.windowPosition.anchor.includes('left'),
          'items-center': ['top', 'bottom', 'center'].includes(config()?.windowPosition.anchor ?? 'bottom-right'),
          'items-end': config()?.windowPosition.anchor.includes('right'),
        }}
        style={{
          '--text-align': config()?.windowPosition.anchor.match(/left|right|center/)?.at(0) ?? 'center',
          'flex-direction': config()?.windowPosition?.direction ?? 'column',
        }}
      >
      {props.children}
    </div>
  );
};

export default AnchoredView;
