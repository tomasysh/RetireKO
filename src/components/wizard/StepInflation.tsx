import { useState, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';
import { useRetirement } from '../../context/RetirementContext';
import {
  calculateFutureExpense,
  calculateRetirementTarget,
  formatCurrency,
} from '../../utils/calculations';
import InfoBlock from '../InfoBlock';
import StepHeader from '../ui/StepHeader';

interface StepProps {
  onNext: () => void;
}

export default function StepInflation({ onNext }: StepProps) {
  const { t } = useI18n();
  const { state, dispatch } = useRetirement();

  const [inflationRate, setInflationRate] = useState(state.inflationRate);
  const [annualReturn, setAnnualReturn] = useState(state.annualReturn);

  useEffect(() => {
    dispatch({ type: 'SET_INFLATION', inflationRate });
  }, [inflationRate, dispatch]);

  useEffect(() => {
    dispatch({ type: 'SET_RETURN', annualReturn });
  }, [annualReturn, dispatch]);

  const futureAnnualExpense =
    state.annualExpense && state.yearsToRetire
      ? calculateFutureExpense(state.annualExpense, inflationRate, state.yearsToRetire)
      : null;

  const retirementTarget = futureAnnualExpense
    ? calculateRetirementTarget(futureAnnualExpense)
    : null;

  const handleNext = () => {
    dispatch({ type: 'SET_INFLATION', inflationRate });
    dispatch({ type: 'SET_RETURN', annualReturn });
    dispatch({ type: 'CALCULATE' });
    onNext();
  };

  return (
    <div>
      <StepHeader emoji="📈" step={4} title={t('stepInflation.title')} />

      <p className="text-gray-600 mb-5 leading-relaxed text-sm">{t('stepInflation.inflationDescription')}</p>

      {/* Inflation rate slider */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('stepInflation.inflationRate')}:{' '}
          <span className="text-emerald-600 font-bold">{inflationRate}%</span>
        </label>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.1"
          value={inflationRate}
          onChange={(e) => setInflationRate(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0.5%</span>
          <span>5%</span>
        </div>
      </div>

      {/* Annual return slider */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('stepInflation.annualReturn')}:{' '}
          <span className="text-indigo-600 font-bold">{annualReturn}%</span>
        </label>
        <p className="text-xs text-gray-500 mb-2 leading-relaxed">
          {t('stepInflation.annualReturnHint')}
        </p>
        <input
          type="range"
          min="2"
          max="15"
          step="0.5"
          value={annualReturn}
          onChange={(e) => setAnnualReturn(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>2%</span>
          <span className="text-gray-400">
            VT ~10% / 0050 ~12%
          </span>
          <span>15%</span>
        </div>
      </div>

      {futureAnnualExpense && (
        <div className="space-y-3 mb-2">
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-orange-700 text-sm">
            {t('stepInflation.futureExpense', { amount: formatCurrency(futureAnnualExpense) })}
          </div>

          {state.retirementYears && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-700 text-sm">
              {t('stepInflation.retirementYearsNote', { years: state.retirementYears })}
            </div>
          )}

          {retirementTarget && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl px-6 py-5 text-center">
              <p className="text-xs text-emerald-600 mb-1">{t('stepInflation.fourPercentExplain')}</p>
              <p className="text-3xl md:text-4xl font-bold text-emerald-700">
                {t('stepInflation.targetAmount', { amount: formatCurrency(retirementTarget) })}
              </p>
            </div>
          )}
        </div>
      )}

      <InfoBlock content={t('stepInflation.infoContent')} />

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleNext}
          className="px-6 py-2.5 rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer font-medium"
        >
          {t('app.next')}
        </button>
      </div>
    </div>
  );
}
