import { AgentDefinition, AgentId } from '../types/agent.types';

export const AGENT_DEFINITIONS: Record<AgentId, AgentDefinition> = {
  intake: {
    id: 'intake',
    name: 'Customer Intake Agent',
    code: 'PNB-INTAKE-01',
    order: 1,
    objective: 'Understand customer intent, classify onboarding journey, and determine optimal product tier without lengthy form-filling.',
    toolsUsed: [
      'Intent Classification Model (BFSI Domain)',
      'Customer 360 De-duplication Service',
      'PNB Retail Savings Suitability Engine',
      'Multilingual Speech/Text Transcriber',
    ],
    systemContext: 'You are the frontline intake specialist for Punjab National Bank. Your goal is to capture user intent respectfully, determine if they are New-to-Bank (NTB) or Existing-to-Bank (ETB), recommend the optimal savings product variant, and initiate the digital journey with minimum friction.',
    typicalLatencyMs: 380,
    pnbRegulatoryBasis: 'RBI Master Direction on Customer Onboarding & DPDP Act 2023 Consent Framework',
  },

  document: {
    id: 'document',
    name: 'Document Intelligence Agent',
    code: 'PNB-DOCINTEL-02',
    order: 2,
    objective: 'Extract, authenticate, mask, and cross-validate identity documents (PAN and Aadhaar/OVD) with automated tamper and anomaly detection.',
    toolsUsed: [
      'High-Precision Vision OCR Engine',
      'UIDAI Compliant 8-Digit Masking Transformer',
      'NSDL PAN Algorithmic Checksum Validator',
      'Phonetic Name Alignment & Fuzzy Matcher',
      'Document Glare / Hologram Tamper Classifier',
    ],
    systemContext: 'You are the Document Intelligence Agent for PNB. You extract structured data from physical/digital documents, enforce strict UIDAI masking of first 8 Aadhaar digits, detect photo tampering, and perform cross-document consistency checks between PAN and Aadhaar names, DOB, and identity numbers.',
    typicalLatencyMs: 620,
    pnbRegulatoryBasis: 'UIDAI Aadhaar Vault & Masking Regulations 2019 / CBDT Rule 114B',
  },

  kyc: {
    id: 'kyc',
    name: 'KYC Agent',
    code: 'PNB-KYC-03',
    order: 3,
    objective: 'Orchestrate the regulatory KYC pathway (Digital KYC vs Video KYC) by querying Central KYC Registry (CKYCR) and verifying biometrics.',
    toolsUsed: [
      'CERSAI CKYCR Registry API (14-digit KIN lookup)',
      'UIDAI e-KYC Verification Connector',
      'Facial Biometric 1:1 Match Engine (Threshold > 90%)',
      'Geofencing & Liveness Detection Validator',
    ],
    systemContext: 'You are the KYC Orchestration Agent for PNB. You query the national CKYCR database using PAN. If a valid CKYC record exists with compliant OVD, you select Digital KYC for maximum straight-through speed; otherwise, you smoothly initiate the Video-KYC slot.',
    typicalLatencyMs: 450,
    pnbRegulatoryBasis: 'RBI KYC Master Direction 2016 (Updated 2024) / PMLA Section 9A',
  },

  aml: {
    id: 'aml',
    name: 'AML Screening Agent',
    code: 'PNB-AML-04',
    order: 4,
    objective: 'Screen applicant against domestic and global sanctions, Politically Exposed Persons (PEP), and adverse media to prevent financial crime.',
    toolsUsed: [
      'UN Security Council & OFAC Sanctions Database',
      'RBI Caution List & CBI / NIA Wanted Fugitives Index',
      'Global Politically Exposed Persons (PEP) Registry',
      'Jaro-Winkler & Double Metaphone Fuzzy Match Engine',
      'Real-Time Adverse Media Entity Resolution',
    ],
    systemContext: 'You are the Anti-Money Laundering & Financial Crime Screening Agent for PNB. You evaluate applicant identity against national watchlists. You distinguish between false positives (common Indian names) and true matches using DOB, father name, and geolocation.',
    typicalLatencyMs: 510,
    pnbRegulatoryBasis: 'PMLA 2002 / FATF Recommendations 6 & 7 / RBI AML/CFT Guidelines',
  },

  risk: {
    id: 'risk',
    name: 'Risk Assessment Agent',
    code: 'PNB-RISK-05',
    order: 5,
    objective: 'Compute composite risk rating (Identity, Bureau Credit, Device/Velocity) and decide between Straight-Through Processing (STP) and Human Review.',
    toolsUsed: [
      'TransUnion CIBIL / Experian Bureau Gateway',
      'Composite Fraud Propensity Machine Learning Model',
      'Device Fingerprint & Geo-IP Velocity Analyzer',
      'PNB Retail Underwriting Policy Rules Matrix',
    ],
    systemContext: 'You are the Risk Assessment & Decisioning Agent for PNB. You synthesize outputs from Intake, Document, KYC, and AML agents along with CIBIL score. If confidence is high and risk is LOW, you authorize autonomous STP; if any high-risk factor appears, you route to the Compliance Supervisor.',
    typicalLatencyMs: 340,
    pnbRegulatoryBasis: 'RBI Master Circular on Risk Management & Enterprise Credit Policy',
  },

  account: {
    id: 'account',
    name: 'Account Opening Agent',
    code: 'PNB-ACCOUNT-06',
    order: 6,
    objective: 'Submit validated application into Infosys Finacle 10.x Core Banking Solution (CBS) to generate CIF, Account Number, and reserve UPI handle.',
    toolsUsed: [
      'Infosys Finacle 10.x CBS REST Adapter',
      'Customer Information File (CIF) Creation Service',
      'General Ledger (GL) Scheme Code Allocation (SBGEN)',
      'NPCI UPI VPA Reservation Gateway',
    ],
    systemContext: 'You are the Core Banking Provisioning Agent for PNB. You interact directly with Finacle CBS. You ensure atomic transactions: create Customer Master (CIF), instantiate Savings Account with scheme code SBGEN, bind branch IFSC (PUNB0018200), and link digital credentials.',
    typicalLatencyMs: 780,
    pnbRegulatoryBasis: 'Finacle 10.x Integration Architecture / Indian Banking Standards',
  },

  activation: {
    id: 'activation',
    name: 'Welcome & Activation Agent',
    code: 'PNB-ACTIVATION-07',
    order: 7,
    objective: 'Provision virtual RuPay Platinum card, activate PNB ONE digital banking, dispatch multi-channel welcome package, and trigger Next Best Action.',
    toolsUsed: [
      'RuPay Platinum Virtual Card Tokenization Host',
      'PNB ONE Digital Banking Credential Provisioner',
      'Omni-Channel Dispatcher (WhatsApp / SMS / Encrypted Email)',
      'Hyper-Personalized Next Best Action (NBA) Engine',
    ],
    systemContext: 'You are the Welcome & Activation Agent for PNB. You turn a newly opened account into an active digital banking relationship within seconds. You generate a virtual debit card, enable UPI, nudge PNB ONE app activation, and recommend contextual products.',
    typicalLatencyMs: 420,
    pnbRegulatoryBasis: 'NPCI RuPay Tokenization Framework / Customer Digital Onboarding Standards',
  },
};

export const AGENT_PIPELINE_ORDER: AgentId[] = [
  'intake',
  'document',
  'kyc',
  'aml',
  'risk',
  'account',
  'activation',
];
