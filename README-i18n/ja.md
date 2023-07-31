# Alspotron <a href="https://github.com/organization/alspotron/releases/latest"><img src="https://img.shields.io/github/downloads/organization/alspotron/total.svg"/></a>

### カスタマイズしやすい「Spotify」・「YouTube Music」歌詞インジケータ

> `Spotify`や`YouTube Music`などの音楽プレーヤーで再生されている曲の”Alsong”の歌詞を画面に表示します。\
> 「`Alsong`」の歌詞が存在しない場合、Spotifyの組み込み歌詞を表示します。（**Spotify専用**）

### Screenshot

-   動画の上に歌詞を表示して撮影した例で、実際には位置を自由に設定することができます。

|                        Spotify                         |                                                        Youtube Music                                                        |                                         Game Overlay (tested game: Overwatch)                                         |
|:------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------:|
| ![Spotify Screenshot](https://i.imgur.com/0JJMhaU.png) | ![YouTube Music Screenshot](https://github.com/organization/alspotron/assets/16558115/fc22323e-d0b2-4abc-882e-2281c13f4cf4) | ![Overlay Screenshot](https://github.com/organization/alspotron/assets/16558115/7bb95071-b8f7-45e1-af59-02e1586d5dcc) |

## Installation

次は「`Alspotron`」のインストール方法です。

### Spotify

#### 1.  [Spicetify インストール](https://github.com/khanhas/spicetify-cli)

  -   上記リンクの指示に従って「`Spicetify`」をインストールしてください。

#### 2.  [Alspotronのダウンロード](https://github.com/organization/alspotron/releases)

  -   上記リンクから最新バージョンの「Alspotron」をダウンロードして実行してください。
  -   Windows ユーザの場合は、「`Alspotron-Web-Setup-[version].exe`」をダウンロードしてください。

#### 3.  Alspotron Companion インストール

  -   Spicetifyの「[`Extensions`](https://spicetify.app/docs/advanced-usage/extensions/)」フォルダに「[`alspotron.js`](https://powernukkit.github.io/DownGit/#/home?directFile=1&url=https://github.com/organization/alspotron/blob/master/extensions/alspotron.js)」をダウンロードしてください。
  -   次に、「`specity config extensions alspotron.js`」コマンドを実行して、「`alspotron.js`」を追加します
  -   "`specify apply`" コマンドを使用すれば、「Spotify」がリブートして `alspotron extension` を有効にします。

---

### YouTube Music

#### 1.  [YouTube Music Desktop インストール](https://github.com/th-ch/youtube-music/releases)

  -   上記リンクの指示に従って「`Youtube Music Desktop`」をインストールしてください。

#### 2.  「`YouTube Music Desktop`」を実行し、トップメニューから「`plugins`」を選択し、「`tuna-obs`」をアクティブにします。

#### 3.  [Alspotronのダウンロード](https://github.com/organization/alspotron/releases)

-   上記リンクから最新バージョンの「Alspotron」をダウンロードして実行してください。
-   Windows ユーザの場合は、「`Alspotron-Web-Setup-[version].exe`」をダウンロードしてください。

#### 「`YouTube Music Desktop`」のユーザーは以下の説明を読んでください。

[このリンク](https://github.com/organization/alspotron/issues/1)を参照してかならず「`adblocker`」を無効にするか、「`in-player adblock`」に切り替えりしてください。

---

### 以外のプレーヤー (e.g. Apple Music)

#### 1.  [tuna-obs](https://github.com/univrsal/tuna)を参考にブラウザ拡張機能の設定を完了してください。
#### 2.  [Alspotronのダウンロード](https://github.com/organization/alspotron/releases)
  -   上記リンクから最新バージョンの「Alspotron」をダウンロードして実行してください。
  -   Windows ユーザの場合は、「`Alspotron-Web-Setup-[version].exe`」をダウンロードしてください。

### 最後のステップ

#### Windows, Linux

-   「`Alspotron`」を実行

#### macOS

-   「`xattr -cr /Applications/Alspotron.app`」コマンドを実行するか、または[該当リンク](https://iboysoft.com/jp/news/app-is-damaged-and-cannot-be-opened.html)を参考に実行してください。

## Config

1.  設定

|                                                   位置設定                                                   |                                                  テーマ設定                                                   |
|:--------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------:|
| ![Alspotron Settings 2023-07-31 오전 8_08_01](https://github.com/organization/alspotron/assets/16558115/66ddaf45-e46a-47da-b474-b67420300c29) | ![image](https://github.com/organization/alspotron/assets/16558115/46bfb308-8821-414e-a57c-e875ebe8fc99) |

2.  トレイ アイコンの「`歌詞選択`」を選択して、現在再生中の曲の歌詞を別の歌詞に置き換えることができます。

|                                          タイトルを検索した後、別の歌詞を適用した例                                           |
|:--------------------------------------------------------------------------------------------------------:|
| ![image](https://github.com/organization/alspotron/assets/16558115/9a28d479-b59d-4ea8-8564-4694dde5157a) |

## Migration from Alspotify

[ドキュメント](https://github.com/organization/alspotron/blob/master/MIGRATION_FROM_ALSPOTIFY.md)を参照してください。

## LICENSE

`Apache License 2.0`

## Special thanks

-   [Khinenw](https://github.com/HelloWorld017)'s **[Alspotify](https://github.com/HelloWorld017/alspotify)**
