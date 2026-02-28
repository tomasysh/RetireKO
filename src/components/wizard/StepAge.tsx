import { useState, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';
import { useRetirement } from '../../context/RetirementContext';
import InfoBlock from '../InfoBlock';
import StepHeader from '../ui/StepHeader';

interface StepProps {
  onNext: () => void;
}

export default function StepAge({ onNext }: StepProps) {
  const { t } = useI18n();
  const { state, dispatch } = useRetirement();

  const [currentAge, setCurrentAge] = useState(state.currentAge?.toString() ?? '');
  const [retireAge, setRetireAge] = useState(state.retireAge?.toString() ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const yearsToRetire =
    currentAge && retireAge ? parseInt(retireAge) - parseInt(currentAge) : null;

  useEffect(() => {
    const ca = parseInt(currentAge);
    const ra = parseInt(retireAge);
    if (!isNaN(ca) && !isNaN(ra) && ra > ca) {
      dispatch({ type: 'SET_AGE', currentAge: ca, retireAge: ra });
    }
  }, [currentAge, retireAge, dispatch]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const ca = parseInt(currentAge);
    const ra = parseInt(retireAge);

    if (!currentAge) newErrors.currentAge = t('stepAge.validation.ageRequired');
    else if (ca < 18 || ca > 80) newErrors.currentAge = t('stepAge.validation.ageRange');

    if (!retireAge) newErrors.retireAge = t('stepAge.validation.retireRequired');
    else if (ra < 30 || ra > 100) newErrors.retireAge = t('stepAge.validation.retireRange');
    else if (ra <= ca) newErrors.retireAge = t('stepAge.validation.retireAfterCurrent');

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      dispatch({ type: 'SET_AGE', currentAge: ca, retireAge: ra });
      onNext();
    }
  };

  return (
    <div>
      <StepHeader emoji="⏳" step={1} title={t('stepAge.title')} />

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('stepAge.currentAge')}
          </label>
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(e.target.value)}
            placeholder={t('stepAge.currentAgePlaceholder')}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-lg"
          />
          {errors.currentAge && (
            <p className="mt-1 text-sm text-red-500">{errors.currentAge}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('stepAge.retireAge')}
          </label>
          <input
            type="number"
            value={retireAge}
            onChange={(e) => setRetireAge(e.target.value)}
            placeholder={t('stepAge.retireAgePlaceholder')}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-lg"
          />
          {errors.retireAge && (
            <p className="mt-1 text-sm text-red-500">{errors.retireAge}</p>
          )}
        </div>

        {yearsToRetire != null && yearsToRetire > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-emerald-700 font-medium">
            {t('stepAge.yearsToRetire', { years: yearsToRetire })}
          </div>
        )}
      </div>

      <InfoBlock
        content={t('stepAge.infoContent')}
        links={[
          {
            label: t('stepAge.infoLinkCompound'),
            url: 'https://www.investopedia.com/terms/c/compoundinterest.asp',
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
