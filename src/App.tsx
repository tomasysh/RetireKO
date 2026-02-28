import './App.css';
import LanguageSwitcher from './components/ui/LanguageSwitcher';
import WizardLayout from './components/wizard/WizardLayout';
import { useI18n } from './context/I18nContext';

function App() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <LanguageSwitcher />

      {/* Skip link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-emerald-700 focus:text-white focus:rounded-lg focus:text-sm">
        Skip to content
      </a>

      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white pt-14 pb-10 px-4 text-center">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none" aria-hidden="true" />
        <div className="relative z-10">
          <div className="text-6xl md:text-7xl mb-3 select-none" aria-hidden="true">🥊</div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-balance">
            {t('app.title')}
          </h1>
          <p className="mt-2 text-base md:text-lg text-emerald-200 text-pretty">{t('app.subtitle')}</p>
        </div>
      </header>

      {/* Wizard */}
      <main className="flex-1" id="main-content">
        <WizardLayout />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-4 px-4 text-center text-xs text-gray-400">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} RetireKO</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <a
            href="https://zettelcousin.tw/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
          >
            <span>A project by</span>
            <span className="font-medium text-gray-600">{t('app.footerCreator')}</span>
            <img
              src="/zettelcousin-logo.png"
              alt="卡片表哥 Zettel Cousin"
              width="80"
              height="22"
              className="h-5 w-auto inline-block"
            />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
