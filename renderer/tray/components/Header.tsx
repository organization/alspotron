import { useNavigate } from '@solidjs/router';

export interface HeaderProps {
  title?: string;
}
export const Header = (props: HeaderProps) => {
  const navigate = useNavigate();

  const onPrev = () => {
    navigate(-1);
  }

  return (
    <div class={'w-full flex h-8 justify-start items-center gap-2 mb-2'}>
      <div class={'header-title flex-1'}>
        {props.title}
      </div>
      <button class={'btn-text px-2 pr-3 py-1 min-w-[unset] flex justify-start items-center gap-2'} onClick={onPrev}>
        <svg class={'w-[18px] h-[18px] fill-none'} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path
            d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
        <span>
          뒤로
        </span>
      </button>
    </div>
  );
};
