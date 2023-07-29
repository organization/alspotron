import { indentWithTab } from '@codemirror/commands';
import { sass } from '@codemirror/lang-sass';
import { keymap } from '@codemirror/view';
import { CodeMirror } from '@solid-codemirror/codemirror';
import { githubDarkInit } from '@uiw/codemirror-theme-github';
import { basicSetup, EditorView } from 'codemirror';
import { createEffect, createSignal, For, untrack } from 'solid-js';
import { Trans } from '@jellybrick/solid-i18next';

import useConfig from '../../hooks/useConfig';
import { userCSSSelectors, userCSSTransitions, userCSSVariables } from '../../utils/userCSSSelectors';

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
  const [config, setConfig] = useConfig();
  const [initialUserCSS, setInitialUserCSS] = createSignal<string | null>(null);
  createEffect(() => {
    const styleConfig = config()?.style;
    if (styleConfig?.userCSS === undefined) {
      return;
    }

    const editingDraft = untrack(initialUserCSS);
    if (editingDraft === null) {
      setInitialUserCSS(styleConfig.userCSS || '');
    }
  });

  const onUpdate = (value: string) => {
    setConfig({ style: { userCSS: value } });
  };
  const onUpdateDebounced = debounce(onUpdate, 1000);

  const [editor, setEditor] = createSignal<EditorView | null>(null);
  const githubTheme = githubDarkInit({
    settings: {
      gutterBackground: '#0d1117',
      gutterBorder: 'transparent',
    }
  });

  const userCSSTheme = EditorView.theme({
    '.cm-activeLine': {
      'border-radius': '4px',
    },

    '.cm-activeLineGutter': {
      'background': 'transparent !important',
    },

    '.cm-content': {
      'padding-right': '8px',
      'min-height': '300px',
    },

    '.cm-editor': {
      'flex': 1,
      'min-width': '0',
      'padding': '6px 3px',
    },

    '.cm-gutters': {
      'padding-left': '8px',
    },
  });

  const addCodeSnippet = (codeSnippet: string) => {
    const activeEditor = editor();
    activeEditor?.dispatch({
      changes: { from: activeEditor.state.selection.main.head, insert: codeSnippet }
    });
  };

  const buildSelectorSnippet = (selector: string) =>
    `\n${selector} {\n}`

  const addUserCSSSelector = (selectorName: string) => 
    addCodeSnippet(buildSelectorSnippet(`alspotron-${selectorName}`));

  const addUserCSSTransition = (transitionName: string) => {
    const transitionClasses = [
      `alspotron-${transitionName}-enter`,
      `alspotron-${transitionName}-exit-to`,
      `alspotron-${transitionName}-move`,
      `alspotron-${transitionName}-enter-active, alspotron-${transitionName}-exit-active`
    ];

    addCodeSnippet(transitionClasses.map(buildSelectorSnippet).join('\n'));
  };

  const addUserCSSVariable = (variableName: string) =>
    addCodeSnippet(`var(${variableName})`);

  return (
    <>
      <div>
        <b><Trans key={'setting.user-css-warning.bold'} /></b> <Trans key={'setting.user-css-warning.0'} />
        <br />
        <br />
        <Trans key={'setting.user-css-warning.1'} />
      </div>

      <div class="overflow-auto fluent-scrollbar pb-2 mt-10">
        <div class="flex flex-wrap gap-1 min-w-[750px]">
          <For each={Object.keys(userCSSSelectors)}>
            {(selectorName) => (
              <button class="btn-text flex-auto" type="button" onClick={() => addUserCSSSelector(selectorName)}>
                {selectorName}
              </button>
            )}
          </For>

          <For each={Object.keys(userCSSTransitions)}>
            {(transitionName) => (
              <button class="btn-text flex-auto" type="button" onClick={() => addUserCSSTransition(transitionName)}>
                {transitionName}
              </button>
            )}
          </For>

          <For each={Object.entries(userCSSVariables)}>
            {([variableName, variableValue]) => (
              <button class="btn-text flex-auto" type="button" onClick={() => addUserCSSVariable(variableValue)}>
                {variableName}
              </button>
            )}
          </For>
        </div>
      </div>

      <CodeMirror
        extensions={[basicSetup, sass(), keymap.of([indentWithTab])]}
        theme={[githubTheme, userCSSTheme]}
        value={initialUserCSS() ?? ''}
        onValueChange={onUpdateDebounced}
        onEditorMount={setEditor}
        class="mt-10 min-h-[300px] rounded-md overflow-hidden"
      />
    </>
  );
};

export default UserCSSEditor;
