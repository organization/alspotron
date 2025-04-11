import { SettingPanel } from '../../components/SettingPanel';
import { GeneralSetting } from '../../config';

export const GeneralPage = () => {
  return (
    <SettingPanel
      name={'일반'}
      groups={GeneralSetting}
    />
  );
};
