import { UpdateCheckResult } from 'electron-updater';
import { createSignal, Match, Switch } from 'solid-js';
import Card from '../../components/Card';

const UpdateContainer = () => {
  const [updateData, setUpdateData] = createSignal<{
    updateCheckResult: UpdateCheckResult,
    currentVersion: string,
  }>(null);

  return (
    <div class={'flex-1 flex flex-col justify-start items-stretch gap-1 py-4 fluent-scrollbar'}>
      <div class={'text-3xl mb-1 px-4'}>
        업데이트
      </div>
      <div class={'text-md mt-4 mb-1 px-4'}>
        업데이트 확인
      </div>
      <div class={'flex flex-col justify-start items-stretch gap-1 px-4'}>
        <Card class={'flex flex-row justify-start items-center gap-1'} onClick={() =>
          void (async () => {
            const updateResult = await window.ipcRenderer.invoke('check-update') as UpdateCheckResult;
            const currentVersion = await window.ipcRenderer.invoke('get-current-version') as string;
            if (!updateResult) {
              setUpdateData({
                updateCheckResult: null,
                currentVersion,
              });
              return;
            }
            const compareResult = await window.ipcRenderer.invoke('compare-with-current-version', updateResult.updateInfo.version) as 0 | 1 | -1;
            if (compareResult < 0) {
              setUpdateData({
                updateCheckResult: updateResult,
                currentVersion,
              });
            }
          })()}>
          <div class={'w-8 h-8 mr-3 grid place-items-center'}>
            <svg width={'24'} height={'24'} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.087 7.75a5.752 5.752 0 0 1 11.326 0h.087a4 4 0 0 1 3.962 4.552 6.534 6.534 0 0 0-1.597-1.364A2.501 2.501 0 0 0 17.5 9.25h-.756a.75.75 0 0 1-.75-.713 4.25 4.25 0 0 0-8.489 0 .75.75 0 0 1-.749.713H6a2.5 2.5 0 0 0 0 5h4.4a6.458 6.458 0 0 0-.357 1.5H6a4 4 0 0 1 0-8h.087ZM22 16.5a5.5 5.5 0 1 0-11 0 5.5 5.5 0 0 0 11 0Zm-6-3a.5.5 0 0 1 1 0v4.793l1.646-1.647a.5.5 0 0 1 .708.708l-2.5 2.5a.5.5 0 0 1-.708 0l-2.5-2.5a.5.5 0 0 1 .708-.708L16 18.293V13.5Z" fill="#ffffff"/>
            </svg>
          </div>
          <div class={'flex flex-col justify-center items-start'}>
            <div class={'text-md'}>
              Alspotron 업데이트 확인하기!
            </div>
            <Switch fallback={
              <div class={'text-xs text-white/75'}>
                클릭하여 업데이트를 확인해주세요.
              </div>
            }>
              <Match when={updateData()?.updateCheckResult}>
                <div class={'text-xs text-white/75'}>
                  업데이트가 존재합니다. 최신 버전: {updateData().updateCheckResult.updateInfo.version}
                </div>
              </Match>
              <Match when={updateData()}>
                <div class={'text-xs text-white/75'}>
                  업데이트가 존재하지 않습니다. 현재 버전: {updateData().currentVersion}
                </div>
              </Match>
            </Switch>
          </div>
          <div class={'flex-1'} />
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z" fill="#ffffff"/>
          </svg>
        </Card>
      </div>
    </div>
  )
};

export default UpdateContainer;
