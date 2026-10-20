export type OnboardingStep = 
  | 'landing'           // Screen 01
  | 'intake'            // Screen 02
  | 'recommendation'    // Screen 03
  | 'documents'         // Screen 04
  | 'kyc'               // Screen 05
  | 'aml'               // Screen 06
  | 'risk'              // Screen 07
  | 'review'            // Screen 08
  | 'consent'           // Screen 09
  | 'account_opening'   // Screen 10
  | 'activation'        // Screen 11
  | 'dashboard'         // Screen 12
  | 'next_best_action'; // Screen 13

export interface CustomerProfile {
  name: string;
  age: number;
  dob: string;
  location: string;
  customerType: 'New-to-PNB' | 'Existing-Customer';
  occupation: string;
  monthlyIncome: number;
  pan: string;
  aadhaarMasked: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  branch: string;
  branchIfsc: string;
  cibilScore: number;
}

export interface PnbProduct {
  id: string;
  title: string;
  tier: 'General' | 'Select' | 'Elite' | 'Specialized';
  tagline: string;
  minBalance: string;
  features: string[];
  recommendedFor: string;
  cardType: string;
  interestRate: string;
  isRecommended?: boolean;
}

export interface DocumentVerificationData {
  panCard: {
    status: 'pending' | 'uploading' | 'analyzing' | 'validated' | 'mismatch';
    nameExtracted: string;
    dobExtracted: string;
    panExtracted: string;
    confidence: number;
    tamperCheck: 'Pass' | 'Fail';
  };
  aadhaarCard: {
    status: 'pending' | 'uploading' | 'analyzing' | 'validated' | 'mismatch';
    nameExtracted: string;
    dobExtracted: string;
    aadhaarMasked: string;
    confidence: number;
    tamperCheck: 'Pass' | 'Fail';
  };
  crossDocResult: {
    nameSimilarity: number;
    dobMatch: boolean;
    decision: string;
    status: 'accepted' | 'conditional_review' | 'failed';
  };
}

export interface GeneratedAccount {
  accountNumber: string;
  maskedAccountNumber: string;
  cifNumber: string;
  accountType: string;
  branchName: string;
  ifscCode: string;
  debitCardNumber: string;
  debitCardExpiry: string;
  debitCardName: string;
  upiVpa: string;
  openingDate: string;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'RESTRICTED';
}
