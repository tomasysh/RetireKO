/**
 * Pure financial calculation functions for retirement planning.
 */

export const LIFE_EXPECTANCY = {
  male: 77.42,
  female: 84.30,
} as const;

export type Gender = 'male' | 'female';

export function calculateFutureExpense(
  annualExpense: number,
  inflationRate: number,
  years: number
): number {
  return annualExpense * Math.pow(1 + inflationRate / 100, years);
}

/**
 * 4% Rule: the classic safe withdrawal rate target.
 * Target = futureAnnualExpense × 25 (i.e. 1/4% = 25x multiplier).
 * Assumes portfolio stays invested and grows indefinitely.
 */
export function calculateRetirementTarget(
  futureAnnualExpense: number
): number {
  return futureAnnualExpense * 25;
}

/**
 * Minimum target via finite annuity PV formula.
 * Calculates how much you need to fund exactly `retirementYears` years,
 * then reaching zero — i.e. the "just enough" spend-down amount.
 * Uses real return = (1 + nominal) / (1 + inflation) - 1.
 */
export function calculateMinimumTarget(
  futureAnnualExpense: number,
  retirementYears: number,
  annualReturn: number,  // percent e.g. 6
  inflationRate: number  // percent e.g. 2
): number {
  const realReturn = (1 + annualReturn / 100) / (1 + inflationRate / 100) - 1;
  if (retirementYears <= 0) return 0;
  if (realReturn <= 0) return futureAnnualExpense * retirementYears;
  return futureAnnualExpense * (1 - Math.pow(1 + realReturn, -retirementYears)) / realReturn;
}

export function calculateMonthlySaving(
  target: number,
  years: number,
  annualReturn: number = 0.06
): number {
  const monthlyReturn = annualReturn / 12;
  const months = years * 12;
  if (monthlyReturn === 0) return target / months;
  return target / ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
}

/**
 * Future value of a lump-sum current savings after `years` of growth.
 * FV = PV × (1 + r)^n
 */
export function calculateFutureValueOfSavings(
  currentSavings: number,
  annualReturn: number,  // percent e.g. 6
  years: number
): number {
  return currentSavings * Math.pow(1 + annualReturn / 100, years);
}

export interface WithdrawalRow {
  year: number;
  age: number;
  boyBalance: number;
  withdrawal: number;
  eoyBalance: number;
}

/**
 * Generate a year-by-year withdrawal schedule for retirement.
 * Year 1 withdrawal = futureAnnualExpense (4% of target).
 * Each subsequent year: withdrawal adjusted by inflation, portfolio grows at withdrawalReturn.
 */
export function generateWithdrawalSchedule(
  retirementTarget: number,
  futureAnnualExpense: number,
  inflationRate: number,       // percent e.g. 2
  withdrawalReturn: number,    // percent e.g. 7
  retirementYears: number,
  retireAge: number,
  startYear: number
): WithdrawalRow[] {
  const rows: WithdrawalRow[] = [];
  let balance = retirementTarget;
  let withdrawal = futureAnnualExpense;

  for (let i = 0; i < retirementYears; i++) {
    const boyBalance = balance;
    if (i > 0) {
      withdrawal = withdrawal * (1 + inflationRate / 100);
    }
    const actualWithdrawal = Math.min(withdrawal, Math.max(boyBalance, 0));
    const eoyBalance = Math.max(0, (boyBalance - actualWithdrawal) * (1 + withdrawalReturn / 100));

    rows.push({
      year: startYear + i,
      age: retireAge + i,
      boyBalance,
      withdrawal: actualWithdrawal,
      eoyBalance,
    });

    balance = eoyBalance;
    if (balance <= 0) break;
  }

  return rows;
}

export function formatCurrency(amount: number): string {
  return Math.round(amount).toLocaleString('zh-TW');
}
