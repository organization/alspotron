import ko from './translations/ko.json';
import en from './translations/en.json';
import ja from './translations/ja.json';
import de from './translations/de.json';

import type { Resource } from 'i18next';

export const LangResource: Resource = {
  ko: {
    translation: ko,
  },
  en: {
    translation: en,
  },
  ja: {
    translation: ja,
  },
  de: {
    translation: de,
  },
};

export const getTranslation = (key: string, lang: string): string => {
  const translation: Record<string, string> = LangResource[lang]?.translation as Record<string, string>;
  return translation?.[key];
};
