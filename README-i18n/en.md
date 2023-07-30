# Alspotron <a href="https://github.com/organization/alspotron/releases/latest"><img src="https://img.shields.io/github/downloads/organization/alspotron/total.svg"/></a>

### Fully-customizable *Spotify*, *YouTube Music* lyrics viewer

> Alspotron shows lyrics of music played on music streaming platforms such as `Spotify` or `YouTube Music`. \
> If the lyrics don't exist, `Alspotron` will display `Spotify`'s built-in lyrics. (**Only when playing with `Spotify`**)

### Screenshots

-   Here are some example screenshots of lyrics displayed with Alspotron. You can freely adjust the position of the lyrics.

|                         Spotify                        |                                                        Youtube Music                                                        |                         Game Overlay (tested game: Overwatch)                       |
| :----------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------: |
| ![Spotify Screenshot](https://i.imgur.com/0JJMhaU.png) | ![YouTube Music Screenshot](https://github.com/organization/alspotron/assets/16558115/fc22323e-d0b2-4abc-882e-2281c13f4cf4) | ![Overlay Screenshot](https://github.com/organization/alspotron/assets/16558115/7bb95071-b8f7-45e1-af59-02e1586d5dcc) |

## Installation

### Spotify

#### 1.  [Install Spicetify](https://github.com/khanhas/spicetify-cli)

  -   Follow the above link to install `Spicetify`.

#### 2.  [Download Alspotron](https://github.com/organization/alspotron/releases)

  -   Install the latest version of Alspotron from Releases. (**WARNING** : Portable version can't save settings.)
  -   If you're using Windows, you need to install `Alspotron-Web-Setup-[version].exe`.

#### 3.  Install Alspotron Companion
  -   [Download `alsptron.js`](https://powernukkit.github.io/DownGit/#/home?directFile=1&url=https://github.com/organization/alspotron/blob/master/extensions/alspotron.js) and place it in [Extensions folder in install location of `Spicetify`.](https://spicetify.app/docs/advanced-usage/extensions/)
  -   Add `alspotron.js` extension to `Spicetify` with below command.
      ```
      spicetify config extensions alspotron.js
      ```
  -   After using the command below, Spotify will restart and alspotron.js extension will be applied.
      ```
      spicetify apply
      ``` 
---
### YouTube Music

#### 1.  [Install YouTube Music Desktop](https://github.com/th-ch/youtube-music/releases)

  -   Follow the above link to install `Youtube Music Desktop`.

#### 2.  Start `Youtube Music Desktop`, select `plugins` in menu and enable `tuna-obs`
#### 3.  [Download Alspotron](https://github.com/organization/alspotron/releases)

  -   Install latest version of Alspotron from Releases. (**WARNING** : Portable version can't save settings.)
  -   If you're using Windows, you need to install `Alspotron-Web-Setup-[version].exe`.

### WARNING : For YouTube Music users

  -  There is an [issue](https://github.com/organization/alspotron/issues/1) related to adblocker.
  -  You **MUST** disable `adblocker` plugin or change adblocker to `in-player`.

---
### Other platforms (e.g. Apple Music)

#### 1.  Follow [link](https://github.com/univrsal/tuna) to install browser extension.
#### 2.  [Download Alspotron](https://github.com/organization/alspotron/releases)
#### 3.  Install Alspotron Companion
  -   Install latest version of Alspotron from Releases. (**WARNING** : Portable version can't save settings.)
  -   If you're using Windows, you need to install `Alspotron-Web-Setup-[version].exe`.

### How to use

#### Windows, Linux

-  Start `Alspotron`.

#### macOS

-   Start Alspotron with command
    ```
    xattr -cr /Applications/Alspotron.app
    ```
    or start it with this [guide](https://www.macworld.com/article/672947/how-to-open-a-mac-app-from-an-unidentified-developer.html).

## Config

1.  Preferences

|                                        Change Lyrics Location                                            |                                                   Change Theme                                           |
| :------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/organization/alspotron/assets/16558115/d09cc0ec-cab7-4fd4-89fe-0836699e352a) | ![image](https://github.com/organization/alspotron/assets/16558115/2e4ae98b-559e-4e8d-b3bb-f5e3081bcf88) |

2.  You can choose a different lyrics for now playing song via `Select Lyrics` menu on the tray icon.

|                                  Search other lyrics on now playing songs.                                   |
| :------------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/organization/alspotron/assets/16558115/0315c44e-27cb-4882-a7d8-e6e91531790a) |

## Migration from Alspotify

Refer this [Documentation](https://github.com/organization/alspotron/blob/master/MIGRATION_FROM_ALSPOTIFY.md)

## LICENSE

`Apache License 2.0`

## Special thanks

-   [Khinenw](https://github.com/HelloWorld017)'s **[Alspotify](https://github.com/HelloWorld017/alspotify)**
