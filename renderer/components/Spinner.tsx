import { mergeProps, splitProps } from 'solid-js';

import { cx } from '../utils/classNames'

import type { JSX } from 'solid-js/jsx-runtime';

export interface SpinnerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  strokeWidth?: number;
}
const Spinner = (props: SpinnerProps): JSX.Element => {
  const [local, leftProps] = splitProps(mergeProps({ strokeWidth: 2 }, props), ['strokeWidth']);

  const path = () => {
    const width = local.strokeWidth / 2;

    return `M 12 ${width} A ${12 - width} ${12 - width} 0 1 1 ${width} 12`;
  };
  const dashLength = () => 57.5 - (local.strokeWidth * 2.5);

  return (
    <div
      {...leftProps}
      class={cx('flex justify-center items-center', leftProps.class)}
    >
      <svg
        viewBox={'0 0 24 24'}
        xmlns={'http://www.w3.org/2000/svg'}
        class={'animate-spin duration-[1400ms]'}
        style={typeof leftProps.style !== 'string' ? {
          width: leftProps.style?.width,
          height: leftProps.style?.height,
        } : {}}
      >
        <path
          d={path()}
          class={'spinner-shape'}
          style={{
            '--stroke-width': local.strokeWidth,
            '--dash-length': dashLength(),
          }}
        />
      </svg>
    </div>
  )
};

export default Spinner;