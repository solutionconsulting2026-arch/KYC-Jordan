import { RiskLevel } from '../types/kyc.types';

export interface KycConfig {
  reviewFrequencyMonths: Record<RiskLevel, number>;
  maxAllowedFrequencyMonths: number;
  leadWindowDays: number;
  eventSlaDays: number;
  reminderMilestonesDays: number[];
  tlEscalationDaysAfterDue: number;
  unitHeadEscalationDaysAfterDue: number;
  tlReviewEnabled: boolean;
  highRiskCountries: string[];
  mockLatencyMs: {
    as400Read: number;
    as400Write: number;
    fircosoft: number;
    outlook: number;
  };
}

export const KYC_CONFIG: KycConfig = {
  // BR-01: Review frequency by risk rating. Maximum allowed under CBJ instructions is 24 months.
  reviewFrequencyMonths: {
    High: 12,
    Medium: 24,
    Low: 24,
  },
  maxAllowedFrequencyMonths: 24,

  // BR-03: Window before due date to flag review as "Due in N days"
  leadWindowDays: 45,

  // Event-driven review default turnaround SLA
  eventSlaDays: 15,

  // BR-04: Reminders to RM at due - 30, due - 15, due - 7 days
  reminderMilestonesDays: [30, 15, 7],

  // Escalation thresholds
  tlEscalationDaysAfterDue: 0, // At due date: escalate to Team Leader
  unitHeadEscalationDaysAfterDue: 7, // At due + 7 days: escalate to Unit Head

  // Optional Team Leader endorsement stage prior to Compliance Review (default: false per §16.2)
  tlReviewEnabled: false,

  // High-risk country triggers for EDD (BR-13)
  highRiskCountries: ['Country X', 'DPRK', 'Iran', 'Myanmar'],

  // Simulated latency settings
  mockLatencyMs: {
    as400Read: 550,
    as400Write: 750,
    fircosoft: 600,
    outlook: 450,
  },
};
