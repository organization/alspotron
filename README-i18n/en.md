# Alspotron <a href="https://github.com/organization/alspotron/releases/latest"><img src="https://img.shields.io/github/downloads/organization/alspotron/total.svg"/></a>

### Fully customizable *Spotify*, and *YouTube Music* lyrics viewer

> Alspotron shows lyrics of music played on music streaming platforms such as `Spotify` or `YouTube Music`. \
> If the lyrics don't exist, `Alspotron` will display `Spotify`'s built-in lyrics. (**Only when playing with `Spotify`**)

### Screenshots

-   Here are some example screenshots of lyrics displayed with Alspotron. You can freely adjust the position of the lyrics.

|                        Spotify                         |                                                        Youtube Music                                                        |                                         Game Overlay (tested game: Overwatch)                                         |
|:------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------:|
| ![Spotify Screenshot](https://i.imgur.com/0JJMhaU.png) | ![YouTube Music Screenshot](https://github.com/organization/alspotron/assets/16558115/fc22323e-d0b2-4abc-882e-2281c13f4cf4) | ![Overlay Screenshot](https://github.com/organization/alspotron/assets/16558115/7bb95071-b8f7-45e1-af59-02e1586d5dcc) |

## Installation

### Spotify

#### 1.  [Install Spicetify](https://github.com/khanhas/spicetify-cli)

  -   Follow the above link to install `Spicetify`.

#### 2.  [Download Alspotron](https://github.com/organization/alspotron/releases)

  -   Install the latest version of Alspotron from Releases.
  -   If you're using Windows, you need to install `Alspotron-Web-Setup-[version].exe`.

#### 3.  Install Alspotron Companion
  -   [Download `alspotron.js`](https://powernukkit.github.io/DownGit/#/home?directFile=1&url=https://github.com/organization/alspotron/blob/master/extensions/alspotron.js) and place it in [Extensions folder in install location of `Spicetify`.](https://spicetify.app/docs/advanced-usage/extensions/)
  -   Add `alspotron.js` extension to `Spicetify` with below command.
      ```bash
      spicetify config extensions alspotron.js
      ```
  -   After using the command below, Spotify will restart and alspotron.js extension will be applied.
      ```bash
      spicetify apply
      ``` 
      
---

### YouTube Music

#### 1.  [Install YouTube Music Desktop](https://github.com/organization/youtube-music-next/releases)

  -   Follow the above link to install `Youtube Music Desktop`.

#### 2.  Start `Youtube Music Desktop`, select `plugins` in menu and enable `tuna-obs`
#### 3.  [Download Alspotron](https://github.com/organization/alspotron/releases)

  -   Install latest version of Alspotron from Releases.
  -   If you're using Windows, you need to install `Alspotron-Web-Setup-[version].exe`.

---
### Other platforms (e.g. Apple Music)

#### 1.  Follow [link](https://github.com/univrsal/tuna) to install browser extension (tampermonkey script).
#### 2.  [Download Alspotron](https://github.com/organization/alspotron/releases)
  -   Install latest version of Alspotron from Releases.
  -   If you're using Windows, you need to install `Alspotron-Web-Setup-[version].exe`.

---

### How to use

#### Windows, Linux

-  Start `Alspotron`.

#### macOS

-   Start Alspotron with command
    ```bash
    xattr -cr /Applications/Alspotron.app
    ```
    or start it with this [guide](https://www.macworld.com/article/672947/how-to-open-a-mac-app-from-an-unidentified-developer.html).

## Config

1.  Preferences

|                                          Change Lyrics Location                                          |                                           Change Theme Setting                                           |
|:--------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------:|
| ![image](https://github.com/organization/alspotron/assets/16558115/e770250a-d76d-4ba8-9765-774d0ac9b1af) | ![image](https://github.com/organization/alspotron/assets/16558115/3b049940-6ad9-48c0-8370-7773c8e33f82) |

2.  You can choose a different lyrics for now playing song via `Select Lyrics` menu on the tray icon.

|                                Search other lyrics on now playing songs.                                 |
|:--------------------------------------------------------------------------------------------------------:|
| ![Editing alspotron_README-i18n_en md at feat_i18n · organization_alspotron - Chrome 2023-07-31 오전 8_02_09](https://github.com/organization/alspotron/assets/16558115/6604d1b5-74c5-48c8-8912-afdbcdfa3700) |

## Plugin
Refer this [Documentation](https://github.com/organization/alspotron/wiki/Plugin)

Refer this [Example](https://github.com/organization/alspotron/tree/master/example/alspotron-plugin)

## Migration from Alspotify

Refer this [Documentation](https://github.com/organization/alspotron/blob/master/MIGRATION_FROM_ALSPOTIFY.md)

## LICENSE

`Apache License 2.0`

## Special thanks

-   [Khinenw](https://github.com/HelloWorld017)'s **[Alspotify](https://github.com/HelloWorld017/alspotify)**
