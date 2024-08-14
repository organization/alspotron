import { createSignal, For, JSX, mergeProps, onMount, splitProps } from 'solid-js';

import { cx } from '../utils/classNames';

interface SliderLabel {
  value: number;
  label: string;
}

export interface SliderProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  label?: SliderLabel[];
}

export const Slider = (props: SliderProps) => {
  const [local, leftProps] = splitProps(
    mergeProps({
      min: 0,
      max: 100,
      step: 1,
      value: 0,
      label: [],
    }, props),
    ['min', 'max', 'value', 'step', 'label', 'onChange'],
  );

  const [slider, setSlider] = createSignal<HTMLDivElement | null>(null);
  const [rect, setRect] = createSignal<DOMRect | null>(null);

  const value = () => (local.value - local.min) / (local.max - local.min);
  const maxWidth = () => (rect()?.width ?? 16) - 16;

  const onMoveStart = (event: PointerEvent) => {
    const element = slider();
    if (!element) return;

    setRect(element.getBoundingClientRect());
    onMove(event);

    const cleanUp = (event: PointerEvent) => {
      onMove(event);

      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', cleanUp);
      window.removeEventListener('pointercancel', cleanUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', cleanUp);
    window.addEventListener('pointercancel', cleanUp);
  };
  const onMove = (event: PointerEvent) => {
    const domRect = rect();
    if (!domRect) return;

    const max = Math.max(1, maxWidth());
    const now = Math.min(Math.max(0, event.pageX - domRect.left - 6), max);
    const value = local.min + ((now / max) * (local.max - local.min));
    const newValue = ~~(value / local.step) * local.step;

    local.onChange?.(newValue);
  };

  onMount(() => {
    const element = slider();
    if (!element) return;

    setRect(element.getBoundingClientRect());
  });

  return (
    <div
      {...leftProps}
      ref={setSlider}
      style={`--value: ${value()}`}
      class={cx(
        'relative min-w-[120px] h-16px flex justify-start items-center z-0 cursor-pointer',
        local.label.length > 0 && 'pb-6',
        leftProps.class,
      )}
      onPointerDown={onMoveStart}
    >
      <div class={'absolute left-[4px] right-[4px] h-[4px] bg-gray-300 rounded-full -z-2'}/>
      <div
        style={'scale: var(--value) 100%;'}
        class={'absolute left-[4px] right-[4px] h-[4px] bg-primary-500 rounded-full -z-1 origin-left'}
      />
      <div
        class={`
          w-[16px] h-[16px] rounded-full shadow-[0_0_0_1px_var(--tw-shadow-color)] z-0
          bg-primary-500 border-[3px] border-gray-100 shadow-gray-300
          dark:border-gray-700 dark:shadow-gray-500
        `}
        style={`translate: calc(var(--value, 0) * ${maxWidth()}px) 0;`}
      />
      <For each={local.label}>
        {(item) => (
          <div
            style={`left: ${((item.value - local.min) / (local.max - local.min) * maxWidth()) + 8}px;`}
            class={`
              absolute left-[8px] bottom-0 text-sm
              w-full text-center
              text-black dark:text-white
              translate-x-[-50%] pointer-events-none
             `}
          >
            {item.label}
          </div>
        )}
      </For>
    </div>
  );
};
