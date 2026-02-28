import { useI18n } from '../../context/I18nContext';
import { useRetirement } from '../../context/RetirementContext';
import { LIFE_EXPECTANCY, type Gender } from '../../utils/calculations';
import StepHeader from '../ui/StepHeader';

interface StepProps {
  onNext: () => void;
}

interface GenderCard {
  gender: Gender;
  emoji: string;
  labelKey: string;
  lifeExp: number;
  taglineKey: string;
}

const cards: GenderCard[] = [
  {
    gender: 'male',
    emoji: '👨',
    labelKey: 'stepGender.male',
    lifeExp: LIFE_EXPECTANCY.male,
    taglineKey: 'stepGender.maleTagline',
  },
  {
    gender: 'female',
    emoji: '👩',
    labelKey: 'stepGender.female',
    lifeExp: LIFE_EXPECTANCY.female,
    taglineKey: 'stepGender.femaleTagline',
  },
];

export default function StepGender({ onNext }: StepProps) {
  const { t } = useI18n();
  const { state, dispatch } = useRetirement();

  const select = (gender: Gender) => {
    dispatch({ type: 'SET_GENDER', gender });
    onNext();
  };

  const retireAge = state.retireAge ?? 60;

  return (
    <div>
      <StepHeader emoji="🧬" step={2} title={t('stepGender.title')} />

      <p className="text-gray-600 mb-6 text-sm leading-relaxed">{t('stepGender.description')}</p>

      {/* Source badge */}
      <p className="text-xs text-gray-400 mb-4 text-center">
        📊 {t('stepGender.source')}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {cards.map(({ gender, emoji, labelKey, lifeExp, taglineKey }) => {
          const retirementYears = Math.max(Math.round(lifeExp - retireAge), 1);
          const isSelected = state.gender === gender;
          return (
            <button
              key={gender}
              onClick={() => select(gender)}
              className={`rounded-xl border-2 p-5 text-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40'
              }`}
            >
              <div className="text-5xl mb-2" aria-hidden="true">{emoji}</div>
              <p className="font-bold text-gray-800 text-base mb-1">{t(labelKey)}</p>
              <p className="text-2xl font-extrabold text-emerald-600 mb-1">{lifeExp}</p>
              <p className="text-xs text-gray-500 mb-3">{t('stepGender.yearsUnit')}</p>
              <div className="bg-gray-50 rounded-lg px-2 py-2 text-xs text-gray-600 leading-relaxed">
                {t(taglineKey)}
              </div>
              <div className="mt-3 bg-emerald-100 rounded-lg px-2 py-1.5 text-xs text-emerald-700 font-medium">
                🏖️ {t('stepGender.retirementYears', { n: retirementYears })}
              </div>
            </button>
          );
        })}
      </div>

      {/* Life expectancy concept */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 text-sm text-amber-800 leading-relaxed mb-4">
        <p className="font-semibold mb-1">🕯️ {t('stepGender.conceptTitle')}</p>
        <p>{t('stepGender.conceptBody')}</p>
      </div>
    </div>
  );
}
