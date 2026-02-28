import { useWizard } from '../../context/WizardContext';
import { useI18n } from '../../context/I18nContext';
import StepAge from './StepAge';
import StepExpense from './StepExpense';
import StepInflation from './StepInflation';
import StepResult from './StepResult';

const steps = [StepAge, StepExpense, StepInflation, StepResult];

export default function WizardLayout() {
  const { currentStep, totalSteps, goNext, goPrev, isFirst } = useWizard();
  const { t } = useI18n();
  const StepComponent = steps[currentStep];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 md:py-12">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            {t('app.step')} {currentStep + 1} {t('app.of')} {totalSteps}
          </span>
          {!isFirst && currentStep < totalSteps - 1 && (
            <button
              onClick={goPrev}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              ← {t('app.prev')}
            </button>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <StepComponent onNext={goNext} />
      </div>
    </div>
  );
}
