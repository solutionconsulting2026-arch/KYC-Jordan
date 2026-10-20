import { Customer, Party } from '../types/kyc.types';
import { KYC_CONFIG } from '../config/kycConfig';

export interface EddEvaluationResult {
  eddRequired: boolean;
  triggers: string[];
}

export function evaluateEddTriggers(customer: Customer, parties: Party[]): EddEvaluationResult {
  const triggers: string[] = [];

  // 1. Any BO or signatory PEP = Yes
  const pepParties = parties.filter((p) => p.pep);
  if (pepParties.length > 0) {
    pepParties.forEach((p) => {
      triggers.push(`PEP linkage detected on ${p.name} (${p.kind})`);
    });
  }

  // 2. Entity non-resident (non-Jordanian booking for Arab Bank Amman)
  if (customer.countryOfBooking && customer.countryOfBooking !== 'JO') {
    triggers.push(`Non-resident entity booked in ${customer.countryOfBooking}`);
  }

  // 3. Country of operation on high-risk list
  if (KYC_CONFIG.highRiskCountries.includes(customer.countryOfBooking)) {
    triggers.push(`Jurisdiction (${customer.countryOfBooking}) on high-risk regulatory watch-list`);
  }

  return {
    eddRequired: triggers.length > 0,
    triggers,
  };
}
