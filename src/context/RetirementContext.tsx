import { createContext, useContext, useReducer, type ReactNode } from 'react';

export interface RetirementState {
  currentAge: number | null;
  retireAge: number | null;
  monthlyExpense: number | null;
  inflationRate: number;
  annualReturn: number;
  // Computed results
  yearsToRetire: number | null;
  annualExpense: number | null;
  futureAnnualExpense: number | null;
  retirementTarget: number | null;
  monthlySaving: number | null;
}

type Action =
  | { type: 'SET_AGE'; currentAge: number; retireAge: number }
  | { type: 'SET_EXPENSE'; monthlyExpense: number }
  | { type: 'SET_INFLATION'; inflationRate: number }
  | { type: 'SET_RETURN'; annualReturn: number }
  | { type: 'CALCULATE' }
  | { type: 'RESET' };

const initialState: RetirementState = {
  currentAge: null,
  retireAge: null,
  monthlyExpense: null,
  inflationRate: 2,
  annualReturn: 6,
  yearsToRetire: null,
  annualExpense: null,
  futureAnnualExpense: null,
  retirementTarget: null,
  monthlySaving: null,
};

function calculateFutureExpense(annualExpense: number, inflationRate: number, years: number): number {
  return annualExpense * Math.pow(1 + inflationRate / 100, years);
}

function calculateRetirementTarget(futureAnnualExpense: number): number {
  return futureAnnualExpense * 25; // 4% rule
}

function calculateMonthlySaving(target: number, years: number, annualReturn: number = 0.06): number {
  const monthlyReturn = annualReturn / 12;
  const months = years * 12;
  if (monthlyReturn === 0) return target / months;
  // Future value of annuity formula: FV = PMT * ((1+r)^n - 1) / r
  return target / ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
}

function reducer(state: RetirementState, action: Action): RetirementState {
  switch (action.type) {
    case 'SET_AGE': {
      const yearsToRetire = action.retireAge - action.currentAge;
      return { ...state, currentAge: action.currentAge, retireAge: action.retireAge, yearsToRetire };
    }
    case 'SET_EXPENSE': {
      const annualExpense = action.monthlyExpense * 12;
      return { ...state, monthlyExpense: action.monthlyExpense, annualExpense };
    }
    case 'SET_INFLATION':
      return { ...state, inflationRate: action.inflationRate };
    case 'SET_RETURN':
      return { ...state, annualReturn: action.annualReturn };
    case 'CALCULATE': {
      if (state.annualExpense == null || state.yearsToRetire == null) return state;
      const futureAnnualExpense = calculateFutureExpense(state.annualExpense, state.inflationRate, state.yearsToRetire);
      const retirementTarget = calculateRetirementTarget(futureAnnualExpense);
      const monthlySaving = calculateMonthlySaving(retirementTarget, state.yearsToRetire, state.annualReturn / 100);
      return { ...state, futureAnnualExpense, retirementTarget, monthlySaving };
    }
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface RetirementContextType {
  state: RetirementState;
  dispatch: React.Dispatch<Action>;
}

const RetirementContext = createContext<RetirementContextType | null>(null);

export function RetirementProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <RetirementContext.Provider value={{ state, dispatch }}>
      {children}
    </RetirementContext.Provider>
  );
}

export function useRetirement() {
  const context = useContext(RetirementContext);
  if (!context) throw new Error('useRetirement must be used within RetirementProvider');
  return context;
}
