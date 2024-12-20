/* eslint-disable @typescript-eslint/unbound-method */
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

import { PluginProvider } from '../../common/plugins';

const root = process.env.APPDATA ?? process.env.HOME ?? '';
const URL =
  'https://raw.githubusercontent.com/organization/alspotron/master/extensions/alspotron.js';
const en = {
  setting: {
    install: {
      name: 'Install Spicetify Extension',
      description:
        'Automatically install an extension that allows Alspotron to detect Spicetify playlists.',
      label: 'Install',
    },
    alreadyInstalled: {
      name: 'Spicetify Extension installed',
      description:
        'The extension that allows Alspotron to detect Spicetify playlists is already installed.',
    },
    notInstalled: {
      name: 'Spicetify Extension not installed',
      description:
        'The extension is not installed. Click the install button to install the extension.',
    },
    reinstall: {
      name: 'Reinstall Spicetify Extension',
      description:
        'Reinstall the extension that allows Alspotron to detect Spicetify playlists. (Reinstall when music is not detected properly)',
      label: 'Reinstall',
    },
  },

  dialog: {
    cannotFindSpicetifyPath: {
      title: 'Cannot find Spicetify',
      message:
        'Spicetify was not detected. Please select the path where Spiceify itself is installed, not the extension folder.',
    },
    selectSpicetifyFolder: {
      title: 'Select the path where Spicetify is installed',
      message: 'Spicetify was not detected. Please select',
    },
    installFailed: {
      title: 'Failed to install Spicetify extension',
      message:
        'Failed to install the Spicetify extension. Please try again. Error: {{error}}',
    },
    installFailedNoSpicetify: {
      title: 'Failed to install Spicetify extension',
      message:
        'The Spicetify command does not exist or an error occurred while running it.',
    },
    installSuccess: {
      title: 'Installation successful',
      message: 'Successfully installed the extension.',
    },
  },
};
const translation: Record<string, typeof en> = {
  en,
  ko: {
    setting: {
      install: {
        name: 'Spicetify 확장 설치',
        description:
          'Spicetify의 재생목록을 Alspotron에서 감지할 수 있는 확장을 자동 설치합니다.',
        label: '설치',
      },
      alreadyInstalled: {
        name: 'Spicetify 확장 설치됨',
        description:
          'Alspotron에서 Spicetify 재생목록을 감지할 수 있는 확장이 이미 설치되어 있습니다.',
      },
      notInstalled: {
        name: 'Spicetify 확장 미설치됨',
        description:
          'Spicetify 확장이 설치되어 있지 않습니다. 설치 버튼을 눌러 확장을 설치해주세요',
      },
      reinstall: {
        name: 'Spicetify 확장 재설치',
        description:
          'Spicetify의 재생목록을 Alspotron에서 감지할 수 있는 확장을 재설치합니다. (정상적으로 음악이 인식되지 않을때 재설치 해주세요)',
        label: '재설치',
      },
    },
    dialog: {
      cannotFindSpicetifyPath: {
        title: 'Spicetify를 찾을 수 없습니다',
        message:
          'Spicetify를 감지하지 못하였습니다. extension 폴더가 아닌 Spiceify 자체가 설치된 경로를 선택해주세요',
      },
      selectSpicetifyFolder: {
        title: 'Spicetify가 설치된 경로를 선택해주세요',
        message:
          'Spicetify가 설치된 경로를 감지하지 못하였습니다. 수동으로 경로를 선택해주세요',
      },
      installFailed: {
        title: 'Spicetify의 Alsptron 확장 설치에 실패하였습니다',
        message:
          'Spicetify의 Alsptron 확장 설치에 실패하였습니다. 다시 시도해주세요. 오류 내역: {{error}}',
      },
      installFailedNoSpicetify: {
        title: 'Spicetify의 Alsptron 확장 설치에 실패하였습니다',
        message:
          'Spicetify 커맨드가 존재하지 않거나 실행중 오류가 발생하였습니다.',
      },
      installSuccess: {
        title: '확장 설치 성공',
        message: '성공적으로 확장을 설치하였습니다.',
      },
    },
  },
  ja: en,
  de: en,
};

