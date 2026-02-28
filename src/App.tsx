import './App.css';
import LanguageSwitcher from './components/ui/LanguageSwitcher';
import WizardLayout from './components/wizard/WizardLayout';
import { useI18n } from './context/I18nContext';

function App() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageSwitcher />
      {/* Header */}
      <header className="pt-12 pb-4 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          🥊 {t('app.title')}
        </h1>
        <p className="mt-2 text-lg text-gray-500">{t('app.subtitle')}</p>
      </header>
      {/* Wizard */}
      <main>
        <WizardLayout />
      </main>
    </div>
  );
}

export default App;
