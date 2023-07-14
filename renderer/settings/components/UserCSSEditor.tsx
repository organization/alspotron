import { sass } from '@codemirror/lang-sass';
import { oneDark } from '@codemirror/theme-one-dark';
import { CodeMirror } from '@solid-codemirror/codemirror';
import { basicSetup } from 'codemirror';
import useConfig from '../../hooks/useConfig';

const debounce = <P extends unknown[]>(fn: (...args: P) => void, timeout: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: P) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => fn(...args), timeout);
  }
};

const UserCSSEditor = () => {
  const [config, setConfig] = useConfig()
  const onUpdate = (value: string) => void setConfig({ style: { userCSS: value } });
  const onUpdateDebounced = debounce(onUpdate, 1000);

  return (
    <CodeMirror
      extensions={[basicSetup, sass()]}
      theme={oneDark}
      value={config()?.style.userCSS ?? ''}
      onValueChange={onUpdateDebounced}
    />
  );
};

export default UserCSSEditor;
