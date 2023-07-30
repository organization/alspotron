# Alspotron <a href="https://github.com/organization/alspotron/releases/latest"><img src="https://img.shields.io/github/downloads/organization/alspotron/total.svg"/></a>

### Vollständig anpassbarer Spotify- und YouTube-Musik-Liedtext-Viewer

> Alspotron zeigt Liedtexte von Musik an, die auf Musik-Streaming-Plattformen wie `Spotify` oder `YouTube Music` abgespielt wird. \
> Wenn kein Liedtext in den Suchergebnissen vorhanden ist, die in Spotify integrierten Liedtexte anzeigen (nur bei der Wiedergabe mit `Spotify`)

### Screenshot

-   Hier sind einige Beispiel-Screenshots von Liedtexten, die mit Alspotron angezeigt werden. Sie können die Position des Liedtextes frei einstellen.

|                        Spotify                         |                                                        Youtube Music                                                        |                                         Game Overlay (tested game: Overwatch)                                         |
|:------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------:|
| ![Spotify Screenshot](https://i.imgur.com/0JJMhaU.png) | ![YouTube Music Screenshot](https://github.com/organization/alspotron/assets/16558115/fc22323e-d0b2-4abc-882e-2281c13f4cf4) | ![Overlay Screenshot](https://github.com/organization/alspotron/assets/16558115/7bb95071-b8f7-45e1-af59-02e1586d5dcc) |

## Installation

### Spotify

#### 1.  [Spicetify installieren](https://github.com/khanhas/spicetify-cli)

  -   Bitte folgen Sie den Anweisungen unter dem folgenden Link, um `Spicetify` zu installieren.

2.  [Alspotron herunterladen](https://github.com/organization/alspotron/releases)

  -   Laden Sie die neueste Version von Alspotron von der Registerkarte Release herunter und installieren Sie sie
  -   Wenn Sie Windows verwenden, müssen Sie `Alspotron-Web-Setup-[Version].exe` installieren.

3.  Alspotron Companion installieren

  -   Laden Sie [`alspotron.js`](https://powernukkit.github.io/DownGit/#/home?directFile=1&url=https://github.com/organization/alspotron/blob/master/extensions/alspotron.js) herunter und legen Sie es im Ordner Extensions im [Installationsverzeichnis von Spicetify](https://spicetify.app/docs/advanced-usage/extensions/) ab.
  -   Fügen Sie die Erweiterung alspotron.js mit dem folgenden Befehl zu Spicetify hinzu.
      ```bash
      spicetify config extensions alspotron.js
      ```
  -   Nach der Verwendung des folgenden Befehls wird Spotify neu gestartet und die Erweiterung alspotron.js wird angewendet.
      ```bash
      spicetify apply
      ``` 

---

### YouTube Music

#### 1.  [YouTube Music Desktop installieren](https://github.com/th-ch/youtube-music/releases)

  -   Bitte folgen Sie den Anweisungen unter dem folgenden Link, um `Youtube Music Desktop` zu installieren.

#### 2.  Starten Sie `Youtube Music Desktop`, wählen Sie im Menü `Plugins` und aktivieren Sie `tuna-obs`.

#### 3.  [Alspotron herunterladen](https://github.com/organization/alspotron/releases)

  -   Laden Sie die neueste Version von Alspotron von der Registerkarte Release herunter und installieren Sie sie
  -   Wenn Sie Windows verwenden, müssen Sie `Alspotron-Web-Setup-[Version].exe` installieren.

#### WARNUNG: Für YouTube Music-Benutzer

- Es gibt ein [Problem](https://github.com/organization/alspotron/issues/1) im Zusammenhang mit Adblockern.
- Sie **MÜSSEN** das Adblocker-Plugin deaktivieren oder den `adblocker` auf `in-player` umstellen.

---

### Andere Plattformen (z. B. Apple Music)

#### 1. Folgen Sie dem [Link](https://github.com/univrsal/tuna) zur Installation der Browsererweiterung (tampermonkey script).
#### 2.  [Alspotron herunterladen](https://github.com/organization/alspotron/releases)
  -   Laden Sie die neueste Version von Alspotron von der Registerkarte Release herunter und installieren Sie sie
  -   Wenn Sie Windows verwenden, müssen Sie `Alspotron-Web-Setup-[Version].exe` installieren.

---

### How to use

#### Windows, Linux

-   Starten Sie `Alspotron`.

#### macOS

-   Starten Sie Alspotron mit dem Befehl
    ```bash
    xattr -cr /Applications/Alspotron.app
    ```
-   oder starten Sie das Programm mit dieser [Anleitung](https://www.macworld.com/article/672947/how-to-open-a-mac-app-from-an-unidentified-developer.html).

## Config

1.  Präferenzen

|                                        Ort des Liedtextes ändern                                         |                                         Theme-Einstellung ändern                                         |
|:--------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------:|
| ![image](https://github.com/organization/alspotron/assets/16558115/d09cc0ec-cab7-4fd4-89fe-0836699e352a) | ![image](https://github.com/organization/alspotron/assets/16558115/2e4ae98b-559e-4e8d-b3bb-f5e3081bcf88) |

2.  Sie können einen anderen Liedtext für das gerade abgespielte Lied über das Menü `Liedtext auswählen` auf dem Tray-Symbol auswählen.

|                         Suchen Sie andere Songtexte zu jetzt spielenden Liedern.                         |
|:--------------------------------------------------------------------------------------------------------:|
| ![image](https://github.com/organization/alspotron/assets/16558115/0315c44e-27cb-4882-a7d8-e6e91531790a) |

## Migration from Alspotify

Siehe diese [Dokumentation](https://github.com/organization/alspotron/blob/master/MIGRATION_FROM_ALSPOTIFY.md)

## LICENSE

`Apache License 2.0`

## Special thanks

-   [Khinenw](https://github.com/HelloWorld017)'s **[Alspotify](https://github.com/HelloWorld017/alspotify)**
