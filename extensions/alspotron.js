// NAME: Alspotron Companion
// AUTHOR: Khinenw
// DESCRIPTION: Get current playing information to show in Alspotron

(function Alspotron() {
  const LyricResolvers = {
    v2(uri) {
      return Spicetify.CosmosAsync
        .get(`wg://lyrics/v1/track/${uri.id}`)
        .then(payload => payload.lines)
        .catch(() => {
          return [];
        });
    },

    get current() {
      return this['v2'];
    }
  };

  const getLyric = async () => {
    const uri = Spicetify.URI.from(Spicetify.Player.data.track.uri);
    const lines = await LyricResolvers.current(uri);
    return lines.reduce((lyric, line) => {
      lyric[line.time] = line.words.map(v => v.string).filter(v => v);
      return lyric;
    }, {});
  };

  let previousInfo = {};
  const getInfo = async () => {
    const uri = Spicetify.Player.data.track.uri;
    let imageUrl = Spicetify.Player.data.track.metadata.image_xlarge_url;
    if (imageUrl?.indexOf('localfile') === -1) {
      imageUrl = `https://i.scdn.co/image/${imageUrl.substring(imageUrl.lastIndexOf(":") + 1)}`;
    }

    const info = {
      status: 'playing',
      title: Spicetify.Player.data.track.metadata.title,
      artists: [Spicetify.Player.data.track.metadata.artist_name],
      cover_url: imageUrl,
      uri: uri,
      duration: Spicetify.Player.getDuration(),
      progress: Spicetify.Player.getProgress()
    };

    if (!Spicetify.Player.isPlaying()) {
      info.status = 'stopped';
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          ...info
        }
      })
    });
  };

  setInterval(sendInfo, 3000);
})();
