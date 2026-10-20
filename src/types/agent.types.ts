export type AgentId = 
  | 'intake'
  | 'document'
  | 'kyc'
  | 'aml'
  | 'risk'
  | 'account'
  | 'activation';

export type AgentStatus = 'idle' | 'running' | 'completed' | 'exception' | 'escalated';

export interface AgentDecision {
  outcome: string;
  confidence: number;
  reason: string;
  recommendedAction: string;
  flags?: string[];
  metrics?: Record<string, string | number>;
}

export interface AgentDefinition {
  id: AgentId;
  name: string;
  code: string;
  order: number;
  objective: string;
  toolsUsed: string[];
  systemContext: string;
  typicalLatencyMs: number;
  pnbRegulatoryBasis: string;
}

export interface AgentExecutionState {
  id: AgentId;
  status: AgentStatus;
  startTime?: string;
  endTime?: string;
  durationMs?: number;
  inputs: Record<string, any>;
  decision?: AgentDecision;
  explanation: string;
  logs: string[];
  nextAction?: string;
}

export interface SupervisorState {
  currentAgentIndex: number;
  activeAgentId: AgentId | null;
  overallState: 'idle' | 'in_progress' | 'stp_approved' | 'human_review_required' | 'completed';
  confidenceScore: number;
  timeline: {
    timestamp: string;
    agentId: AgentId;
    action: string;
    status: 'info' | 'success' | 'warning' | 'alert';
    details: string;
  }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  agentId: AgentId;
  agentName: string;
  action: string;
  inputSummary: string;
  decision: string;
  confidence: string;
  systemApi: string;
  humanIntervention: 'None' | 'Required' | 'Completed';
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
}
