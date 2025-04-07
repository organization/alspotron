import { type JSX, createSignal, splitProps } from 'solid-js';

import { cx } from '../utils/classNames';

const MAX_MOVE_OFFSET = 40 - 20;

export interface SwitchProps extends Omit<JSX.InputHTMLAttributes<HTMLDivElement>, 'value' | 'onChange'> {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

const Switch = (props: SwitchProps) => {
  const [local, leftProps] = splitProps(props, ['value', 'onChange']);

  const [move, setMove] = createSignal(false);
  // eslint-disable-next-line solid/reactivity
  const [offset, setOffset] = createSignal(local.value ? 1 : 0);

  let thumb: HTMLDivElement | undefined;

  let transitionTimeout: NodeJS.Timeout | undefined;
  let startX = 0;
  let startXOffset = 0;
  const onMoveStart = (event: PointerEvent) => {
    startX = event.pageX - 10;
    startXOffset = offset() * MAX_MOVE_OFFSET;

    setMove(true);
    onMove(event);
    if (typeof transitionTimeout === 'number') clearTimeout(transitionTimeout);

    const startOffset = offset();
    const timestamp = event.timeStamp;

    const cleanUp = (event: PointerEvent) => {
      onMove(event);
      setMove(false);

      let newOffset = 0;
      if (Math.abs(startOffset - offset()) < 0.1 && Math.abs(timestamp - event.timeStamp) < 500) {
        // click
        local.onChange?.(!local.value);
        newOffset = local.value ? 0 : 1;
      } else {
        // move
        local.onChange?.(offset() > 0.5);
        newOffset = offset() > 0.5 ? 1 : 0;
      }

      setTimeout(() => {
        if (thumb && newOffset !== offset()) {
          thumb.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
          transitionTimeout = setTimeout(() => {
            if (thumb) thumb.style.transition = '';
          }, 500);
        }

        setOffset(newOffset);
      }, 16 * 3); // 3 frames

      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', cleanUp);
      window.removeEventListener('pointercancel', cleanUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', cleanUp);
    window.addEventListener('pointercancel', cleanUp);
  };
  const onMove = (event: PointerEvent) => {
    const now = Math.min(Math.max(0, startXOffset + event.pageX - startX - 10), MAX_MOVE_OFFSET);

    setOffset(Math.min(Math.max(now / MAX_MOVE_OFFSET, 0), 1));
  };

  return (
    <div
      {...leftProps}
      class={cx(
        'relative w-[40px] h-[20px] rounded-full border-[1px]',
        local.value ? 'bg-primary-500 border-primary-500 active:bg-primary-600' : 'border-black/30 dark:border-white',
      )}
      onPointerDown={onMoveStart}
      onClick={(event) => event.stopPropagation()}
      style={`--offset: ${offset() * MAX_MOVE_OFFSET}px`}
    >
      <div
        ref={thumb}
        class={cx(
          'absolute w-[10px] h-[10px] left-[4px] top-[4px] rounded-full bg-black/30 dark:bg-white transition-transform',
          move() ? 'scale-[120%] w-[12px]' : 'transition-all',
          local.value && 'scale-[120%] !bg-white',
        )}
        style={{
          translate: 'var(--offset) 0',
        }}
      />
    </div>
  );
};

export default Switch;
