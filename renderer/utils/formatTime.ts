export const formatTime = (ms: number) => {
  const seconds = ~~(ms / 1000);
  const minutes = ~~(seconds / 60);
  const hours = ~~(minutes / 60);

  return `${
    hours.toString().padStart(2, '0')
  }:${
    (minutes % 60).toString().padStart(2, '0')
  }:${
    (seconds % 60).toString().padStart(2, '0')
  }`;
};
