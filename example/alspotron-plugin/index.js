const titleParserRegex =
  /(?:[[({【]([^\])}】]+)[\])}】]\s*)*([^[({【「\])}】」\-/]+)(?:[[({【]([^\])}】]+)[\])}】]\s*)*/g;

const parse = (data) => {
  let artist = data.artist;
  let title;

  const matchResult = Array.from(data.title.matchAll(titleParserRegex));
  if (matchResult) {
    if (matchResult.length > 1) {
      if (matchResult[0]?.[1]) {
        artist = matchResult[0][1].trim();
        title = matchResult[0][2].trim();
      } else {
        if (matchResult[0]?.[2]) artists = matchResult[0][2].trim();
        title = matchResult[1][2].trim();
      }
    } else {
      if (matchResult[0]?.[1]) artists = matchResult[0][1].trim();
      title = matchResult[0][2].trim();
    }
  }

  return [artists, title];
};

const translation = {
  ko: {
    ignoreArtist: {
      name: '아티스트 무시',
      description: '추출된 아티스트를 사용하지 않고 음악을 검색합니다.',
    },
    swap: {
      name: '아티스트/제목 바꾸기',
      description: '추출된 제목과 아티스트를 변경하여 음악을 검색합니다.',
    },
  },
  en: {
    ignoreArtist: {
      name: 'Ignore Artist',
      description: 'Search music without using extracted artist.',
    },
    swap: {
      name: 'Swap Artist/Title',
      description: 'Search music by swapping extracted artist and title.',
    },
  },
};

module.exports = ({ useConfig, useSetting, useOverride, logger }) => {
  const [config] = useConfig();

  logger.info('improve music search plugin is loaded', config().language);

  const ignoreArtist = useSetting({
    type: 'boolean',
    key: 'ignore-artist',
    name:
      translation[config().language]?.ignoreArtist.name ??
      translation.en.ignoreArtist.name,
    description:
      translation[config().language]?.ignoreArtist.description ??
      translation.en.ignoreArtist.description,
  });

  const swap = useSetting({
    type: 'boolean',
    key: 'swap',
    name: translation[config().language]?.swap.name ?? translation.en.swap.name,
    description:
      translation[config().language]?.swap.description ??
      translation.en.swap.description,
  });

  useOverride('search-lyrics', (fn, artist, title, options) => {
    const result = parse({ artist, title });

    const newArgs = [result[0], result[1], options];
    if (swap()) {
      newArgs[0] = result[1];
      newArgs[1] = result[0];
    }
    if (ignoreArtist()) newArgs[0] = '';

    logger.debug('change search', [artist, title], '->', [
      newArgs[0],
      newArgs[1],
    ]);
    fn(...newArgs);
  });
};
