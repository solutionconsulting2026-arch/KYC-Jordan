import React from 'react';
import { AgentExecutionState, AgentId } from '../../types/agent.types';
import { AGENT_DEFINITIONS, AGENT_PIPELINE_ORDER } from '../../agents/agentDefinitions';
import { CheckCircle2, Clock, AlertTriangle, ArrowRight, Sparkles, UserCheck, ShieldAlert, Cpu } from 'lucide-react';

interface WorkflowPipelineProps {
  agentStates: Record<AgentId, AgentExecutionState>;
  onSelectAgent: (agentId: AgentId) => void;
  selectedAgentId: AgentId | null;
}

export const WorkflowPipeline: React.FC<WorkflowPipelineProps> = ({
  agentStates,
  onSelectAgent,
  selectedAgentId,
}) => {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-bold text-[#A21D22] uppercase tracking-wider block">
            Agentic Pipeline
          </span>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Autonomous Multi-Agent Orchestration
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Exception / HITL
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Standby
          </span>
        </div>
      </div>

      {/* Horizontal Nodes Sequence */}
      <div className="flex items-stretch gap-2 min-w-[920px] py-2">
        {AGENT_PIPELINE_ORDER.map((agentId, index) => {
          const def = AGENT_DEFINITIONS[agentId];
          const state = agentStates[agentId];
          const isSelected = selectedAgentId === agentId;
          const isCompleted = state?.status === 'completed';
          const isEscalated = state?.status === 'escalated';
          const isRunning = state?.status === 'running';

          return (
            <React.Fragment key={agentId}>
              <div
                onClick={() => onSelectAgent(agentId)}
                className={`flex-1 min-w-[124px] p-3 rounded-xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#A21D22] bg-[#FDF8F8] shadow-md ring-2 ring-[#A21D22]/10'
                    : isEscalated
                    ? 'border-rose-300 bg-rose-50/50 hover:border-rose-400'
                    : isCompleted
                    ? 'border-emerald-300 bg-emerald-50/30 hover:border-emerald-400'
                    : isRunning
                    ? 'border-[#FDB913] bg-amber-50/50 animate-pulse'
                    : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Step Order Badge & Status Icon */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold text-slate-400">
                      0{index + 1}
                    </span>
                    {isEscalated ? (
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isRunning ? (
                      <div className="w-3.5 h-3.5 border-2 border-[#FDB913] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                    )}
                  </div>

                  {/* Agent Name */}
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                    {def.name}
                  </h4>
                  <span className="text-[9.5px] font-mono text-slate-400 block mt-0.5">
                    {def.code}
                  </span>
                </div>

                {/* Status, Confidence & Latency */}
                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10.5px]">
                  {state?.decision ? (
                    <div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Confidence:</span>
                        <span className="font-bold text-emerald-700">
                          {state.decision.confidence}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400 text-[9.5px] mt-0.5">
                        <span>Latency:</span>
                        <span className="font-mono">{state.durationMs || def.typicalLatencyMs}ms</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic text-[10px]">
                      {isRunning ? 'Processing...' : 'Awaiting Invocation'}
                    </div>
                  )}
                </div>
              </div>

              {/* Arrow Connector between nodes */}
              {index < AGENT_PIPELINE_ORDER.length - 1 && (
                <div className="flex items-center justify-center text-slate-300 flex-shrink-0 px-0.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
