import { useI18n } from '../../context/I18nContext';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === 'zh-TW' ? 'en' : 'zh-TW')}
      aria-label={locale === 'zh-TW' ? 'Switch to English' : '切換為中文'}
      className="fixed top-4 right-4 z-50 px-3 py-1.5 text-sm font-medium rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      {locale === 'zh-TW' ? 'EN' : '中文'}
    </button>
  );
}
