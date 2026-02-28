import { createContext, useContext, useReducer, type ReactNode } from 'react';
import {
  LIFE_EXPECTANCY,
  type Gender,
  calculateFutureExpense,
  calculateRetirementTarget,
  calculateMinimumTarget,
  calculateMonthlySaving,
  calculateFutureValueOfSavings,
} from '../utils/calculations';
export type { Gender } from '../utils/calculations';

export interface RetirementState {
  currentAge: number | null;
  retireAge: number | null;
  gender: Gender | null;
  lifeExpectancy: number | null;
  retirementYears: number | null;
  monthlyExpense: number | null;
  inflationRate: number;
  annualReturn: number;
  currentSavings: number;
  // Computed results
  yearsToRetire: number | null;
  annualExpense: number | null;
  futureAnnualExpense: number | null;
  retirementTarget: number | null;    // 4% rule = 25×
  minimumTarget: number | null;       // Finite annuity spend-down
  futureValueOfSavings: number | null; // Current savings grown to retirement
  monthlySaving: number | null;       // Monthly saving needed (after existing savings)
}

type Action =
  | { type: 'SET_AGE'; currentAge: number; retireAge: number }
  | { type: 'SET_GENDER'; gender: Gender }
  | { type: 'SET_EXPENSE'; monthlyExpense: number }
  | { type: 'SET_INFLATION'; inflationRate: number }
  | { type: 'SET_RETURN'; annualReturn: number }
  | { type: 'SET_SAVINGS'; currentSavings: number }
  | { type: 'CALCULATE' }
  | { type: 'RESET' };

const initialState: RetirementState = {
  currentAge: null,
  retireAge: null,
  gender: null,
  lifeExpectancy: null,
  retirementYears: null,
  monthlyExpense: null,
  inflationRate: 2,
  annualReturn: 6,
  currentSavings: 0,
  yearsToRetire: null,
  annualExpense: null,
  futureAnnualExpense: null,
  retirementTarget: null,
  minimumTarget: null,
  futureValueOfSavings: null,
  monthlySaving: null,
};

function reducer(state: RetirementState, action: Action): RetirementState {
  switch (action.type) {
    case 'SET_AGE': {
      const yearsToRetire = action.retireAge - action.currentAge;
      // Recompute retirementYears if gender already set
      const retirementYears = state.lifeExpectancy != null
        ? Math.max(Math.round(state.lifeExpectancy - action.retireAge), 1)
        : null;
      return { ...state, currentAge: action.currentAge, retireAge: action.retireAge, yearsToRetire, retirementYears };
    }
    case 'SET_GENDER': {
      const le = LIFE_EXPECTANCY[action.gender];
      const retirementYears = state.retireAge != null
        ? Math.max(Math.round(le - state.retireAge), 1)
        : null;
      return { ...state, gender: action.gender, lifeExpectancy: le, retirementYears };
    }
    case 'SET_EXPENSE': {
      const annualExpense = action.monthlyExpense * 12;
      return { ...state, monthlyExpense: action.monthlyExpense, annualExpense };
    }
    case 'SET_INFLATION':
      return { ...state, inflationRate: action.inflationRate };
    case 'SET_RETURN':
      return { ...state, annualReturn: action.annualReturn };
    case 'SET_SAVINGS':
      return { ...state, currentSavings: action.currentSavings };
    case 'CALCULATE': {
      if (state.annualExpense == null || state.yearsToRetire == null) return state;
      const futureAnnualExpense = calculateFutureExpense(state.annualExpense, state.inflationRate, state.yearsToRetire);
      const retirementTarget = calculateRetirementTarget(futureAnnualExpense);
      const minimumTarget = state.retirementYears != null
        ? calculateMinimumTarget(futureAnnualExpense, state.retirementYears, state.annualReturn, state.inflationRate)
        : null;
      const futureValueOfSavings = state.currentSavings > 0
        ? calculateFutureValueOfSavings(state.currentSavings, state.annualReturn, state.yearsToRetire)
        : null;
      const adjustedTarget = Math.max(0, retirementTarget - (futureValueOfSavings ?? 0));
      const monthlySaving = calculateMonthlySaving(adjustedTarget, state.yearsToRetire, state.annualReturn / 100);
      return { ...state, futureAnnualExpense, retirementTarget, minimumTarget, futureValueOfSavings, monthlySaving };
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
