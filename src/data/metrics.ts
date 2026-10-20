export interface ExecutiveMetrics {
  applicationsToday: number;
  stpRate: number;
  avgOnboardingTime: string;
  manualInterventionRate: number;
  exceptionsRate: number;
  comparison: {
    metric: string;
    traditional: string;
    agentic: string;
    impact: string;
    favorable: boolean;
  }[];
  regulatoryChecklist: {
    item: string;
    complianceStandard: string;
    status: 'ACTIVE' | 'ENFORCED';
    description: string;
  }[];
}

export const EXECUTIVE_METRICS: ExecutiveMetrics = {
  applicationsToday: 1248,
  stpRate: 82,
  avgOnboardingTime: '8m 42s',
  manualInterventionRate: 11,
  exceptionsRate: 7,
  comparison: [
    {
      metric: 'Average Onboarding Time (TAT)',
      traditional: '~25 minutes',
      agentic: '~8 minutes',
      impact: '68% Reduction',
      favorable: true,
    },
    {
      metric: 'Straight-Through Processing (STP) Rate',
      traditional: '60%',
      agentic: '82%',
      impact: '+22% Improvement',
      favorable: true,
    },
    {
      metric: 'Manual Operational Intervention',
      traditional: '40%',
      agentic: '11%',
      impact: '↓ 38% Operational Load',
      favorable: true,
    },
    {
      metric: 'Customer Journey Drop-off Rate',
      traditional: '38%',
      agentic: '13%',
      impact: '↓ 25% Friction Drop',
      favorable: true,
    },
    {
      metric: 'Customer Data Re-entry Burden',
      traditional: '18-24 fields',
      agentic: '0-2 confirmatory steps',
      impact: '↓ 60% Re-entry Friction',
      favorable: true,
    },
    {
      metric: 'Operational Cost per Onboarding',
      traditional: '₹420 - ₹550',
      agentic: '₹42 - ₹60',
      impact: '89% Cost Reduction',
      favorable: true,
    },
  ],
  regulatoryChecklist: [
    {
      item: 'UIDAI Aadhaar 8-digit Masking',
      complianceStandard: 'RBI KYC Master Direction / UIDAI Reg. 2019',
      status: 'ENFORCED',
      description: 'First 8 digits masked automatically in Document Intelligence Agent before persisting to database.',
    },
    {
      item: 'CKYCR Central Registry Query',
      complianceStandard: 'CERSAI / PMLA Section 9A',
      status: 'ENFORCED',
      description: 'KYC Agent validates existing 14-digit CKYC Identifier to avoid redundant customer verification.',
    },
    {
      item: 'NSDL PAN Online Verification',
      complianceStandard: 'CBDT / Income Tax Act Sec 139A',
      status: 'ENFORCED',
      description: 'Direct real-time algorithmic check against NSDL PAN database for name and operational status.',
    },
    {
      item: 'UN & RBI Sanctions Screening',
      complianceStandard: 'FATF Recommendation 6 & RBI AML Master Circular',
      status: 'ENFORCED',
      description: 'Fuzzy phonetic matching on domestic and international sanctions lists with automated HITL escalation.',
    },
    {
      item: 'DPDP Act Digital Consent Capture',
      complianceStandard: 'Digital Personal Data Protection Act 2023',
      status: 'ENFORCED',
      description: 'Granular, time-stamped, purpose-limited affirmative consent captured and auditable in CBS.',
    },
  ],
};
