import { CustomerProfile } from '../types/banking.types';

export interface DemoScenario {
  id: 'stp' | 'doc_exception' | 'aml_exception';
  title: string;
  shortDesc: string;
  badge: string;
  badgeType: 'success' | 'warning' | 'alert';
  customer: CustomerProfile;
  intakeText: string;
  docIntelResult: {
    panName: string;
    aadhaarName: string;
    similarity: number;
    decision: string;
    actionTaken: string;
    hasDiscrepancy: boolean;
  };
  kycRoute: {
    recommended: 'Digital KYC' | 'Video KYC' | 'Branch Verification';
    reason: string;
    ckycrStatus: 'Found & Verified' | 'Partial Match' | 'Not Found';
  };
  amlResult: {
    sanctionsMatch: boolean;
    pepMatch: boolean;
    watchlistMatch: boolean;
    adverseMedia: boolean;
    confidenceScore: number;
    summary: string;
    details: string;
    resolution: string;
  };
  riskResult: {
    riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
    cibilScore: number;
    fraudPropensity: number;
    compositeScore: number;
    recommendation: 'STRAIGHT-THROUGH PROCESSING' | 'CONDITIONAL PASS' | 'HUMAN REVIEW REQUIRED';
    confidence: number;
    rationale: string;
  };
  supervisorOutcome: {
    state: 'STP APPROVED' | 'CONDITIONAL VERIFIED' | 'HUMAN REVIEW REQUIRED';
    escalationRequired: boolean;
    escalationRole?: string;
    escalationReason?: string;
  };
}

