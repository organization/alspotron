import { Match, Switch, Show } from 'solid-js';

import { Plugin, PluginLog as PluginLogType } from '../../../common/plugins';

export interface PluginLogProps {
  log: PluginLogType;
  showPlugin?: Plugin;
}
const PluginLog = (props: PluginLogProps) => {
  return (
    <div class={'w-full flex justify-start items-center gap-1 font-mono'}>
      <Show when={props.showPlugin}>
        <span
          class={
            'text-primary-500 overflow-visible whitespace-nowrap font-mono'
          }
        >
          [{props.showPlugin?.name}]
        </span>
      </Show>
      <span
        class={'text-primary-300 overflow-visible whitespace-nowrap font-mono'}
      >
        [{new Date(props.log.time)?.toISOString()}]
      </span>
      <Switch>
        <Match when={props.log.type === 'error'}>
          <span
            class={'text-red-500 overflow-visible whitespace-nowrap font-mono'}
          >
            [ERROR]
          </span>
        </Match>
        <Match when={props.log.type === 'warn'}>
          <span
            class={
              'text-yellow-500 overflow-visible whitespace-nowrap font-mono'
            }
          >
            [WARN]
          </span>
        </Match>
        <Match when={props.log.type === 'info'}>
          <span
            class={'text-blue-500 overflow-visible whitespace-nowrap font-mono'}
          >
            [INFO]
          </span>
        </Match>
        <Match when={props.log.type === 'debug'}>
          <span
            class={
              'text-slate-500 overflow-visible whitespace-nowrap font-mono'
            }
          >
            [DEBUG]
          </span>
        </Match>
        <Match when={props.log.type === 'log'}>
          <span>[INFO]</span>
        </Match>
      </Switch>
      <span class={'overflow-visible whitespace-nowrap font-mono'}>
        {props.log.message}
      </span>
    </div>
  );
};

export default PluginLog;
