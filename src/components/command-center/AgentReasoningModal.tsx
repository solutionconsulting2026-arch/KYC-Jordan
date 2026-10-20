import React from 'react';
import { AgentExecutionState, AgentId } from '../../types/agent.types';
import { AGENT_DEFINITIONS } from '../../agents/agentDefinitions';
import { X, Sparkles, CheckCircle2, ShieldCheck, Wrench, ArrowRight, Cpu, FileCode } from 'lucide-react';
import { PNBButton } from '../common/PNBButton';

interface AgentReasoningModalProps {
  agentId: AgentId;
  state: AgentExecutionState;
  onClose: () => void;
}

export const AgentReasoningModal: React.FC<AgentReasoningModalProps> = ({
  agentId,
  state,
  onClose,
}) => {
  const def = AGENT_DEFINITIONS[agentId];
  const decision = state?.decision;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-[#7B1013] to-[#A21D22] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FDB913]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{def.name}</h3>
                <span className="font-mono text-xs bg-white/20 text-slate-100 px-2 py-0.5 rounded">
                  {def.code}
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">{def.pnbRegulatoryBasis}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Agent Objective */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Agent Objective
            </span>
            <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {def.objective}
            </p>
          </div>

          {/* Decision & Confidence Box */}
          {decision ? (
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Autonomous Decision
                </span>
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-full">
                  Confidence: {decision.confidence}%
                </span>
              </div>
              <h4 className="text-sm font-bold text-emerald-900">{decision.outcome}</h4>
              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                <strong>Reason:</strong> "{decision.reason}"
              </p>
              <div className="mt-2 pt-2 border-t border-emerald-200/80 text-[11px] text-emerald-700">
                <strong>Action Taken:</strong> {decision.recommendedAction}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-lg text-slate-500 italic">
              Decision pending or agent in standby state.
            </div>
          )}

          {/* Tools Used */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-[#A21D22]" />
              <span>Specialized Tools & Machine Learning Models Used</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {def.toolsUsed.map((tool, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A21D22]" />
                  <span className="font-medium text-[11px]">{tool}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inputs Evaluated */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5 text-blue-600" />
              <span>Input Context Ingested</span>
            </span>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl overflow-x-auto text-[11px] font-mono leading-tight">
              {JSON.stringify(state.inputs, null, 2)}
            </pre>
          </div>

          {/* Detailed Execution Logs */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Internal Chain-of-Thought & Execution Steps
            </span>
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px]">
              {state.logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-700">
                  <span className="text-slate-400">[{idx + 1}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Action Handoff */}
          {state.nextAction && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Supervisor Handoff
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#A21D22]">
                <span>{state.nextAction}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <PNBButton variant="outline" size="sm" onClick={onClose}>
            Close Inspector
          </PNBButton>
        </div>
      </div>
    </div>
  );
};
