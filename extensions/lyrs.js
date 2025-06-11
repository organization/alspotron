// NAME: Lyrs Companion
// AUTHOR: Khinenw
// DESCRIPTION: Get current playing information to show in Lyrs

(function Lyrs() {
  const LyricResolvers = {
    v2(uri) {
      return Spicetify.CosmosAsync.get(
        `https://spclient.wg.spotify.com/color-lyrics/v2/track/${uri.id}?format=json&vocalRemoval=false&market=from_token`,
      )
        .then((payload) =>
          payload.lyrics.syncType === 'LINE_SYNCED'
            ? payload.lyrics.lines
            : Promise.reject('No synced lyrics'),
        )
        .catch(() => {
          return [];
        });
    },

    get current() {
      return this['v2'];
    },
  };

  const getLyric = async () => {
    const uri = Spicetify.URI.from(Spicetify.Player.data.item.uri);
    const lines = await LyricResolvers.current(uri);
    return lines.reduce((lyric, line) => {
      lyric[line.startTimeMs] = [line.words];
      return lyric;
    }, {});
  };

  let previousInfo = {};
  const getInfo = async () => {
    const uri = Spicetify.Player.data.item.uri;
    let imageUrl = Spicetify.Player.data.item.metadata.image_xlarge_url;
    if (imageUrl?.indexOf('localfile') === -1) {
      imageUrl = `https://i.scdn.co/image/${imageUrl.substring(imageUrl.lastIndexOf(':') + 1)}`;
    }

    const info = {
      status: 'playing',
      title: Spicetify.Player.data.item.metadata.title,
      artists: [Spicetify.Player.data.item.metadata.artist_name],
      cover_url: imageUrl,
      uri: uri,
      duration: Spicetify.Player.getDuration(),
      progress: Spicetify.Player.getProgress(),
    };

    if (!Spicetify.Player.isPlaying()) {
      info.status = 'paused';
      return info;
    }

    if (previousInfo.uri !== uri) {
      info.lyrics = await getLyric();
    }

    return info;
  };

  const sendInfo = async () => {
    const info = await getInfo();
    previousInfo = info;

    await fetch('http://localhost:1608/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          ...info,
        },
      }),
    });
  };

  setInterval(sendInfo, 3000);
})();
