import { RiskFactor, RiskLevel } from '../types/kyc.types';

export function calculateProposedRating(factors: RiskFactor[]): RiskLevel {
  const hasHigh = factors.some((f) => f.level === 'High');
  if (hasHigh) {
    return 'High';
  }

  const mediumCount = factors.filter((f) => f.level === 'Medium').length;
  if (mediumCount >= 3) {
    return 'Medium';
  }

  return 'Low';
}

export function updateFactorForPep(factors: RiskFactor[], hasPep: boolean): RiskFactor[] {
  return factors.map((factor) => {
    if (factor.key === 'pep_linkage') {
      return {
        ...factor,
        current: hasPep ? 'Yes (PEP linkage identified)' : 'No PEP identified',
        level: hasPep ? 'High' : 'Low',
      };
    }
    return factor;
  });
}

export function updateFactorForActivity(
  factors: RiskFactor[],
  attested: boolean,
  explanation?: string
): RiskFactor[] {
  return factors.map((factor) => {
    if (factor.key === 'activity_vs_profile') {
      return {
        ...factor,
        current: attested
          ? 'Consistent with declared turnover & profile'
          : `Inconsistency noted: ${explanation || 'Under review'}`,
        level: attested ? 'Low' : 'Medium',
      };
    }
    return factor;
  });
}
