import type { JsPlugin } from '@farmfe/core';

export const farmVanillaExtractBuildPlugin = (): JsPlugin => {
  return {
    name: 'farm-vanilla-extract-build-plugin',
    finalizeResources: {
      executor(params) {
        const entries = Object.entries(params.resourcesMap);
        const target = entries.find(([key]) => key.endsWith('.css'));
        if (!target) return params.resourcesMap;

        const [name, resource] = target;
        const isVanillaExtractOutput = resource.info?.moduleIds.some((moduleId) => moduleId.endsWith('.vanilla.css'));

        if (!isVanillaExtractOutput) return params.resourcesMap;

        return Object.fromEntries(entries.map(([key, resource]) => {
          if (key === name) {
            return ['vanilla-extract.css', {
              ...resource,
              name: 'vanilla-extract.css',
            }];
          }

          return [key, resource];
        }));
      },
    },
  };
};
