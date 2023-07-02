// eslint-disable-next-line import/no-unresolved
import { JSX } from 'solid-js/jsx-runtime';
import { cx } from '../utils/classNames';


const Titlebar = () => {
  return (
    <div
      style={{
        'width': '100%',
        'height': '32px',
        '-webkit-user-select': 'none',
        '-webkit-app-region': 'drag'
      }}
    />
  )
};

export default Titlebar;
