import { JSX } from 'solid-js/jsx-runtime';

export interface LyricsItemProps {
  children: JSX.Element;
  status?: string;
}

const LyricsItem = (props: LyricsItemProps) => {
  return (
    <div
      style={props.status === 'stopped' ? 'opacity: 0.5' : ''}
      class={'py-1 px-2 bg-gray-900/50 text-gray-100 whitespace-pre-line text-center transition-opacity duration-225 ease-out'}
    >
      {props.children}
    </div>
  );
};

export default LyricsItem;
