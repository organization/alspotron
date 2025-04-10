import { JSX } from 'solid-js';

import { Platform } from '../platform';

export type WindowProps = {
  dark?: boolean;
  children: JSX.Element;
}
export const Window = (props: WindowProps) => {
  const lightStyle = () => {
    const os = Platform.OS();

    if (os === 'mac') return 'rgba(255, 255, 255, 0.4)';

    return undefined;
  };
  const darkStyle = () => {
    const os = Platform.OS();

    if (os === 'mac') return 'rgba(0, 0, 0, 0.4)';

    return undefined;
  };

  console.log(Platform.OS());

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: props.dark ? darkStyle() : lightStyle(),
        overflow: 'hidden',
      }}
    >
      {props.children}
    </div>
  );
};
