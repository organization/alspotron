import icon from '../assets/IconMusic.png';

const LyricProgressBar = () => {
  return (
    <div
      class={`
        bg-gray-900/50 px-2 py-3 text-gray-50 rounded
        flex flex-row justify-start items-center gap-2
      `}
    >
      <img src={icon} class={'w-6 h-6 object-contain'} />
      테스트 제목임 ㅇㅇ
      -
      test
    </div>
  )
};

export default LyricProgressBar;
