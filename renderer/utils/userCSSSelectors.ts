const randomId = () => Math.random().toString(36).slice(2);

export const userCSSSelectors = {
  'wrapper': randomId(),
  'lyrics-item': randomId(),
  'lyrics': randomId(),
  'nowplaying': randomId(),
  'nowplaying-progress': randomId(),
  'nowplaying-cover': randomId(),
  'nowplaying-marquee': randomId(),
  'nowplaying-title': randomId(),
  'nowplaying-artist': randomId()
};

export const userCSSTransitions = {
  'transition-lyric': 'lyric-custom'
};
