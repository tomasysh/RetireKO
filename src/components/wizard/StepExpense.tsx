import { useState, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';
import { useRetirement } from '../../context/RetirementContext';
import { formatCurrency } from '../../utils/calculations';
import InfoBlock from '../InfoBlock';
import StepHeader from '../ui/StepHeader';

interface StepProps {
  onNext: () => void;
}

export default function StepExpense({ onNext }: StepProps) {
  const { t } = useI18n();
  const { state, dispatch } = useRetirement();

  const [monthlyExpense, setMonthlyExpense] = useState(state.monthlyExpense?.toString() ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const annualExpense = monthlyExpense ? parseInt(monthlyExpense) * 12 : null;

  useEffect(() => {
    const me = parseInt(monthlyExpense);
    if (!isNaN(me) && me > 0) {
      dispatch({ type: 'SET_EXPENSE', monthlyExpense: me });
    }
  }, [monthlyExpense, dispatch]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const me = parseInt(monthlyExpense);

    if (!monthlyExpense) newErrors.expense = t('stepExpense.validation.required');
    else if (me < 5000) newErrors.expense = t('stepExpense.validation.min');
    else if (me > 1000000) newErrors.expense = t('stepExpense.validation.max');

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      dispatch({ type: 'SET_EXPENSE', monthlyExpense: me });
      onNext();
    }
  };

  return (
    <div>
      <StepHeader emoji="🏡" step={2} title={t('stepExpense.title')} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('stepExpense.monthlyExpense')}
        </label>
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">{t('stepExpense.hint')}</p>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            {t('stepExpense.currency')}
          </span>
          <input
            type="number"
            value={monthlyExpense}
            onChange={(e) => setMonthlyExpense(e.target.value)}
            placeholder={t('stepExpense.monthlyPlaceholder')}
            className="w-full pl-14 pr-16 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-lg"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            {t('stepExpense.perMonth')}
          </span>
        </div>
        {errors.expense && (
          <p className="mt-1 text-sm text-red-500">{errors.expense}</p>
        )}
      </div>

      {annualExpense != null && annualExpense > 0 && (
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-emerald-700 font-medium">
          {t('stepExpense.annualExpense', { amount: formatCurrency(annualExpense) })}
        </div>
      )}

      <InfoBlock
        content={t('stepExpense.infoContent')}
        links={[
          {
            label: t('stepExpense.infoLinkReplacement'),
            url: 'https://www.investopedia.com/terms/r/replacement-rate.asp',
          },
        ]}
      />

      <div className="mt-6 flex justify-end">
        <button
          onClick={validate}
          className="px-6 py-2.5 rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer font-medium"
        >
          {t('app.next')}
        </button>
      </div>
    </div>
  );
}
