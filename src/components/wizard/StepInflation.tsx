import { useState, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';
import { useRetirement } from '../../context/RetirementContext';
import {
  calculateFutureExpense,
  calculateRetirementTarget,
  formatCurrency,
} from '../../utils/calculations';
import InfoBlock from '../InfoBlock';

interface StepProps {
  onNext: () => void;
}

export default function StepInflation({ onNext }: StepProps) {
  const { t } = useI18n();
  const { state, dispatch } = useRetirement();

  const [inflationRate, setInflationRate] = useState(state.inflationRate);

  useEffect(() => {
    dispatch({ type: 'SET_INFLATION', inflationRate });
  }, [inflationRate, dispatch]);

  const futureAnnualExpense =
    state.annualExpense && state.yearsToRetire
      ? calculateFutureExpense(state.annualExpense, inflationRate, state.yearsToRetire)
      : null;

  const retirementTarget = futureAnnualExpense
    ? calculateRetirementTarget(futureAnnualExpense)
    : null;

  const handleNext = () => {
    dispatch({ type: 'SET_INFLATION', inflationRate });
    dispatch({ type: 'CALCULATE' });
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('stepInflation.title')}</h2>
      <p className="text-gray-600 mb-6 leading-relaxed">{t('stepInflation.inflationDescription')}</p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('stepInflation.inflationRate')}: <span className="text-emerald-600 font-bold">{inflationRate}%</span>
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

      {futureAnnualExpense && (
        <div className="mt-6 space-y-3">
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-orange-700">
            {t('stepInflation.futureExpense', { amount: formatCurrency(futureAnnualExpense) })}
          </div>

          {retirementTarget && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl px-6 py-5 text-center">
              <p className="text-sm text-emerald-600 mb-1">{t('stepInflation.retirementTarget')}</p>
              <p className="text-3xl md:text-4xl font-bold text-emerald-700">
                {t('stepInflation.targetAmount', { amount: formatCurrency(retirementTarget) })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4% Rule explanation */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-4">
        <h3 className="text-indigo-700 font-semibold text-sm mb-2">
          📖 {t('stepInflation.fourPercentRule')}
        </h3>
        <p className="text-sm text-indigo-600 leading-relaxed">
          {t('stepInflation.fourPercentExplain')}
        </p>
      </div>

      <InfoBlock
        whyTitle={t('stepInflation.whyAsk')}
        whyContent={t('stepInflation.whyAskContent')}
        theoryTitle={t('stepInflation.theory')}
        theoryContent={t('stepInflation.theoryContent')}
      />

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
