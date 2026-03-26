import { useState, useMemo } from 'react';
import { useI18n } from '../context/I18nContext';
import { useRetirement } from '../context/RetirementContext';
import {
  calculateFutureExpense,
  calculateRetirementTarget,
  calculateMonthlySaving,
  calculateFutureValueOfSavings,
  formatCurrency,
} from '../utils/calculations';

export default function ScenarioSimulator() {
  const { t } = useI18n();
  const { state } = useRetirement();

  // positive yearOffset = start LATER (fewer years), negative = start EARLIER (more years)
  // slider: left (min=-10) = start 10 years earlier, right (max=10) = start 10 years later
  const [yearOffset, setYearOffset] = useState(0);
  const [returnRate, setReturnRate] = useState(state.annualReturn);

  const base = useMemo(() => ({
    monthlySaving: state.monthlySaving ?? 0,
    yearsToRetire: state.yearsToRetire ?? 0,
  }), [state.monthlySaving, state.yearsToRetire]);

  const scenario = useMemo(() => {
    const years = (state.yearsToRetire ?? 0) - yearOffset; // negative offset = earlier = more years
    if (years <= 0 || !state.annualExpense || !state.retirementYears) return null;
    // Deduct pension from annual expense (same as main calculation)
    const pensionAnnual = (state.monthlyPension ?? 0) * 12;
    const adjustedAnnualExpense = Math.max(0, state.annualExpense - pensionAnnual);
    // Future expense anchored to original retirement age regardless of yearOffset
    const futureAnnualExpense = calculateFutureExpense(
      adjustedAnnualExpense,
      state.inflationRate,
      state.yearsToRetire ?? 0
    );
    const fullTarget = calculateRetirementTarget(futureAnnualExpense);
    // Account for existing savings at scenario's return rate and accumulation years
    const scenarioFvSavings = state.currentSavings > 0
      ? calculateFutureValueOfSavings(state.currentSavings, returnRate, years)
      : 0;
    const adjustedTarget = Math.max(0, fullTarget - scenarioFvSavings);
    const monthly = calculateMonthlySaving(adjustedTarget, years, returnRate / 100);
    return { monthly, years, sufficient: scenarioFvSavings >= fullTarget };
  }, [yearOffset, returnRate, state]);

  const diff = scenario ? scenario.monthly - base.monthlySaving : null;

  const yearLabel = (n: number) => {
    if (n === 0) return t('scenario.same');
    return n > 0
      ? t('scenario.later', { n })      // positive = later
      : t('scenario.earlier', { n: Math.abs(n) }); // negative = earlier
  };

  return (
    <div className="mt-5 rounded-xl border-2 border-violet-200 bg-white p-5">
      <h3 className="text-violet-700 font-bold text-base mb-1">🔭 {t('scenario.title')}</h3>
      <p className="text-xs text-violet-400 mb-4 leading-relaxed">{t('scenario.subtitle')}</p>

      {/* Year offset slider */}
      <div className="mb-4">
        <label htmlFor="scenario-year-offset" className="block text-sm font-medium text-gray-700 mb-1">
          {t('scenario.startLabel')}：
          <span className="font-bold text-violet-600">{yearLabel(yearOffset)}</span>
        </label>
        <input
          id="scenario-year-offset"
          type="range"
          min={-10}
          max={10}
          step={1}
          value={yearOffset}
          onChange={(e) => setYearOffset(parseInt(e.target.value, 10))}
          aria-label={t('scenario.startLabel')}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-violet-500 bg-violet-100"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{t('scenario.earlier', { n: 10 })}</span>
          <span>{t('scenario.same')}</span>
          <span>{t('scenario.later', { n: 10 })}</span>
        </div>
      </div>

      {/* Return rate slider */}
      <div className="mb-5">
        <label htmlFor="scenario-return-rate" className="block text-sm font-medium text-gray-700 mb-1">
          {t('scenario.returnLabel')}：
          <span className="font-bold text-violet-600">{returnRate}%</span>
        </label>
        <input
          id="scenario-return-rate"
          type="range"
          min={2}
          max={15}
          step={0.5}
          value={returnRate}
          onChange={(e) => setReturnRate(parseFloat(e.target.value))}
          aria-label={t('scenario.returnLabel')}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-violet-500 bg-violet-100"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>2%</span>
          <span>15%</span>
        </div>
      </div>

      {/* Result */}
      {scenario && diff !== null ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg border border-indigo-200 p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">{t('scenario.originalSaving')}</p>
            <p className="text-lg font-bold text-gray-700">
              NT$ {formatCurrency(base.monthlySaving)}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-indigo-300 p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">{t('scenario.newSaving')}</p>
            {scenario.sufficient ? (
              <p className="text-lg font-bold text-emerald-600">🎉 NT$ 0</p>
            ) : (
              <p className={`text-lg font-bold ${scenario.monthly < base.monthlySaving ? 'text-emerald-600' : 'text-rose-600'}`}>
                NT$ {formatCurrency(scenario.monthly)}
              </p>
            )}
          </div>
          <div
            className="col-span-2 rounded-lg px-4 py-3 text-center text-sm font-semibold"
            style={{
              backgroundColor: diff < 0 ? '#f0fdf4' : diff > 0 ? '#fff1f2' : '#f9fafb',
              color: diff < 0 ? '#15803d' : diff > 0 ? '#be123c' : '#6b7280',
              border: diff < 0 ? '1px solid #bbf7d0' : diff > 0 ? '1px solid #fecdd3' : '1px solid #e5e7eb',
            }}
          >
            {scenario.sufficient
              ? t('scenario.noChange')
              : diff < 0
              ? t('scenario.saveLess', { amount: formatCurrency(Math.abs(diff)) })
              : diff > 0
              ? t('scenario.saveMore', { amount: formatCurrency(diff) })
              : t('scenario.noChange')}
          </div>
        </div>
      ) : (
        <p className="text-xs text-rose-500 text-center">{t('scenario.invalid')}</p>
      )}
    </div>
  );
}
