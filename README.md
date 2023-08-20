# <img src="https://github.com/organization/alspotron/assets/16558115/447a957e-faf2-4759-8884-5d7b04fb1fbb" width="2%" /> Alspotron <a href="https://github.com/organization/alspotron/releases/latest"><img src="https://img.shields.io/github/downloads/organization/alspotron/total.svg"/></a>

### 커스텀이 편리한 *Spotify*, *YouTube Music* 가사 표시기
### Fully-customizable *Spotify*, *YouTube Music* lyrics viewer [(English README)](https://github.com/organization/alspotron/blob/master/README-i18n/en.md)
### カスタマイズしやすい「*Spotify*」・「*YouTube Music*」歌詞インジケータ [(日本語 README)](https://github.com/organization/alspotron/blob/master/README-i18n/ja.md)
### Vollständig anpassbarer Lyrics-Viewer für Spotify und YouTube Music [(Deutsch README)](https://github.com/organization/alspotron/blob/master/README-i18n/de.md)


> `스포티파이` 혹은 `유튜브 뮤직`등의 `뮤직 플레이어`에서 재생중인 노래의 알송 가사를 화면에 표시해줍니다.\
> 알송 가사가 존재하지 않는 경우, 스포티파이의 내장 가사를 표시합니다. (**스포티파이로 재생하는 경우만 해당**)

### Screenshot

-   동영상 위에 가사가 표시되게 촬영한 예시 이미지이며, 실제로는 위치를 자유롭게 선택할 수 있습니다.

|                        Spotify                         |                                                        Youtube Music                                                        |                                         Game Overlay (tested game: Overwatch)                                         |
|:------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------:|
| ![Spotify Screenshot](https://i.imgur.com/0JJMhaU.png) | ![YouTube Music Screenshot](https://github.com/organization/alspotron/assets/16558115/fc22323e-d0b2-4abc-882e-2281c13f4cf4) | ![Overlay Screenshot](https://github.com/organization/alspotron/assets/16558115/7bb95071-b8f7-45e1-af59-02e1586d5dcc) |

## Installation

설치 방법은 다음과 같습니다.

### Spotify

#### 1.  [Spicetify 설치](https://github.com/khanhas/spicetify-cli)  
  -   다음 링크의 지시사항에 따라 `Spicetify`를 설치해주세요.

#### 2.  [Alspotron 다운로드](https://github.com/organization/alspotron/releases) 

  -   Release 탭에서 최신버전의 Alspotron을 다운로드한 후 설치해주세요. (포터블 버전은 설정이 저장되지 않습니다)
  -   Windows 사용자께서는 `Alspotron-Web-Setup-[version].exe`을 다운로드 받으시면 됩니다.

#### 3.  Alspotron Companion 설치  

  -   [Spicetify 설치 위치의 Extensions 폴더에](https://spicetify.app/docs/advanced-usage/extensions/) [`alspotron.js`를 다운로드 받아](https://powernukkit.github.io/DownGit/#/home?directFile=1&url=https://github.com/organization/alspotron/blob/master/extensions/alspotron.js) 넣어주세요.
  -   아래 명령어를 사용하여 `alspotron.js` 확장을 `Spicetify`에 추가합니다. 
      ```bash
      spicetify config extensions alspotron.js
      ```
  -   그 뒤, 아래 명령을 사용하면 `Spotify`가 다시 시작되고 `alspotron.js` 확장 프로그램이 적용됩니다.
      ```bash
      spicetify apply
      ``` 

---

### YouTube Music

1.  [YouTube Music Desktop 설치](https://github.com/th-ch/youtube-music/releases)

    -   다음 링크의 지시사항에 따라 `Youtube Music Desktop`을 설치해주세요.

2.  `Youtube Music Desktop`을 실행하고, 상단 메뉴의 `plugins`를 클릭한 뒤 `tuna-obs`를 활성화해주세요.

3.  [Alspotron 다운로드](https://github.com/organization/alspotron/releases)  

    -   Release 탭에서 최신버전의 Alspotron을 다운로드한 후 설치해주세요.
    -   Windows 사용자께서는 `Alspotron-Web-Setup-[version].exe`을 다운로드 받으시면 됩니다.

#### YouTube Music 사용자는 주의!

**반드시** [이 링크](https://github.com/organization/alspotron/issues/1)를 참고하여 `adblocker` 플러그인을 비활성화하거나, `in-player` adblocker로 전환해주세요.

---

### 그 외 플레이어 (e.g. Apple Music)

#### 1.  [tuna-obs](https://github.com/univrsal/tuna)를 참고하여 브라우저 확장 프로그램을 (tempermonkey script) 설치해주세요.
#### 2.  [Alspotron 다운로드](https://github.com/organization/alspotron/releases)
  -   Release 탭에서 최신버전의 Alspotron을 다운로드한 후 설치해주세요. 
  -   Windows 사용자께서는 `Alspotron-Web-Setup-[version].exe`을 다운로드 받으시면 됩니다.

---

### 마지막 단계

#### Windows, Linux

-   `Alspotron` 실행

#### macOS

-   `손상되었기 때문에 열 수 없습니다.` 메시지가 뜨고 앱이 실행되지 않는다면, 다음 명령어를 터미널에 입력하세요.
    ```bash
    xattr -cr /Applications/Alspotron.app
    ```
-   혹은 [해당 링크](https://archivers.tistory.com/74)를 참고하여 실행하세요.

## Config

1.  설정 

|                                                   위치 설정                                                  |                                                   테마 설정                                                  |
| :------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/organization/alspotron/assets/16558115/9dd2d0c5-ff55-423d-b9bb-589a7c4bb658) | ![image](https://github.com/organization/alspotron/assets/16558115/b70f646a-ae67-4cab-b065-32c6c3664850) |

2.  트레이 아이콘의 `가사 선택`을 선택하여 현재 재생 중인 노래의 가사를 다른 가사로 교체할 수 있습니다.

|                                          곡을 검색하고, 다른 가사를 적용한 예제                                          |
| :------------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/organization/alspotron/assets/16558115/171d97b3-79ff-4ede-b7a6-9905b7993b42) |

## Migration from Alspotify

[문서](https://github.com/organization/alspotron/blob/master/MIGRATION_FROM_ALSPOTIFY.md)를 참고하세요.

## LICENSE

`Apache License 2.0`

## Special thanks

-   [Khinenw](https://github.com/HelloWorld017)'s **[Alspotify](https://github.com/HelloWorld017/alspotify)**
