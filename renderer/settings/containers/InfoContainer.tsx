import Card from '../../components/Card';

import packageJson from '../../../package.json';

const InfoContainer = () => {
  const onLink = (url: string) => {
    window.open(url);
  };

  return (
    <div class={'flex-1 p-4 flex flex-col justify-start items-stretch gap-1'}>
      <div class={'text-3xl mb-1'}>
        정보
      </div>
      <div class={'text-md mt-4 mb-1'}>
        지원
      </div>
      <Card class={'flex flex-row justify-start items-center gap-1'} onClick={() => onLink('https://github.com/organization/alspotron')}>
        <div class={'w-8 h-8 mr-3 grid place-items-center'}>
          <svg width={'24'} height={'24'} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1.999c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001-5.524 0-10.002-4.478-10.002-10.001C1.998 6.477 6.476 1.999 12 1.999Zm0 1.5a8.502 8.502 0 1 0 0 17.003A8.502 8.502 0 0 0 12 3.5Zm-.004 7a.75.75 0 0 1 .744.648l.007.102.003 5.502a.75.75 0 0 1-1.493.102l-.007-.101-.003-5.502a.75.75 0 0 1 .75-.75ZM12 7.003a.999.999 0 1 1 0 1.997.999.999 0 0 1 0-1.997Z" fill="#ffffff"/>
          </svg>
        </div>
        <div class={'flex flex-col justify-center items-start'}>
          <div class={'text-md'}>
            Alspotron
          </div>
          <div class={'text-xs text-white/75'}>
            https://github.com/organization/alspotron
          </div>
        </div>
        <div class={'flex-1'}></div>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z" fill="#ffffff"/>
        </svg>
      </Card>
      <div class={'text-sm mt-8 mb-1'}>
        제작자
      </div>
      <Card class={'flex flex-row justify-start items-center gap-1'} onClick={() => onLink('https://github.com/HelloWorld017')}>
        <img src={'https://avatars.githubusercontent.com/u/3919433?s=64&v=4'} class={'w-8 h-8 mr-3 rounded-full'} />
        <div class={'flex flex-col justify-center items-start'}>
          <div class={''}>
            Khinenw
          </div>
          <div class={'text-xs text-white/75'}>
            Alspotify 원작자
          </div>
        </div>
        <div class={'flex-1'}></div>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z" fill="#ffffff"/>
        </svg>
      </Card>
      <Card class={'flex flex-row justify-start items-center gap-1'} onClick={() => onLink('https://github.com/Su-Yong')}>
        <img src={'https://avatars.githubusercontent.com/u/13764936?s=64&v=4'} class={'w-8 h-8 mr-3 rounded-full'} />
        <div class={'flex flex-col justify-center items-start'}>
          <div class={''}>
            Su-Yong
          </div>
          <div class={'text-xs text-white/75'}>
            Alspotron 제작자
          </div>
        </div>
        <div class={'flex-1'}></div>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z" fill="#ffffff"/>
        </svg>
      </Card>
      <Card class={'flex flex-row justify-start items-center gap-1'} onClick={() => onLink('https://github.com/JellyBrick')}>
        <img src={'https://avatars.githubusercontent.com/u/16558115?s=64&v=4'} class={'w-8 h-8 mr-3 rounded-full'} />
        <div class={'flex flex-col justify-center items-start'}>
          <div class={''}>
            JellyBrick
          </div>
          <div class={'text-xs text-white/75'}>
            Alspotron 제작자
          </div>
        </div>
        <div class={'flex-1'}></div>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z" fill="#ffffff"/>
        </svg>
      </Card>
    </div>
  );
};

export default InfoContainer;
