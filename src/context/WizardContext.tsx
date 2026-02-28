import { createContext, useContext, useState, type ReactNode } from 'react';

interface WizardContextType {
  currentStep: number;
  totalSteps: number;
  goNext: () => void;
  goPrev: () => void;
  goToStep: (step: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

const WizardContext = createContext<WizardContextType | null>(null);

const TOTAL_STEPS = 4; // Age, Expense, Inflation, Result

export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const goToStep = (step: number) => setCurrentStep(step);

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        totalSteps: TOTAL_STEPS,
        goNext,
        goPrev,
        goToStep,
        isFirst: currentStep === 0,
        isLast: currentStep === TOTAL_STEPS - 1,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) throw new Error('useWizard must be used within WizardProvider');
  return context;
}
