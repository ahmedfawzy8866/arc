/**
 * Advisory AI Evaluation Result Type
 */
export interface EvaluationResult {
  shouldUnpublish: boolean;
  reason: string;
  isHighValue: boolean;
  leadsFound: number;
}

/**
 * Adheres to the Elite Protocol for High-End Assets:
 * 1. Assets with price >= 50,000,000 EGP are never automatically unpublished.
 * 2. Assets with < 2 leads are unpublished if NOT high-value protected.
 */
export function evaluatePropertyPerformance(price: number, leads: number): EvaluationResult {
  const isHighValue = Boolean(price >= 50000000);
  const isPoorperformer = Boolean(leads < 2);

  if (isPoorperformer && !isHighValue) {
    return {
      shouldUnpublish: true,
      reason: "Leads < 2",
      isHighValue,
      leadsFound: leads
    };
  }

  return {
    shouldUnpublish: false,
    reason: isHighValue ? "High Value Protected" : "Healthy",
    isHighValue,
    leadsFound: leads
  };
}