export const DEMO_SCENARIOS: Record<string, DemoScenario> = {
  stp: {
    id: 'stp',
    title: 'Scenario 1: Straight-Through Processing (STP)',
    shortDesc: 'Clean identity, verified documents, zero AML hit, CIBIL 784 -> Instant STP Account Opening',
    badge: '100% STP Approved',
    badgeType: 'success',
    customer: {
      name: 'Rahul Mehta',
      age: 32,
      dob: '14 Aug 1994',
      location: 'New Delhi',
      customerType: 'New-to-PNB',
      occupation: 'Salaried Professional',
      monthlyIncome: 120000,
      pan: 'ABCDE1234F',
      aadhaarMasked: 'XXXX XXXX 4582',
      mobile: '+91 98XXXXXX21',
      email: 'rahul.mehta@example.com',
      address: 'Flat 402, Block C, Mayur Vihar Phase 1',
      city: 'New Delhi',
      pincode: '110091',
      branch: 'Parliament Street, New Delhi (0182)',
      branchIfsc: 'PUNB0018200',
      cibilScore: 784,
    },
    intakeText: 'I want to open a savings account with digital banking and debit card.',
    docIntelResult: {
      panName: 'Rahul Kumar Mehta',
      aadhaarName: 'Rahul K Mehta',
      similarity: 96,
      decision: 'Minor name variation detected. Phonetic and middle initial match confirmed.',
      actionTaken: 'Corroborated with CKYCR record registry. No material inconsistency identified.',
      hasDiscrepancy: false,
    },
    kycRoute: {
      recommended: 'Digital KYC',
      reason: 'CKYCR record active (CERSAI ID 400192849201). Verified biometric token exists.',
      ckycrStatus: 'Found & Verified',
    },
    amlResult: {
      sanctionsMatch: false,
      pepMatch: false,
      watchlistMatch: false,
      adverseMedia: false,
      confidenceScore: 99,
      summary: 'CLEAR - All screening checks passed with zero sanctions or PEP hits.',
      details: 'UN Sanctions: Clear | RBI Caution List: Clear | OFAC: Clear | CBI/NIA: Clear',
      resolution: 'Low confidence name collision eliminated via DOB (1994) and PAN hash differentiation.',
    },
    riskResult: {
      riskTier: 'LOW',
      cibilScore: 784,
      fraudPropensity: 0.02,
      compositeScore: 97,
      recommendation: 'STRAIGHT-THROUGH PROCESSING',
      confidence: 97,
      rationale: 'All mandatory identity and compliance checks completed successfully with no material exceptions.',
    },
    supervisorOutcome: {
      state: 'STP APPROVED',
      escalationRequired: false,
    },
  },

  doc_exception: {
    id: 'doc_exception',
    title: 'Scenario 2: Document Discrepancy & Self-Healing',
    shortDesc: 'Aadhaar name variation triggers secondary CKYCR reconciliation without failing customer',
    badge: 'Self-Healed via CKYCR',
    badgeType: 'warning',
    customer: {
      name: 'Rahul Mehta',
      age: 32,
      dob: '14 Aug 1994',
      location: 'New Delhi',
      customerType: 'New-to-PNB',
      occupation: 'Salaried Professional',
      monthlyIncome: 120000,
      pan: 'ABCDE1234F',
      aadhaarMasked: 'XXXX XXXX 4582',
      mobile: '+91 98XXXXXX21',
      email: 'rahul.mehta@example.com',
      address: 'Flat 402, Block C, Mayur Vihar Phase 1',
      city: 'New Delhi',
      pincode: '110091',
      branch: 'Parliament Street, New Delhi (0182)',
      branchIfsc: 'PUNB0018200',
      cibilScore: 762,
    },
    intakeText: 'I want to open a savings account.',
    docIntelResult: {
      panName: 'Rahul Kumar Mehta',
      aadhaarName: 'Rahul Mehta',
      similarity: 88,
      decision: 'Name variation identified: Middle name "Kumar" present in PAN but absent in Aadhaar.',
      actionTaken: 'Document Intelligence Agent invoked CKYCR query to reconcile name aliases.',
      hasDiscrepancy: true,
    },
    kycRoute: {
      recommended: 'Digital KYC',
      reason: 'CKYCR secondary alias match found. Father name and DOB identical across both IDs.',
      ckycrStatus: 'Found & Verified',
    },
    amlResult: {
      sanctionsMatch: false,
      pepMatch: false,
      watchlistMatch: false,
      adverseMedia: false,
      confidenceScore: 98,
      summary: 'CLEAR - Screening cleared with alias cross-referencing.',
      details: 'Evaluated "Rahul Kumar Mehta" and "Rahul Mehta" against UN and RBI watchlists.',
      resolution: 'Zero hits across all verified aliases.',
    },
    riskResult: {
      riskTier: 'LOW',
      cibilScore: 762,
      fraudPropensity: 0.05,
      compositeScore: 92,
      recommendation: 'CONDITIONAL PASS',
      confidence: 94,
      rationale: 'Self-healing reconciliation completed. CKYCR corroborates alias. Approved for automated processing.',
    },
    supervisorOutcome: {
      state: 'CONDITIONAL VERIFIED',
      escalationRequired: false,
    },
  },

  aml_exception: {
    id: 'aml_exception',
    title: 'Scenario 3: AML / Sanctions Risk & HITL Escalation',
    shortDesc: 'Potential PEP / Watchlist name match exceeds autonomous risk threshold -> Escalated to Human Review',
    badge: 'Human Review Required',
    badgeType: 'alert',
    customer: {
      name: 'Rahul Mehta',
      age: 32,
      dob: '14 Aug 1994',
      location: 'New Delhi',
      customerType: 'New-to-PNB',
      occupation: 'Salaried Professional',
      monthlyIncome: 120000,
      pan: 'ABCDE1234F',
      aadhaarMasked: 'XXXX XXXX 4582',
      mobile: '+91 98XXXXXX21',
      email: 'rahul.mehta@example.com',
      address: 'Flat 402, Block C, Mayur Vihar Phase 1',
      city: 'New Delhi',
      pincode: '110091',
      branch: 'Parliament Street, New Delhi (0182)',
      branchIfsc: 'PUNB0018200',
      cibilScore: 784,
    },
    intakeText: 'I want to open a savings account.',
    docIntelResult: {
      panName: 'Rahul Kumar Mehta',
      aadhaarName: 'Rahul K Mehta',
      similarity: 96,
      decision: 'Valid documents uploaded. High clarity.',
      actionTaken: 'Normal verification.',
      hasDiscrepancy: false,
    },
    kycRoute: {
      recommended: 'Digital KYC',
      reason: 'Standard identity confirmed.',
      ckycrStatus: 'Found & Verified',
    },
    amlResult: {
      sanctionsMatch: true,
      pepMatch: false,
      watchlistMatch: true,
      adverseMedia: true,
      confidenceScore: 84,
      summary: 'POTENTIAL WATCHLIST MATCH - 84% fuzzy match with Ministry of Home Affairs / SEBI debarred entity.',
      details: 'Entity Name: "Rahul R. Mehta" | Match Score: 84% | Jurisdiction: New Delhi / UAE Remittance',
      resolution: 'Autonomous threshold exceeded (Tolerance < 70%). Immediate escalation to Compliance Officer.',
    },
    riskResult: {
      riskTier: 'HIGH',
      cibilScore: 784,
      fraudPropensity: 0.42,
      compositeScore: 48,
      recommendation: 'HUMAN REVIEW REQUIRED',
      confidence: 86,
      rationale: 'Decision exceeds autonomous processing authority due to flagged sanctions match. PMLA regulatory mandate requires human officer sign-off.',
    },
    supervisorOutcome: {
      state: 'HUMAN REVIEW REQUIRED',
      escalationRequired: true,
      escalationRole: 'Principal Compliance Officer (Retail Banking)',
      escalationReason: 'Potential Sanctions / Watchlist fuzzy match (84% score) requires manual documentary verification per RBI AML Master Circular.',
    },
  },
};
