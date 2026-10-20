export type RiskLevel = 'Low' | 'Medium' | 'High';

export type LegalForm =
  | 'LLC'
  | 'PrivateShareholding'
  | 'PublicShareholding'
  | 'GeneralPartnership'
  | 'LimitedPartnership'
  | 'Foreign';

export type CaseStatus =
  | 'Open'
  | 'InProgress'
  | 'Submitted'
  | 'UnderTLReview'
  | 'UnderComplianceReview'
  | 'Returned'
  | 'PendingEDDApproval'
  | 'Approved'
  | 'Closed'
  | 'Cancelled';

export type UserRole = 'RM' | 'TL' | 'Compliance' | 'SeniorApprover' | 'UnitHead';

export interface User {
  id: string;
  name: string;
  roles: UserRole[];
  countryScope: string[];
  teamId: string;
  avatar?: string;
  email?: string;
}

export interface Customer {
  cif: string;
  accountName: string;
  parentCif?: string;
  groupId: string;
  statusCode: 'Active' | 'Dormant';
  countryOfBooking: string;
  legalForm: LegalForm;
  registrationNo: string;
  taxNo: string;
  industry: string;
  customerSince: string;
  band: string;
  rating: number;
  employeeStrength: string;
  priority: 'High' | 'Medium' | 'Low';
  segment: string;
  relationshipTenureYears: number;
  location: string;
  rmId: string;
  email: string;
  insights: Insight[];
  signatoryIds: string[];
}

export interface KycProfile {
  cif: string;
  riskRating: RiskLevel;
  lastReviewDate: string;
  nextReviewDate: string;
  lastSyncedAt: string;
  openCaseId?: string;
  history: string[]; // Past case IDs
}

export interface RiskFactor {
  key: string;
  label: string;
  last: string;
  current: string;
  source: string;
  level: RiskLevel;
  overriddenBy?: string;
  overrideComment?: string;
}

export interface Edd {
  pepDetails?: string;
  sourceOfWealth: string;
  sourceOfFunds: string;
  purpose: string;
  monitoringPlan: string;
  seniorApproverId?: string;
  decision?: 'Approved' | 'Declined';
  decisionBy?: string;
  decisionAt?: string;
  decisionComment?: string;
}

export interface WriteBackState {
  status: 'NotStarted' | 'Pending' | 'Sent' | 'Acknowledged' | 'Failed';
  at?: string;
}

export interface KycCase {
  id: string;
  caseNo: string;
  cif: string;
  type: 'Periodic' | 'Event';
  triggerReason?: string;
  triggerDetails?: string;
  status: CaseStatus;
  createdAt: string;
  createdBy: string;
  dueDate: string;
  priority: 'Normal' | 'High';
  ownerId: string;
  submittedBy?: string;
  reviewerId?: string;
  approverId?: string;
  activity: {
    attested?: boolean;
    explanation?: string;
  };
  risk: {
    factors: RiskFactor[];
    proposed?: RiskLevel;
    justification?: string;
    overrideByCompliance?: RiskLevel;
    overrideComment?: string;
  };
  eddRequired: boolean;
  eddTriggers: string[];
  edd?: Edd;
  reviewerChecklist: boolean[]; // 6 items
  outcome?: 'Retain' | 'RetainEnhanced' | 'RecommendRestriction' | 'RecommendExit';
  writeBack: WriteBackState;
  comments: CaseComment[];
  activityIds: string[];
  closedAt?: string;
}

export interface Party {
  id: string;
  cif: string;
  kind: 'Shareholder' | 'BO' | 'Signatory' | 'Director';
  name: string;
  type: 'Individual' | 'Company';
  nationality?: string;
  country?: string;
  holdingPct?: number;
  effectivePct?: number;
  heldVia?: string;
  role?: string;
  authority?: 'Sole' | 'Joint';
  phone?: string;
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
  idType?: string;
  idNumber?: string;
  idExpiry?: string;
  idVerified: boolean;
  pep: boolean;
  pepRelationship?: string;
  pepPosition?: string;
  sourceOfWealth?: string;
}

export type DocVersionStatus =
  | 'Valid'
  | 'Expiring'
  | 'Expired'
  | 'Superseded'
  | 'PendingReview';

export interface DocVersion {
  v: number;
  fileName: string;
  issueDate?: string;
  expiryDate?: string;
  uploadedBy: string;
  uploadedAt: string;
  status: DocVersionStatus;
  remarks?: string;
}

export interface DocumentItem {
  id: string;
  cif: string;
  typeKey: string;
  label: string;
  mandatory: boolean;
  versions: DocVersion[];
  requestedAt?: string;
}

export type ScreeningStatus =
  | 'Clear'
  | 'PotentialMatch'
  | 'ConfirmedMatch'
  | 'ClearedFalsePositive'
  | 'ClearedPEPConfirmed';

export interface ScreeningResult {
  partyId: string;
  partyName: string;
  role: string;
  result: ScreeningStatus;
  screenedAt: string;
  alertRef?: string;
}

export interface CaseComment {
  id: string;
  caseId: string;
  by: string;
  byName: string;
  role: string;
  at: string;
  text: string;
  kind: 'Return' | 'Accept' | 'General' | 'Decline';
}

export interface ActivityItem {
  id: string;
  cif: string;
  caseId?: string;
  type: 'Call' | 'Meeting' | 'Email' | 'Task';
  at: string;
  by: string;
  notes: string;
  nextStep?: string;
}

export interface AuditEvent {
  id: string;
  at: string;
  userId: string;
  userName: string;
  role: string;
  entity: 'Case' | 'Document' | 'Party' | 'Profile';
  entityId: string;
  action:
    | 'Create'
    | 'Update'
    | 'View'
    | 'StatusChange'
    | 'Upload'
    | 'Comment'
    | 'Export'
    | 'WriteBack'
    | 'Reassign'
    | 'Cancel';
  details: string;
  before?: unknown;
  after?: unknown;
}

export interface Notification {
  id: string;
  userId: string;
  at: string;
  type: string;
  text: string;
  link: string;
  read: boolean;
}

export interface Insight {
  id: string;
  product: string;
  headline: string;
  body: string;
  cta: string;
  tone: 'amber' | 'blue' | 'white';
  isKyc?: boolean;
}

export type KycDerivedStatus =
  | { status: 'Current'; label: 'Current'; variant: 'ok' }
  | { status: 'Due'; label: string; days: number; variant: 'warn' }
  | { status: 'Overdue'; label: string; days: number; variant: 'bad' }
  | { status: 'InReview'; label: 'In review'; variant: 'neutral' };
