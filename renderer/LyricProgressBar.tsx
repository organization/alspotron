import icon from '../assets/IconMusic.png';

interface LyricProgressBarProps {
  percent: number;
  title: string;
  artist: string;
  status: string;
}

const LyricProgressBar = (props: LyricProgressBarProps) => {
  return (
    <div
      style={`--percent: ${props.percent * 100}%; opacity: ${props.status === 'stopped' ? 0.5 : 1}`}
      class={`
        relative p-3 transition-all duration-[225ms] ease-out
        bg-gray-900/50 text-gray-50 rounded-md overflow-hidden
      `}
    >
      <div class={'flex flex-row justify-start items-center gap-2'}>
        <img src={icon} class={'w-6 h-6 object-contain'} />
        {props.title}
        <div class={'mx-1'}>
          -
        </div>
        {props.artist}
      </div>
      <div class={'absolute inset-0 bg-gray-900 z-[-1] scale-x-[--percent] origin-left'} />
    </div>
  )
};

export default LyricProgressBar;
// spotify
// alspotify
// alspotron