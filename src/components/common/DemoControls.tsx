import React from 'react';
import { Sliders, Zap, Eye, FileText, User, RotateCcw } from 'lucide-react';
import { DemoScenario } from '../../data/scenarios';
import { OnboardingStep } from '../../types/banking.types';

interface DemoControlsProps {
  currentScenario: DemoScenario;
  onSelectScenario: (scenarioId: 'stp' | 'doc_exception' | 'aml_exception') => void;
  speed: 'normal' | 'fast';
  onToggleSpeed: () => void;
  onOpenReasoning: () => void;
  onOpenAudit: () => void;
  onReset: () => void;
  currentStep: OnboardingStep;
  onJumpToStep: (step: OnboardingStep) => void;
}

export const DemoControls: React.FC<DemoControlsProps> = ({
  currentScenario,
  onSelectScenario,
  speed,
  onToggleSpeed,
  onOpenReasoning,
  onOpenAudit,
  onReset,
  currentStep,
  onJumpToStep,
}) => {
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl border border-slate-700/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Persona Badge */}
      <div className="flex items-center gap-2 border-r border-slate-700 pr-3">
        <div className="w-6 h-6 rounded-full bg-[#A21D22] flex items-center justify-center text-white">
          <User className="w-3.5 h-3.5" />
        </div>
        <div className="leading-tight">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <span>{currentScenario.customer.name}</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700">
              {currentScenario.customer.customerType}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            {currentScenario.customer.occupation} • ₹{(currentScenario.customer.monthlyIncome / 1000).toFixed(0)}k/mo
          </p>
        </div>
      </div>

      {/* Scenario Switcher */}
      <div className="flex items-center gap-1.5">
        <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Scenario:</span>
        <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => onSelectScenario('stp')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              currentScenario.id === 'stp'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            1. STP (Clean)
          </button>
          <button
            onClick={() => onSelectScenario('doc_exception')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              currentScenario.id === 'doc_exception'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            2. Doc Mismatch
          </button>
          <button
            onClick={() => onSelectScenario('aml_exception')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              currentScenario.id === 'aml_exception'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            3. AML Risk (HITL)
          </button>
        </div>
      </div>

      {/* Speed & Inspector Controls */}
      <div className="flex items-center gap-2">
        {/* Speed Toggle */}
        <button
          onClick={onToggleSpeed}
          title="Demo Simulation Speed"
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-all ${
            speed === 'fast'
              ? 'bg-[#FDB913] text-slate-900 border-[#FDB913]'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
          }`}
        >
          <Zap className="w-3 h-3" />
          <span>{speed === 'fast' ? 'Fast Demo (2x)' : 'Normal Speed'}</span>
        </button>

        {/* Reasoning Modal Button */}
        <button
          onClick={onOpenReasoning}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all text-[11px] font-semibold"
        >
          <Eye className="w-3 h-3 text-[#FDB913]" />
          <span className="hidden md:inline">Agent Reasoning</span>
        </button>

        {/* Audit Trail Button */}
        <button
          onClick={onOpenAudit}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all text-[11px] font-semibold"
        >
          <FileText className="w-3 h-3 text-emerald-400" />
          <span className="hidden md:inline">Audit Trail</span>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          title="Reset Demo to Beginning"
          aria-label="Reset Demo to Beginning"
          className="p-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-700 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
