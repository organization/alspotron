# Alspotify에서 Alspotron으로 마이그레이션

## 호환되는 것

- `alspotify`와 설정 파일이 호환됩니다. 기존 `alspotify`의 `config.json`을 `%APPDATA%` (`$XDG_CONFIG_HOME`, `~/Library/Application Support` ) 디렉토리 내 `alspotify` 디렉토리에 넣어주시면 됩니다.

## 호환되지 않는 것

- `dist/options/lyrics.json`: 가사 매핑 파일은 호환되지 않습니다. (형식이 변경됨) 
- `dist/plugins/*.js`: 형식이 변경될 예정이므로 기존 플러그인은 호환되지 않습니다.
