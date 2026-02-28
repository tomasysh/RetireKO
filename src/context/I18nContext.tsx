import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import zhTW from '../i18n/zh-TW.json';
import en from '../i18n/en.json';

type Locale = 'zh-TW' | 'en';

const messages: Record<Locale, Record<string, unknown>> = {
  'zh-TW': zhTW,
  en: en,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('zh-TW');

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let text = getNestedValue(messages[locale] as Record<string, unknown>, key);
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replaceAll(`{${k}}`, String(v));
        });
      }
      return text;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
