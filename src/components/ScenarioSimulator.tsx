import { useState, useMemo } from 'react';
import { useI18n } from '../context/I18nContext';
import { useRetirement } from '../context/RetirementContext';
import {
  calculateFutureExpense,
  calculateRetirementTarget,
  calculateMonthlySaving,
  formatCurrency,
} from '../utils/calculations';

export default function ScenarioSimulator() {
  const { t } = useI18n();
  const { state } = useRetirement();

  const [yearOffset, setYearOffset] = useState(0);   // positive = start earlier
  const [returnRate, setReturnRate] = useState(state.annualReturn);

  const base = useMemo(() => ({
    monthlySaving: state.monthlySaving ?? 0,
    yearsToRetire: state.yearsToRetire ?? 0,
  }), [state.monthlySaving, state.yearsToRetire]);

  const scenario = useMemo(() => {
    const years = (state.yearsToRetire ?? 0) + yearOffset;
    if (years <= 0 || !state.annualExpense || !state.retirementYears) return null;
    // Future expense anchored to original retirement age regardless of yearOffset
    const futureAnnualExpense = calculateFutureExpense(
      state.annualExpense,
      state.inflationRate,
      state.yearsToRetire ?? 0
    );
    // Scenario uses 4% rule (25×) as the target baseline
    const target = calculateRetirementTarget(futureAnnualExpense);
    const monthly = calculateMonthlySaving(target, years, returnRate / 100);
    return { monthly, years };
  }, [yearOffset, returnRate, state]);

  const diff = scenario ? scenario.monthly - base.monthlySaving : null;

  const yearLabel = (n: number) => {
    if (n === 0) return t('scenario.same');
    return n > 0
      ? t('scenario.earlier', { n })
      : t('scenario.later', { n: Math.abs(n) });
  };

  return (
    <div className="mt-5 rounded-xl border-2 border-violet-200 bg-white p-5">
      <h3 className="text-violet-700 font-bold text-base mb-1">🔭 {t('scenario.title')}</h3>
      <p className="text-xs text-violet-400 mb-4 leading-relaxed">{t('scenario.subtitle')}</p>

      {/* Year offset slider */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('scenario.startLabel')}：
          <span className="font-bold text-violet-600">{yearLabel(yearOffset)}</span>
        </label>
        <input
          type="range"
          min={-10}
          max={10}
          step={1}
          value={yearOffset}
          onChange={(e) => setYearOffset(parseInt(e.target.value))}
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('scenario.returnLabel')}：
          <span className="font-bold text-violet-600">{returnRate}%</span>
        </label>
        <input
          type="range"
          min={2}
          max={15}
          step={0.5}
          value={returnRate}
          onChange={(e) => setReturnRate(parseFloat(e.target.value))}
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
            <p className={`text-lg font-bold ${scenario.monthly < base.monthlySaving ? 'text-emerald-600' : 'text-rose-600'}`}>
              NT$ {formatCurrency(scenario.monthly)}
            </p>
          </div>
          <div
            className="col-span-2 rounded-lg px-4 py-3 text-center text-sm font-semibold"
            style={{
              backgroundColor: diff < 0 ? '#f0fdf4' : '#fff1f2',
              color: diff < 0 ? '#15803d' : '#be123c',
              border: diff < 0 ? '1px solid #bbf7d0' : '1px solid #fecdd3',
            }}
          >
            {diff < 0
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
