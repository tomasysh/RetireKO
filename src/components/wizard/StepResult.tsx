import { useI18n } from '../../context/I18nContext';
import { useRetirement } from '../../context/RetirementContext';
import { useWizard } from '../../context/WizardContext';
import { formatCurrency } from '../../utils/calculations';
import RetirementPDFDownload from '../pdf/RetirementPDF';

export default function StepResult() {
  const { t } = useI18n();
  const { state, dispatch } = useRetirement();
  const { goToStep } = useWizard();

  const handleRestart = () => {
    dispatch({ type: 'RESET' });
    goToStep(0);
  };

  if (!state.retirementTarget || !state.futureAnnualExpense || !state.yearsToRetire || !state.monthlySaving) {
    return <p className="text-center text-gray-500">No data available. Please complete all steps.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('stepResult.title')}</h2>
      <p className="text-gray-600 mb-6">{t('stepResult.congratulations')}</p>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
          <p className="text-sm text-emerald-600 mb-1">{t('stepResult.targetAmount')}</p>
          <p className="text-2xl md:text-3xl font-bold text-emerald-700">
            NT$ {formatCurrency(state.retirementTarget)}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
          <p className="text-sm text-blue-600 mb-1">{t('stepResult.yearsToRetire')}</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-700">
            {t('stepResult.years', { count: state.yearsToRetire })}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
          <p className="text-sm text-orange-600 mb-1">{t('stepResult.futureAnnualExpense')}</p>
          <p className="text-2xl md:text-3xl font-bold text-orange-700">
            NT$ {formatCurrency(state.futureAnnualExpense)}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 text-center">
          <p className="text-sm text-purple-600 mb-1">{t('stepResult.monthlySaving')}</p>
          <p className="text-2xl md:text-3xl font-bold text-purple-700">
            NT$ {formatCurrency(state.monthlySaving)}
          </p>
          <p className="text-xs text-purple-500 mt-1">
            {t('stepResult.monthlySavingNote', { rate: '6' })}
          </p>
        </div>
      </div>

      {/* Assumptions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('stepResult.assumptions')}</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• {t('stepResult.assumptionInflation', { rate: state.inflationRate })}</li>
          <li>• {t('stepResult.assumptionRule')}</li>
          <li>• {t('stepResult.assumptionReturn')}</li>
        </ul>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 mb-6 leading-relaxed">
        {t('stepResult.disclaimer')}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleRestart}
          className="flex-1 px-6 py-3 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer font-medium"
        >
          {t('app.restart')}
        </button>
        <RetirementPDFDownload />
      </div>
    </div>
  );
}
