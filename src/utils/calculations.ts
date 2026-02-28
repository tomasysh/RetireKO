/**
 * Pure financial calculation functions for retirement planning.
 */

export function calculateFutureExpense(
  annualExpense: number,
  inflationRate: number,
  years: number
): number {
  return annualExpense * Math.pow(1 + inflationRate / 100, years);
}

export function calculateRetirementTarget(futureAnnualExpense: number): number {
  return futureAnnualExpense * 25; // 4% rule
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
