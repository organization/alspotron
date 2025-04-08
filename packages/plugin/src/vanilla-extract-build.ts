import type { JsPlugin } from '@farmfe/core';

type FarmVanillaExtractBuildPluginOptions = {
  rename?: (name: string) => string;
};
export const farmVanillaExtractBuildPlugin = ({
  rename = (name) => `${name.replace(/_.*/g, '')}.css`,
}: FarmVanillaExtractBuildPluginOptions = {}): JsPlugin => {
  return {
    name: 'farm-vanilla-extract-build-plugin',
    finalizeResources: {
      executor(params) {
        const entries = Object.entries(params.resourcesMap);
        const targets = entries.filter(([key, resource]) => {
          const isCss = key.endsWith('.css');
          const isVanillaExtractOutput = resource.info?.moduleIds.some((moduleId) => moduleId.endsWith('.vanilla.css'));

          return isCss && isVanillaExtractOutput;
        });
        if (targets.length === 0) return params.resourcesMap;

        return Object.fromEntries(entries.map(([key, resource]) => {
          const isMatched = targets.some(([it]) => it === key);
          const isSourceMap = targets.some(([it]) => key === `${it}.map`);

          if (isMatched) {
            const newName = rename(key);
            return [newName, {
              ...resource,
              name: newName,
            }];
          }

          if (isSourceMap) {
            const newName = `${rename(key)}.map`;
            return [newName, {
              ...resource,
              name: newName,
            }];
          }

          return [key, resource];
        }));
      },
    },
  };
};
