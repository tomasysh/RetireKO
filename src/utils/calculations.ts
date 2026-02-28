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

export function formatCurrency(amount: number): string {
  return Math.round(amount).toLocaleString('zh-TW');
}
