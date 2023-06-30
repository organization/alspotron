# Alspotron [![Github All Releases](https://img.shields.io/github/downloads/organization/alspotron/total.svg)](<>)

### 커스텀이 편리한 _Spotify_, _YouTube Music_ 가사 표시기

> `스포티파이` 혹은 `유튜브 뮤직`등의 `뮤직 플레이어`에서 재생중인 노래의 알송 가사를 화면에 표시해줍니다.\
> 알송 가사가 존재하지 않는 경우, 스포티파이의 내장 가사를 표시합니다. (**스포티파이로 재생하는 경우만 해당**)  

### Screenshot

-   동영상 위에 가사가 표시되게 촬영한 예시 이미지이며, 실제로는 위치를 자유롭게 선택할 수 있습니다.

|                         Spotify                        |                                                        Youtube Music                                                        |
| :----------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: |
| ![Spotify Screenshot](https://i.imgur.com/0JJMhaU.png) | ![YouTube Music Screenshot](https://github.com/organization/alspotron/assets/16558115/fc22323e-d0b2-4abc-882e-2281c13f4cf4) |

## Installation

설치 방법은 다음과 같습니다.

### Spotify

1.  [Spicetify 설치](https://github.com/khanhas/spicetify-cli)  

    -   다음 링크의 지시사항에 따라 `Spicetify`를 설치해주세요.

2.  [Alspotron 다운로드](https://github.com/organization/alspotron/releases) 

    -   Release 탭에서 최신버전의 Alspotron을 다운로드한 후 압축을 해제해주세요.

3.  Alspotron Companion 설치  

    -   Spicetify 설치 위치의 Extensions 폴더에 Alspotron/extensions 폴더 안에 있는 `alspotron.js` 를 복사해 붙여넣어주세요.  
    -   이후 `spicetify config extensions alspotron.js` 명령어로 `alspotron.js`를 추가해주세요.  
    -   `spicetify apply` 명령어로 적용하면 스포티파이가 꺼졌다 켜지면서 적용됩니다.

### YouTube Music

1.  [YouTube Music Desktop 설치](https://github.com/th-ch/youtube-music/releases)

    -   다음 링크의 지시사항에 따라 `Youtube Music Desktop`을 설치해주세요.

2.  `Youtube Music Desktop`을 실행하고, 상단 메뉴의 `plugins`를 클릭한 뒤 `tuna-obs`를 활성화해주세요.

3.  [Alspotron 다운로드](https://github.com/organization/alspotron/releases)  

    -   Release 탭에서 최신버전의 Alspotron을 다운로드한 후 압축을 해제해주세요.

### 그 외 플레이어 (e.g. Apple Music)

-   [tuna-obs](https://github.com/univrsal/tuna)를 참고하세요.

### (모든 뮤직 플레이어 해당) 마지막 단계

-   `Alspotron` 실행

## Config

1.  설정 

|                                                   위치 설정                                                  |                                                   테마 설정                                                  |
| :------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/organization/alspotron/assets/16558115/50bfa831-eff3-4daa-8e42-5fd43c8de755) | ![image](https://github.com/organization/alspotron/assets/16558115/a9db7eac-dce0-4e06-b315-ff5a9b844a44) |

2.  트레이 아이콘의 `가사 선택`을 선택하여 현재 재생 중인 노래의 가사를 다른 가사로 교체할 수 있습니다.

|                                          곡을 검색하고, 다른 가사를 적용한 예제                                          |
| :------------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/organization/alspotron/assets/16558115/c2ca3749-0819-4525-88a1-5503490afa96) |

## Migration from Alspotify

[문서](https://github.com/organization/alspotron/blob/master/MIGRATION_FROM_ALSPOTIFY.md)를 참고하세요.

## LICENSE

`Apache License 2.0`

## Special thanks

-   [Khinenw](https://github.com/HelloWorld017)'s **[Alspotify](https://github.com/HelloWorld017/alspotify)**

## TODO

-   [ ] 플러그인 시스템 구현
-   [ ] 애니메이션 ON / OFF 구현
-   [ ] 애니메이션 효과 변경 기능
-   [ ] `DirectX` 게임에 오버레이로 표시

## Known Bugs

-   [ ] 일시정지 후, 재생을 누르면 가사 레이아웃이 잠시 깨짐
