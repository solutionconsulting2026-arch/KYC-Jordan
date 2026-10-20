import React, { useState } from 'react';
import { MetricsOverview } from './MetricsOverview';
import { WorkflowPipeline } from './WorkflowPipeline';
import { SupervisorTimeline } from './SupervisorTimeline';
import { AgentReasoningModal } from './AgentReasoningModal';
import { HITLReviewPanel } from './HITLReviewPanel';
import { AuditTrailTable } from './AuditTrailTable';
import { BusinessImpactView } from './BusinessImpactView';
import { GovernanceView } from './GovernanceView';
import { DemoScenario } from '../../data/scenarios';
import { AgentExecutionState, AgentId, AuditLogEntry } from '../../types/agent.types';
import { Layers, ShieldAlert, FileText, BarChart3, ShieldCheck, UserCheck } from 'lucide-react';

interface CommandCenterViewProps {
  scenario: DemoScenario;
  agentStates: Record<AgentId, AgentExecutionState>;
  auditLogs: AuditLogEntry[];
  onApproveOverride: () => void;
  onRejectApplication: () => void;
  onRequestMoreInfo: () => void;
  selectedAgentId: AgentId | null;
  onSelectAgent: (id: AgentId | null) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  scenario,
  agentStates,
  auditLogs,
  onApproveOverride,
  onRejectApplication,
  onRequestMoreInfo,
  selectedAgentId,
  onSelectAgent,
}) => {
  const [activeTab, setActiveTab] = useState<
    'pipeline' | 'hitl' | 'audit' | 'impact' | 'governance'
  >(scenario.id === 'aml_exception' ? 'hitl' : 'pipeline');

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Title & Console Subtitle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#A21D22] uppercase tracking-wider">
              Punjab National Bank • Enterprise Operations
            </span>
            <span className="text-[10px] bg-slate-200 text-slate-800 font-semibold px-2 py-0.2 rounded">
              v2.6 Enterprise Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Agentic Customer Onboarding Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Intelligent orchestration for retail customer onboarding across 7 autonomous AI agents.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'pipeline'
                ? 'bg-[#A21D22] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Workflow & Supervisor</span>
          </button>

          <button
            onClick={() => setActiveTab('hitl')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'hitl'
                ? 'bg-rose-600 text-white shadow-xs'
                : scenario.id === 'aml_exception'
                ? 'text-rose-700 bg-rose-50 hover:bg-rose-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>HITL Review Desk</span>
            {scenario.id === 'aml_exception' && (
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'impact'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Business Impact</span>
          </button>

          <button
            onClick={() => setActiveTab('governance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'governance'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Governance</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Cards (Always visible) */}
      <MetricsOverview />

      {/* Tab Content */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* 7-Agent Horizontal Visual Pipeline */}
          <WorkflowPipeline
            agentStates={agentStates}
            selectedAgentId={selectedAgentId}
            onSelectAgent={(id) => onSelectAgent(id)}
          />

          {/* Supervisor Panel */}
          <SupervisorTimeline scenario={scenario} />
        </div>
      )}

      {activeTab === 'hitl' && (
        <div className="animate-in fade-in duration-150">
          <HITLReviewPanel
            scenario={scenario}
            onApproveOverride={onApproveOverride}
            onRejectApplication={onRejectApplication}
            onRequestMoreInfo={onRequestMoreInfo}
          />
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="animate-in fade-in duration-150">
          <AuditTrailTable logs={auditLogs} />
        </div>
      )}

      {activeTab === 'impact' && (
        <div className="animate-in fade-in duration-150">
          <BusinessImpactView />
        </div>
      )}

      {activeTab === 'governance' && (
        <div className="animate-in fade-in duration-150">
          <GovernanceView />
        </div>
      )}

      {/* Agent Detail Modal (If an agent is clicked) */}
      {selectedAgentId && agentStates[selectedAgentId] && (
        <AgentReasoningModal
          agentId={selectedAgentId}
          state={agentStates[selectedAgentId]}
          onClose={() => onSelectAgent(null)}
        />
      )}
    </div>
  );
};
