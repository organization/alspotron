# Alspotron <a href="https://github.com/organization/alspotron/releases/latest"><img src="https://img.shields.io/github/downloads/organization/alspotron/total.svg"/></a>

### Fully-customizable *Spotify*, *YouTube Music* lyrics viewer [(English README)](https://github.com/organization/alspotron/blob/master/README-i18n/en.md)

> Shows the lyrics of the song playing on a music player like `Spotify` or `YouTube Music`. \
> If the lyric doesn't exist, `Alspotron` will display `Spotify`'s built-in lyrics. (**Only when playing with `Spotify`**)

### Screenshot

-   This shows how Alspotron display lyrics to applications. location of lyrics can be freely adjusted.

|                         Spotify                        |                                                        Youtube Music                                                        |                         Game Overlay (tested game: Overwatch)                       |
| :----------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------: |
| ![Spotify Screenshot](https://i.imgur.com/0JJMhaU.png) | ![YouTube Music Screenshot](https://github.com/organization/alspotron/assets/16558115/fc22323e-d0b2-4abc-882e-2281c13f4cf4) | ![Overlay Screenshot](https://github.com/organization/alspotron/assets/16558115/7bb95071-b8f7-45e1-af59-02e1586d5dcc) |

## Installation

### Spotify

#### 1.  [Install Spicetify](https://github.com/khanhas/spicetify-cli)

  -   Follow the link's description to install `Spicetify`.

#### 2.  [Download Alspotron](https://github.com/organization/alspotron/releases)

  -   Install latest version of Alspotron from Releases. (warning : Portable version can't save settings.)
  -   for Windows users, there is `Alspotron-Web-Setup-[version].exe` for Windows.

#### 3.  Install Alspotron Companion
  -   [Download `alsptron.js`](https://powernukkit.github.io/DownGit/#/home?directFile=1&url=https://github.com/organization/alspotron/blob/master/extensions/alspotron.js) and place it in [Extensions folder in install location of Spicetify.](https://spicetify.app/docs/advanced-usage/extensions/)
  -   Add `alspotron.js` extension to spicetify with command.
      ```
      spicetify config extensions alspotron.js
      ```
  -   After apply command below, Spotify will restart and extension will be applied.
      ```
      spicetify apply
      ``` 
---
### YouTube Music

#### 1.  [Install YouTube Music Desktop](https://github.com/th-ch/youtube-music/releases)

  -   Follow the link's description to install `Youtube Music Desktop`.

#### 2.  Start `Youtube Music Desktop`, Enter `plugins` in menu and enable `tuna-obs`
#### 3.  [Download Alspotron](https://github.com/organization/alspotron/releases)

  -   Install latest version of Alspotron from Releases. (warning : Portable version can't save settings.)
  -   for Windows users, there is `Alspotron-Web-Setup-[version].exe` for Windows.


### WARNING : For YouTube Music users

  -  There is [issue](https://github.com/organization/alspotron/issues/1) about adblocker.
  -  **Must** disable `adblocker` plugin or change adblocker to `in-player`.

---
### etc. (e.g. Apple Music)

1.  Follow [link](https://github.com/univrsal/tuna) to install browser extension.
2.  [Download Alspotron](https://github.com/organization/alspotron/releases)
3.  
  -   Install latest version of Alspotron from Releases. (warning : Portable version can't save settings.)
  -   for Windows users, there is `Alspotron-Web-Setup-[version].exe` for Windows.

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

1.  Preference

|                                        Change Lyrics Location                                            |                                                   Change Theme                                           |
| :------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/organization/alspotron/assets/16558115/d09cc0ec-cab7-4fd4-89fe-0836699e352a) | ![image](https://github.com/organization/alspotron/assets/16558115/2e4ae98b-559e-4e8d-b3bb-f5e3081bcf88) |

2.  Other lyrics for current playing song can be selected by `Select Lyrics` on tray icon.

|                                  Search other lyrics on current songs.                                   |
| :------------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/organization/alspotron/assets/16558115/0315c44e-27cb-4882-a7d8-e6e91531790a) |

## Migration from Alspotify

Refer this [Documentation](https://github.com/organization/alspotron/blob/master/MIGRATION_FROM_ALSPOTIFY.md)

## LICENSE

`Apache License 2.0`

## Special thanks

-   [Khinenw](https://github.com/HelloWorld017)'s **[Alspotify](https://github.com/HelloWorld017/alspotify)**
