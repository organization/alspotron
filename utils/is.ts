export const isWin32 = () => process.platform === 'win32';
export const isXfce = () => process.env.DESKTOP_SESSION === 'xfce';
export const isMacOS = () => process.platform === 'darwin';
