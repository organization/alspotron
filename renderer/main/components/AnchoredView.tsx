import { splitProps } from 'solid-js';

import { cx } from '../../utils/classNames';

import useConfig from '../../hooks/useConfig';
import useStyle from '../../hooks/useStyle';

import type { JSX } from 'solid-js/jsx-runtime';
import { userCSSSelectors } from '../../utils/userCSSSelectors';
import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import { useClassStyle } from '../../hooks/useClassStyle';
import useCurrent from '../../hooks/useCurrent';

interface AnchoredViewProps extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string;
  style?: string;
  children: JSX.Element;
}

const AnchoredView = (props: AnchoredViewProps) => {
  const [config] = useConfig();
  const style = useStyle();
  const { status } = usePlayingInfo();
  const { view } = useCurrent();

  const [, containerProps] = splitProps(
    props,
    ['class', 'style', 'children'],
  );

  useClassStyle(userCSSSelectors.wrapper, () => {
    const anchor = view()?.position.anchor ?? '';

    return `
      position: fixed;
      ${anchor.includes('top') ? 'top: 0;' : ''}
      ${anchor.includes('bottom') ? 'bottom: 0;' : ''}
      ${anchor.includes('left') ? 'left: 0;' : ''}
      ${anchor.includes('right') ? 'right: 0;' : ''}
      --translate-x: 0;
      --translate-y: 0;
      ${['top', 'bottom', 'center'].includes(anchor) ? 'left: 50%; right: 50%; --translate-x: -50%;' : ''}
      ${['left', 'right', 'center'].includes(anchor) ? 'top: 50%; bottom: 50%; --translate-y: -50%;' : ''}
      translate: var(--translate-x) var(--translate-y);

      width: 100%;
      height: fit-content;
      
      display: flex;
      flex-direction: ${style().lyric.direction};

      ${anchor.includes('top') ? 'justify-content: flex-start;' : ''}
      ${['left', 'right', 'center'].includes(anchor) ? 'justify-content: center;' : ''}
      ${anchor.includes('bottom') ? 'justify-content: flex-end;' : ''}

      ${anchor.includes('left') ? 'align-items: flex-start;' : ''}
      ${['top', 'bottom', 'center'].includes(anchor) ? 'align-items: center;' : ''}
      ${anchor.includes('right') ? 'align-items: flex-end;' : ''}

      row-gap: ${style()?.rowGap ?? '2'}rem;
    `;
  });

  return (
      <div
        data-anchor={view()?.position.anchor}
        classList={{
          [userCSSSelectors['wrapper']]: true,
          [userCSSSelectors['wrapper--stopped']]: status() === 'stopped',
          [userCSSSelectors['wrapper--idle']]: status() === 'idle',
          [userCSSSelectors['wrapper--playing']]: status() === 'playing',
        }}
        {...containerProps}
      >
      {props.children}
    </div>
  );
};

export default AnchoredView;
