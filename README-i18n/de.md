# Alspotron <a href="https://github.com/organization/alspotron/releases/latest"><img src="https://img.shields.io/github/downloads/organization/alspotron/total.svg"/></a>

### Vollständig anpassbarer Lyrics-Viewer für *Spotify* und *YouTube Music* 

> Alspotron zeigt Lyrics von Musik an, die auf Musik-Streaming-Plattformen wie `Spotify` oder `YouTube Music` abgespielt werden. \
> Falls keine Lyrics in den Suchergebnissen vorhanden sind, wird Alpostron die built-in-Lyrics von Spotify anzeigen (nur bei der Wiedergabe mit `Spotify`)

### Screenshots

-   Hier sind einige Beispielscreenshots von Lyrics, die mit Alspotron angezeigt werden. Die Position der Lyrics sind nach Belieben anpassbar.

|                        Spotify                         |                                                        Youtube Music                                                        |                                         Spiel-Overlay (getestetes Spiel: Overwatch)                                         |
|:------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------:|
| ![Spotify Screenshot](https://i.imgur.com/0JJMhaU.png) | ![YouTube Music Screenshot](https://github.com/organization/alspotron/assets/16558115/fc22323e-d0b2-4abc-882e-2281c13f4cf4) | ![Overlay Screenshot](https://github.com/organization/alspotron/assets/16558115/7bb95071-b8f7-45e1-af59-02e1586d5dcc) |

## Installation

### Spotify

#### 1.  [Spicetify installieren](https://github.com/khanhas/spicetify-cli)

  -   Bitte folgen Sie dem obigen Link, um `Spicetify` zu installieren.

#### 2.  [Alspotron herunterladen](https://github.com/organization/alspotron/releases)

  -   Installieren Sie die neueste Version von Alspotron unter `Releases`.
  -   Falls Sie Windows verwenden, müssen Sie `Alspotron-Web-Setup-[Version].exe` installieren.

#### 3.  Alspotron Companion installieren

  -   Laden Sie [`alspotron.js`](https://powernukkit.github.io/DownGit/#/home?directFile=1&url=https://github.com/organization/alspotron/blob/master/extensions/alspotron.js) herunter und legen Sie es im Ordner [Extensions Ordner Im Installationsort von Spicetify](https://spicetify.app/docs/advanced-usage/extensions/) ab.
  -   Fügen Sie die Erweiterung `alspotron.js `mit dem folgenden Befehl zu `Spicetify` hinzu.
      ```bash
      spicetify config extensions alspotron.js
      ```
  -   Nach der Ausführung des folgenden Befehls wird Spotify neu gestartet und die Erweiterung alspotron.js wird angewendet.
      ```bash
      spicetify apply
      ``` 

---

### YouTube Music

#### 1.  [YouTube Music Desktop installieren](https://github.com/th-ch/youtube-music/releases)

  -   Bitte folgen Sie dem obigen Link, um `Youtube Music Desktop` zu installieren.

#### 2.  Starten Sie `Youtube Music Desktop`, wählen Sie im Menü `Erweiterungen` aus und aktivieren Sie `Tuna OBS`.

#### 3.  [Alspotron herunterladen](https://github.com/organization/alspotron/releases)

  -   Installieren Sie die neueste Version von Alspotron unter `Releases`.
  -   Falls Sie Windows verwenden, müssen Sie `Alspotron-Web-Setup-[Version].exe` installieren.

---

### Andere Plattformen (z. B. Apple Music)

#### 1. Folgen Sie diesem [Link](https://github.com/univrsal/tuna) zur Installation der Browsererweiterung (tampermonkey script).
#### 2.  [Alspotron herunterladen](https://github.com/organization/alspotron/releases)
  -   Installieren Sie die neueste Version von Alspotron unter `Releases`.
  -   Falls Sie Windows verwenden, müssen Sie `Alspotron-Web-Setup-[Version].exe` installieren.

---

### Anleitung

#### Windows, Linux

-   Starten Sie `Alspotron`.

#### macOS

-   Starten Sie Alspotron mit dem Befehl
    ```bash
    xattr -cr /Applications/Alspotron.app
    ```
-   oder mit dieser [Anleitung](https://www.macworld.com/article/672947/how-to-open-a-mac-app-from-an-unidentified-developer.html).

## Konfiguration

1.  Präferenzen

|                                        Position der Lyrics anpassen                                         |                                         Theme-Einstellung anpassen                                         |
|:--------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------:|
| ![image](https://github.com/organization/alspotron/assets/16558115/28b64547-70df-4c32-9ee4-df8528be9f72) | ![image](https://github.com/organization/alspotron/assets/16558115/2f8b3420-c235-4747-8a68-79ee46d85e45) |

2.  Zum Auswählen anderer Lyrics für den aktuell abgespielten Song wählen Sie das Menü `Liedtext auswählen` auf dem Tray-Symbol.

|                         Suchen Sie andere Lyrics für den aktuell abgespielten Song.                         |
|:--------------------------------------------------------------------------------------------------------:|
| ![image](https://github.com/organization/alspotron/assets/16558115/1de5703a-1bde-4152-8c17-092463750246) |

## Plugin
Refer this [Documentation](https://github.com/organization/alspotron/wiki/Plugin)

Refer this [Example](https://github.com/organization/alspotron/tree/master/example/alspotron-plugin)

## Migration von Alspotify

Siehe diese [Dokumentation](https://github.com/organization/alspotron/blob/master/MIGRATION_FROM_ALSPOTIFY.md)

## LICENSE

`Apache License 2.0`

## Special thanks

-   [Khinenw](https://github.com/HelloWorld017)'s **[Alspotify](https://github.com/HelloWorld017/alspotify)**
