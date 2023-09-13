export const errorSync = <Return>(fn: () => Return): [Return, null] | [null, unknown] => {
  try {
    const result = fn();

    return [result, null];
  } catch (e) {
    return [null, e];
  }
};

export const errorAsync = async <Return>(fn: () => Promise<Return>): Promise<[Return, null] | [null, unknown]> => {
  try {
    const result = await fn();

    return [result, null];
  } catch (e) {
    return [null, e];
  }
};
