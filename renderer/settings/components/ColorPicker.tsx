import { createEffect, createSignal } from 'solid-js';
import Color from 'color';

import colors from 'tailwindcss/colors';

import type { JSX } from 'solid-js/jsx-runtime';

export interface ColorPickerProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onColorChange?: (color: string) => void;
}

const ColorPicker = (props: ColorPickerProps) => {
  const [alpha, setAlpha] = createSignal(0);
  const [color, setColor] = createSignal(props.value);

  let slider: HTMLDivElement;
  let rect: DOMRect | null = null;
  const onMoveStart = (event: PointerEvent) => {
    rect = slider.getBoundingClientRect();
    onMove(event);

    const cleanUp = (event: PointerEvent) => {
      onMove(event);

      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', cleanUp);
      window.removeEventListener('pointercancel', cleanUp);
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', cleanUp);
    window.addEventListener('pointercancel', cleanUp);
  };
  const onMove = (event: PointerEvent) => {
    if (!rect) return;

    const max = 108;
    const now = Math.min(Math.max(0, event.pageX - rect.left - 6), max);

    setAlpha(now / max);
    props.onColorChange?.(Color(color()).rgb().alpha(now / max).string());
  };
  const onChangeColor = (color: string) => {
    setColor(color);
    props.onColorChange?.(Color(color).rgb().alpha(alpha()).string());
  }

  createEffect(() => {
    const color = Color(props.value);
    setColor(color.hex());
    setAlpha(color.alpha());
  });

  return (
    <div class={'flex flex-row justify-center items-center gap-2 mr-[6px]'}>
      <input
        type={'color'}
        class={'input color'}
        value={color()}
        onChange={(event) => onChangeColor(event.target.value)}
        style={{
          '--opacity': Math.max(alpha(), 0.1),
        }}
      />
      <div
        ref={slider}
        style={{
          '--alpha': `${alpha() * 108}px`,
        }}
        class={'relative min-w-[120px] h-16px flex justify-start items-center z-0 cursor-pointer'}
        onPointerDown={onMoveStart}
      >
        <div class={'absolute left-[4px] right-[4px] h-[4px] bg-gray-300 rounded-full -z-2'} />
        <div
          style={{
            scale: `${alpha() * 100}% 100%`,
          }}
          class={'absolute left-[4px] right-[4px] h-[4px] bg-primary-500 rounded-full -z-1 origin-left'}
        />
        <div
          class={'w-[12px] h-[12px] rounded-full bg-primary-500 z-0'}
          style={{
            translate: `var(--alpha) 0`,
            'box-shadow': `0 0 0 3px ${colors.gray[900]}, 0 0 0 4px ${colors.gray[500]}`
          }}
        />
      </div>
    </div>
  )
};

export default ColorPicker;
