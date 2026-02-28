import { useState } from 'react';
import { useI18n } from '../../context/I18nContext';
import { useRetirement } from '../../context/RetirementContext';
import { useWizard } from '../../context/WizardContext';
import { formatCurrency } from '../../utils/calculations';
import RetirementPDFDownload from '../pdf/RetirementPDF';
import StepHeader from '../ui/StepHeader';
import ScenarioSimulator from '../ScenarioSimulator';
import ShareCard from '../ShareCard';

type Tab = 'summary' | 'analysis' | 'scenario';

export default function StepResult() {
  const { t } = useI18n();
  const { state, dispatch } = useRetirement();
  const { goToStep } = useWizard();
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  const handleRestart = () => {
    dispatch({ type: 'RESET' });
    goToStep(0);
  };

  if (!state.retirementTarget || !state.futureAnnualExpense || !state.yearsToRetire || !state.monthlySaving) {
    return <p className="text-center text-gray-500">No data available. Please complete all steps.</p>;
  }

  const diff = state.minimumTarget != null ? state.retirementTarget - state.minimumTarget : null;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'summary', label: t('stepResult.tabSummary') },
    { id: 'analysis', label: t('stepResult.tabAnalysis') },
    { id: 'scenario', label: t('stepResult.tabScenario') },
  ];

  return (
    <div>
      <StepHeader emoji="🎯" step={5} title={t('stepResult.title')} />

      {/* Tab nav */}
      <div role="tablist" aria-label={t('stepResult.title')} className="flex rounded-xl bg-gray-100 p-1 mb-5 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                const idx = tabs.findIndex((t) => t.id === tab.id);
                setActiveTab(tabs[(idx + 1) % tabs.length].id);
              } else if (e.key === 'ArrowLeft') {
                const idx = tabs.findIndex((t) => t.id === tab.id);
                setActiveTab(tabs[(idx - 1 + tabs.length) % tabs.length].id);
              }
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Summary */}
      <div
        role="tabpanel"
        id="panel-summary"
        aria-labelledby="tab-summary"
        hidden={activeTab !== 'summary'}
      >
        {/* Hero target */}
        <div className="bg-emerald-600 rounded-2xl p-6 text-center text-white mb-4">
          <p className="text-sm text-emerald-200 mb-1">{t('stepResult.targetAmount')}</p>
          <p className="text-3xl md:text-4xl font-black tracking-tight tabular-nums">
            NT$&nbsp;{formatCurrency(state.retirementTarget)}
          </p>
          <p className="text-xs text-emerald-300 mt-2">{t('stepResult.assumptionRule')}</p>
        </div>

        {/* Supporting metrics grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
            <p className="text-xs text-blue-500 mb-1">{t('stepResult.yearsToRetire')}</p>
            <p className="text-xl font-bold text-blue-700 tabular-nums">{state.yearsToRetire}</p>
            <p className="text-xs text-blue-400">{t('stepResult.years', { count: '' }).trim()}</p>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
            <p className="text-xs text-orange-500 mb-1">{t('stepResult.futureAnnualExpense')}</p>
            <p className="text-sm font-bold text-orange-700 tabular-nums leading-tight">NT$&nbsp;{formatCurrency(state.futureAnnualExpense)}</p>
            <p className="text-xs text-orange-400">/yr</p>
          </div>
          <div className={`rounded-xl p-3 text-center ${
            state.futureValueOfSavings != null && state.futureValueOfSavings >= state.retirementTarget
              ? 'bg-emerald-50 border border-emerald-200'
              : 'bg-purple-50 border border-purple-100'
          }`}>
            <p className={`text-xs mb-1 ${
              state.futureValueOfSavings != null && state.futureValueOfSavings >= state.retirementTarget
                ? 'text-emerald-600'
                : 'text-purple-500'
            }`}>{t('stepResult.monthlySaving')}</p>
            {state.futureValueOfSavings != null && state.futureValueOfSavings >= state.retirementTarget ? (
              <p className="text-sm font-bold text-emerald-700 leading-tight">🎉</p>
            ) : (
              <>
                <p className="text-sm font-bold text-purple-700 tabular-nums leading-tight">NT$&nbsp;{formatCurrency(state.monthlySaving)}</p>
                <p className="text-xs text-purple-400">/mo</p>
              </>
            )}
          </div>
        </div>

        {/* Existing savings offset callout */}
        {state.futureValueOfSavings != null && state.futureValueOfSavings > 0 && (
          state.futureValueOfSavings >= state.retirementTarget ? (
            /* Savings fully cover target */
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-3 flex items-start gap-3 mb-4">
              <span className="text-2xl flex-shrink-0" aria-hidden="true">🎉</span>
              <div className="text-sm text-emerald-800">
                <p className="font-semibold mb-1">{t('stepResult.savingsSufficient')}</p>
                <p className="text-emerald-700">{t('stepResult.savingsSufficientNote', {
                  savings: formatCurrency(state.currentSavings),
                  future: formatCurrency(state.futureValueOfSavings),
                  target: formatCurrency(state.retirementTarget),
                })}</p>
              </div>
            </div>
          ) : (
            /* Partial offset */
            <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 flex items-start gap-3 mb-4">
              <span className="text-2xl flex-shrink-0" aria-hidden="true">💰</span>
              <p className="text-sm text-violet-700 leading-relaxed">
                {t('stepResult.savingsOffsetNote', {
                  savings: formatCurrency(state.currentSavings),
                  future: formatCurrency(state.futureValueOfSavings),
                })}
              </p>
            </div>
          )
        )}

        {/* Life expectancy callout */}
        {state.retirementYears && state.lifeExpectancy && state.retireAge && (
          <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <span className="text-2xl flex-shrink-0" aria-hidden="true">🕯️</span>
            <p className="text-sm text-sky-700 leading-relaxed">
              {t('stepResult.lifeExpectancyNote', {
                le: state.lifeExpectancy,
                retireAge: state.retireAge,
                years: state.retirementYears,
              })}
            </p>
          </div>
        )}
      </div>

      {/* Tab: Analysis */}
      <div
        role="tabpanel"
        id="panel-analysis"
        aria-labelledby="tab-analysis"
        hidden={activeTab !== 'analysis'}
      >
        {/* Minimum target comparison */}
        {state.minimumTarget != null && state.retirementYears && diff != null && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 mb-4">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
              📊 {t('stepResult.minimumTargetLabel')}
            </p>
            <p className="text-xs text-amber-600 mb-2">
              {t('stepResult.minimumTargetNote', { years: state.retirementYears })}
            </p>
            <p className="text-2xl font-bold text-amber-800 tabular-nums mb-1">
              NT$&nbsp;{formatCurrency(state.minimumTarget)}
            </p>
            <p className="text-xs text-amber-500">
              {t('stepResult.minimumTargetCompare', { diff: formatCurrency(diff) })}
            </p>
          </div>
        )}

        {/* Assumptions */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('stepResult.assumptions')}</h3>
          <ul className="text-sm text-gray-600 space-y-1.5">
            <li>{t('stepResult.assumptionInflation', { rate: state.inflationRate })}</li>
            <li>{t('stepResult.assumptionReturn', { rate: state.annualReturn })}</li>
            {state.retirementYears && (
              <li>{t('stepResult.assumptionRetirementYears', { years: state.retirementYears })}</li>
            )}
            <li className="pt-1 border-t border-gray-200 text-xs text-gray-500">{t('stepResult.assumptionRule')}</li>
          </ul>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 leading-relaxed">
          <span aria-hidden="true">⚠️ </span>{t('stepResult.disclaimer')}
        </p>
      </div>

      {/* Tab: Scenario */}
      <div
        role="tabpanel"
        id="panel-scenario"
        aria-labelledby="tab-scenario"
        hidden={activeTab !== 'scenario'}
      >
        <ScenarioSimulator />
      </div>

      {/* Actions — always visible */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={handleRestart}
          className="flex-1 px-6 py-3 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        >
          {t('app.restart')}
        </button>
        <ShareCard />
        <RetirementPDFDownload />
      </div>
    </div>
  );
}
