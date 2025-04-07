import { createSignal, Switch, Match } from 'solid-js';
import { Trans } from '@jellybrick/solid-i18next';

import Card from '../../components/Card';
import Spinner from '../../components/Spinner';

import MainIcon from '../../../assets/icon_music.png';
import ErrorIcon from '../../../assets/icon_error.png';
import packageJson from '../../../package.json';

import type { UpdateCheckResult } from 'electron-updater';

const InfoContainer = () => {
  const [updateData, setUpdateData] = createSignal<{
    updateCheckResult: UpdateCheckResult | null;
    compareResult: 0 | 1 | -1;
    currentVersion: string;
  } | null>(null);

  const refreshUpdateData = async () => {
    const updateResult = await window.ipcRenderer.invoke('check-update');
    const currentVersion = await window.ipcRenderer.invoke('get-current-version');
    if (!updateResult) {
      setUpdateData({
        updateCheckResult: null,
        compareResult: 0,
        currentVersion,
      });
      return;
    }
    const compareResult = await window.ipcRenderer.invoke(
      'compare-with-current-version',
      updateResult.updateInfo.version,
    );
    setUpdateData({
      updateCheckResult: updateResult,
      compareResult,
      currentVersion,
    });
  };

  const onLink = (url: string) => {
    window.open(url);
  };

  return (
    <div class={'flex-1 p-4 flex flex-col justify-start items-stretch gap-1 fluent-scrollbar'}>
      <div class={'text-3xl mb-1'}>
        <Trans key={'setting.title.about'} />
      </div>
      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.about.support'} />
      </div>
      <Card
        class={'flex flex-row justify-start items-center gap-1'}
        onClick={() => onLink('https://github.com/organization/alspotron')}
      >
        <img
          src={MainIcon}
          class={'w-6 h-6 mr-4 object-contain'}
          alt={'Main Icon'}
        />
        <div class={'flex flex-col justify-center items-start'}>
          <div class={'text-md'}>Alspotron</div>
          <div class={'text-xs text-black/50 dark:text-white/75'}>https://github.com/organization/alspotron</div>
        </div>
        <div class={'flex-1'} />
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      </Card>
      <Card
        class={'flex flex-row justify-start items-center gap-1'}
        onClick={() => onLink('https://github.com/organization/alspotron/issues/new')}
      >
        <img
          src={ErrorIcon}
          class={'w-6 h-6 mr-4 object-contain'}
          alt={'Main Icon'}
        />
        <div class={'flex flex-col justify-center items-start'}>
          <div class={'text-md'}>
            <Trans key={'setting.about.bug-report'} />
          </div>
          <div class={'text-xs text-black/50 dark:text-white/75'}>
            https://github.com/organization/alspotron/issues/new
          </div>
        </div>
        <div class={'flex-1'} />
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      </Card>
      <Card
        class={'flex flex-row justify-start items-center gap-1'}
        onClick={() => refreshUpdateData()}
        onExpand={(expand) => {
          if (expand) {
            refreshUpdateData();
          }
        }}
        subCards={[
          <div class={'w-full h-full flex justify-start items-center'}>
            <svg
              class={'w-6 h-6 fill-none mr-4'}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.087 7.75a5.752 5.752 0 0 1 11.326 0h.087a4 4 0 0 1 3.962 4.552 6.534 6.534 0 0 0-1.597-1.364A2.501 2.501 0 0 0 17.5 9.25h-.756a.75.75 0 0 1-.75-.713 4.25 4.25 0 0 0-8.489 0 .75.75 0 0 1-.749.713H6a2.5 2.5 0 0 0 0 5h4.4a6.458 6.458 0 0 0-.357 1.5H6a4 4 0 0 1 0-8h.087ZM22 16.5a5.5 5.5 0 1 0-11 0 5.5 5.5 0 0 0 11 0Zm-6-3a.5.5 0 0 1 1 0v4.793l1.646-1.647a.5.5 0 0 1 .708.708l-2.5 2.5a.5.5 0 0 1-.708 0l-2.5-2.5a.5.5 0 0 1 .708-.708L16 18.293V13.5Z"
                class={'fill-black dark:fill-white'}
              />
            </svg>
            <div class={'flex flex-col'}>
              <Switch
                fallback={
                  <div class={'w-full h-full flex flex-row justify-start items-center gap-6'}>
                    <Spinner class={'w-4 h-4 stroke-primary-500'} />
                    <Trans key={'setting.about.checking-for-updates'} />
                  </div>
                }
              >
                <Match when={(updateData()?.compareResult ?? 0) < 0}>
                  <div class={'text-md'}>
                    <Trans key={'setting.about.update-available'} />
                  </div>
                  <div class={'text-xs text-black/50 dark:text-white/75'}>
                    <Trans
                      key={'setting.about.latest-version'}
                      options={{
                        version: updateData()?.updateCheckResult?.updateInfo.version,
                      }}
                    />
                  </div>
                </Match>
                <Match when={(updateData()?.compareResult ?? 0) >= 0}>
                  <div class={'text-md'}>
                    <Trans key={'setting.about.already-up-to-date'} />
                  </div>
                  <div class={'text-xs text-black/50 dark:text-white/75'}>
                    <Trans
                      key={'setting.about.current-version'}
                      options={{ version: updateData()?.currentVersion }}
                    />
                  </div>
                </Match>
              </Switch>
            </div>
            <div class={'flex-1'} />
            <button
              class={'btn-primary'}
              onClick={() => refreshUpdateData()}
            >
              <Trans key={'setting.about.refresh'} />
            </button>
          </div>,
          <div
            class={'w-full h-full flex justify-start items-center'}
            onClick={() => onLink('https://github.com/organization/alspotron/releases')}
          >
            <Trans key={'setting.about.visit-releases-page'} />
            <div class={'flex-1'} />
            <svg
              class={'w-[16px] h-[16px] fill-none'}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
                class={'fill-black dark:fill-white'}
              />
            </svg>
          </div>,
        ]}
      >
        <svg
          class={'w-6 h-6 mr-4 fill-black dark:fill-white'}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 1.999c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001-5.524 0-10.002-4.478-10.002-10.001C1.998 6.477 6.476 1.999 12 1.999Zm0 1.5a8.502 8.502 0 1 0 0 17.003A8.502 8.502 0 0 0 12 3.5Zm-.004 7a.75.75 0 0 1 .744.648l.007.102.003 5.502a.75.75 0 0 1-1.493.102l-.007-.101-.003-5.502a.75.75 0 0 1 .75-.75ZM12 7.003a.999.999 0 1 1 0 1.997.999.999 0 0 1 0-1.997Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
        <div class={'flex flex-col justify-center items-start'}>
          <div class={'text-md'}>
            <Trans key={'setting.about.version'} />
          </div>
          <div class={'text-xs text-black/50 dark:text-white/75'}>{packageJson.version}</div>
        </div>
      </Card>
      <div class={'text-md mt-8 mb-1'}>
        <Trans key={'setting.about.developer'} />
      </div>
      <Card
        class={'flex flex-row justify-start items-center gap-1'}
        onClick={() => onLink('https://github.com/HelloWorld017')}
      >
        <img
          src={'https://avatars.githubusercontent.com/u/3919433?s=64&v=4'}
          class={'w-6 h-6 mr-4 rounded-full'}
          alt="Khinenw Profile Image"
        />
        <div class={'flex flex-col justify-center items-start'}>
          <div class={''}>Khinenw</div>
          <div class={'text-xs text-black/50 dark:text-white/75'}>
            <Trans key={'setting.about.alspotify-developer'} />, <Trans key={'setting.about.alspotron-developer'} />
          </div>
        </div>
        <div class={'flex-1'} />
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      </Card>
      <Card
        class={'flex flex-row justify-start items-center gap-1'}
        onClick={() => onLink('https://github.com/Su-Yong')}
      >
        <img
          src={'https://avatars.githubusercontent.com/u/13764936?s=64&v=4'}
          class={'w-6 h-6 mr-4 rounded-full'}
          alt="Su-Yong Profile Image"
        />
        <div class={'flex flex-col justify-center items-start'}>
          <div class={''}>Su-Yong</div>
          <div class={'text-xs text-black/50 dark:text-white/75'}>
            <Trans key={'setting.about.alspotron-developer'} />
          </div>
        </div>
        <div class={'flex-1'} />
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      </Card>
      <Card
        class={'flex flex-row justify-start items-center gap-1'}
        onClick={() => onLink('https://github.com/JellyBrick')}
      >
        <img
          src={'https://avatars.githubusercontent.com/u/16558115?s=64&v=4'}
          class={'w-6 h-6 mr-4 rounded-full'}
          alt="JellyBrick Profile Image"
        />
        <div class={'flex flex-col justify-center items-start'}>
          <div class={''}>JellyBrick</div>
          <div class={'text-xs text-black/50 dark:text-white/75'}>
            <Trans key={'setting.about.alspotron-developer'} />
          </div>
        </div>
        <div class={'flex-1'} />
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      </Card>
      <Card
        class={'flex flex-row justify-start items-center gap-1'}
        onClick={() => onLink('https://github.com/smnis')}
      >
        <img
          src={'https://avatars.githubusercontent.com/u/13712304?s=64&v=4'}
          class={'w-6 h-6 mr-4 rounded-full'}
          alt="smnis Profile Image"
        />
        <div class={'flex flex-col justify-center items-start'}>
          <div class={''}>SeongMin Park</div>
          <div class={'text-xs text-black/50 dark:text-white/75'}>
            <Trans key={'setting.about.alspotron-developer'} />
          </div>
        </div>
        <div class={'flex-1'} />
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      </Card>
      <Card
        class={'flex flex-row justify-start items-center gap-1'}
        onClick={() => onLink('https://github.com/alvin0319')}
      >
        <img
          src={'https://avatars.githubusercontent.com/u/32565818?s=64&v=4'}
          class={'w-6 h-6 mr-4 rounded-full'}
          alt="alvin0319 Profile Image"
        />
        <div class={'flex flex-col justify-center items-start'}>
          <div class={''}>alvin0319</div>
          <div class={'text-xs text-black/50 dark:text-white/75'}>
            <Trans key={'setting.about.alspotron-contributor'} />
          </div>
        </div>
        <div class={'flex-1'} />
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      </Card>
      <Card
        class={'flex flex-row justify-start items-center gap-1'}
        onClick={() => onLink('https://github.com/SemteulGaram')}
      >
        <img
          src={'https://avatars.githubusercontent.com/u/6727533?s=64&v=4'}
          class={'w-6 h-6 mr-4 rounded-full'}
          alt="STGR Profile Image"
        />
        <div class={'flex flex-col justify-center items-start'}>
          <div class={''}>STGR</div>
          <div class={'text-xs text-black/50 dark:text-white/75'}>
            <Trans key={'setting.about.alspotron-contributor'} />
          </div>
        </div>
        <div class={'flex-1'} />
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      </Card>
      <div class={'text-md mt-8 mb-1'}>
        <Trans key={'setting.about.translator'} />
      </div>
      <Card
        class={'flex flex-row justify-start items-center gap-1'}
        onClick={() => onLink('https://github.com/Flaplim')}
      >
        <img
          src={'https://avatars.githubusercontent.com/u/6704921?s=64&v=4'}
          class={'w-6 h-6 mr-4 rounded-full'}
          alt="Hyeseo Lee Profile Image"
        />
        <div class={'flex flex-col justify-center items-start'}>
          <div class={''}>Hyeseo Lee</div>
          <div class={'text-xs text-black/50 dark:text-white/75'}>
            <Trans key={'setting.about.alspotron-translator.german'} />
          </div>
        </div>
        <div class={'flex-1'} />
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      </Card>
      <Card
        class={'flex flex-row justify-start items-center gap-1'}
        onClick={() => onLink('https://github.com/hwangseonu')}
      >
        <img
          src={'https://avatars.githubusercontent.com/u/30190259?s=64&v=4'}
          class={'w-6 h-6 mr-4 rounded-full'}
          alt="mocha Profile Image"
        />
        <div class={'flex flex-col justify-center items-start'}>
          <div class={''}>mocha</div>
          <div class={'text-xs text-black/50 dark:text-white/75'}>
            <Trans key={'setting.about.alspotron-translator.japanese'} />
          </div>
        </div>
        <div class={'flex-1'} />
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      </Card>
      <Card
        class={'flex flex-row justify-start items-center gap-1'}
        onClick={() => onLink('https://github.com/ReturnToFirst')}
      >
        <img
          src={'https://avatars.githubusercontent.com/u/19341560?s=64&v=4'}
          class={'w-6 h-6 mr-4 rounded-full'}
          alt="ReturnToFirst Profile Image"
        />
        <div class={'flex flex-col justify-center items-start'}>
          <div class={''}>ReturnToFirst</div>
          <div class={'text-xs text-black/50 dark:text-white/75'}>
            <Trans key={'setting.about.alspotron-translator.english'} />
          </div>
        </div>
        <div class={'flex-1'} />
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      </Card>
      <Card
        class={'flex flex-row justify-start items-center gap-1'}
        onClick={() => onLink('https://github.com/sbaik2')}
      >
        <img
          src={'https://avatars.githubusercontent.com/u/16580092?s=64&v=4'}
          class={'w-6 h-6 mr-4 rounded-full'}
          alt="Seungho Baik Profile Image"
        />
        <div class={'flex flex-col justify-center items-start'}>
          <div class={''}>Seungho Baik</div>
          <div class={'text-xs text-black/50 dark:text-white/75'}>
            <Trans key={'setting.about.alspotron-translator.english'} />
          </div>
        </div>
        <div class={'flex-1'} />
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      </Card>
      <Card
        class={'flex flex-row justify-start items-center gap-1'}
        onClick={() => onLink('https://github.com/Aden1126')}
      >
        <img
          src={'https://avatars.githubusercontent.com/u/129780719?s=64&v=4'}
          class={'w-6 h-6 mr-4 rounded-full'}
          alt="Aden1126 Profile Image"
        />
        <div class={'flex flex-col justify-center items-start'}>
          <div class={''}>Aden1126</div>
          <div class={'text-xs text-black/50 dark:text-white/75'}>
            <Trans key={'setting.about.alspotron-translator.english'} />
          </div>
        </div>
        <div class={'flex-1'} />
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
            class={'fill-black dark:fill-white'}
          />
        </svg>
      </Card>
    </div>
  );
};

export default InfoContainer;