const runner: PluginProvider = ({
  useConfig,
  useSetting,
  logger,
  on,
  Electron,
}) => {
  const [config] = useConfig();

  logger.info('Spicetify Integration plugin is loaded', config().language);
  const t = translation[config().language];

  const findSpicetifyPath = async (withSelf = true) => {
    let spicetifyPath: string | null = path.resolve(root, 'spicetify/');

    logger.debug(
      'find',
      path.resolve(root, 'spicetify/'),
      path.resolve(root, '.config/spicetify/'),
    );
    if (!fsSync.existsSync(spicetifyPath))
      spicetifyPath = path.resolve(root, '.config/spicetify/');
    if (withSelf && !fsSync.existsSync(spicetifyPath)) {
      logger.warn('Spicetify path not found');

      await Electron.dialog.showMessageBox({
        type: 'warning',
        title: t.dialog.selectSpicetifyFolder.title,
        message: t.dialog.selectSpicetifyFolder.message,
      });

      spicetifyPath = await Electron.dialog
        .showOpenDialog({
          title: t.dialog.selectSpicetifyFolder.title,
          properties: ['openDirectory'],
        })
        .then((result) => {
          if (result.canceled) return null;
          return result.filePaths[0];
        });
    }

    return spicetifyPath;
  };

  const findSpicetifyCommandPath = () => {
    let commandPath: string | null = path.resolve(
      root,
      'spicetify\\spicetify.exe',
    );
    if (!fsSync.existsSync(commandPath))
      commandPath = path.resolve(root, '.spicetify/spicetify');
    else commandPath = 'spicetify';

    return commandPath;
  };

  const onInstall = async () => {
    logger.debug('Install button clicked');

    const spicetifyPath = await findSpicetifyPath();

    if (!spicetifyPath) {
      logger.warn('Spicetify path not found');
      await Electron.dialog.showMessageBox({
        type: 'error',
        title: t.dialog.cannotFindSpicetifyPath.title,
        message: t.dialog.cannotFindSpicetifyPath.message,
      });

      return;
    }

    logger.debug('Spicetify path:', spicetifyPath);

    const response = await fetch(URL);
    const script = await response.text();
    const result = await fs
      .writeFile(`${spicetifyPath}/Extensions/alspotron.js`, script)
      .then(() => null)
      .catch((err: Error) => err);

    if (result instanceof Error) {
      logger.error('Failed to install Spicetify extension:', result);
      await Electron.dialog.showMessageBox({
        type: 'error',
        title: t.dialog.installFailed.title,
        message: t.dialog.installFailed.message.replace(
          '{{error}}',
          result.message,
        ),
      });
    }

    const command = findSpicetifyCommandPath();
    logger.debug('Spicetify command path:', command);
    const command1 = await runCommand(command, [
      'config',
      'extensions',
      'alspotron.js',
    ]).catch((code: number) => code);
    const command2 = await runCommand(command, ['apply']).catch(
      (code: number) => code,
    );

    if (command1 !== 0 || command2 !== 0) {
      logger.error(
        'Failed to install Spicetify extension:',
        command1,
        command2,
      );

      await Electron.dialog.showMessageBox({
        type: 'error',
        title: t.dialog.installFailedNoSpicetify.title,
        message: t.dialog.installFailedNoSpicetify.message,
      });
      return;
    }

    logger.info('Spicetify extension installed');

    await Electron.dialog.showMessageBox({
      type: 'info',
      title: t.dialog.installSuccess.title,
      message: t.dialog.installSuccess.message,
    });

    updateLabel(true);
  };

  const onReinstall = async () => {
    const command = await runCommand('spicetify', [
      'config',
      'extensions',
      '-alspotron.js',
    ]).catch((code: number) => code);
    if (command !== 0) {
      logger.error('Failed to reinstall Spicetify extension:', command);

      await Electron.dialog.showMessageBox({
        type: 'error',
        title: t.dialog.installFailedNoSpicetify.title,
        message: t.dialog.installFailedNoSpicetify.message,
      });
      return;
    }

    await onInstall();
    logger.info('Spicetify extension Reinstalled');
  };

  const detectInstalled = async () => {
    const spicetifyPath = await findSpicetifyPath(false);
    if (!spicetifyPath) return false;

    return fsSync.existsSync(`${spicetifyPath}/Extensions/alspotron.js`);
  };

  useSetting({
    type: 'button',
    key: 'install',
    label: t.setting.install.label,
    name: t.setting.install.name,
    description: t.setting.install.description,
  });

  const label = useSetting({
    type: 'label',
    key: 'status',
    name: t.setting.alreadyInstalled.name,
    description: t.setting.alreadyInstalled.description,
  });
  const updateLabel = (installed: boolean) => {
    if (installed) {
      label.set({
        name: t.setting.alreadyInstalled.name,
        description: t.setting.alreadyInstalled.description,
      });
    } else {
      label.set({
        name: t.setting.notInstalled.name,
        description: t.setting.notInstalled.description,
      });
    }
  };

  useSetting({
    type: 'button',
    key: 'reinstall',
    variant: 'error',
    label: t.setting.reinstall.label,
    name: t.setting.reinstall.name,
    description: t.setting.reinstall.description,
  });

  detectInstalled().then(updateLabel);

  on('button-click', (key) => {
    if (key === 'install') onInstall();
    if (key === 'reinstall') onReinstall();
  });
};

const runCommand = async (cmd: string, args: string[]) =>
  new Promise<number>((resolve, reject) => {
    const stream = spawn(cmd, args, { shell: true });

    stream.on('close', (code) => {
      if (code !== 0) reject(code ?? -1);

      resolve(code ?? 0);
    });
  });

export default runner;

/* eslint-enable @typescript-eslint/unbound-method */
