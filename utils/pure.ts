export const pure = <T>(target: T): T =>
  JSON.parse(JSON.stringify(target)) as T;
