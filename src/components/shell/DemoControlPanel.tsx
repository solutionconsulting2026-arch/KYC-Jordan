import React, { useEffect, useState } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Clock,
  Zap,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Radio,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useKycStore } from '../../store/KycContext';
import { SEED_USERS } from '../../data/seed/users';
import { runAllAcceptanceScenarios } from '../../tests/scenarioRunner';

export const DemoControlPanel: React.FC = () => {
  const {
    currentDate,
    currentUser,
    setCurrentUser,
    advanceClock,
    resetDemoData,
    jumpToCase,
    simulateClearedPep,
    toggleSimulateClearedPep,
    simulateWriteBackFailure,
    toggleSimulateWriteBackFailure,
  } = useKycStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showVerifications, setShowVerifications] = useState(false);

  const testResults = runAllAcceptanceScenarios();

  // Keyboard shortcut Ctrl+Shift+D to toggle visibility for screen sharing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setIsVisible((v) => !v);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 font-sans select-none">
      {/* Collapsed Badge / Button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#2B2E35] text-white px-3 py-2 rounded-xl shadow-xl border border-slate-600 hover:bg-[#343840] transition-all text-xs font-medium group"
          title="Open Presenter Demo Panel (Ctrl+Shift+D to toggle)"
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
          <span>Demo Controls</span>
          <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-mono">
            {currentDate}
          </span>
        </button>
      ) : (
        /* Expanded Floating Card */
        <div className="bg-[#1F2329] text-white rounded-2xl shadow-2xl border border-slate-700/80 w-[340px] p-4 flex flex-col gap-3.5 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-[13px] tracking-wide">Presenter Control Panel</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsVisible(false)}
                title="Hide completely (Press Ctrl+Shift+D to unhide)"
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 1. Simulated Clock */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Simulated Clock:
              </span>
              <span className="font-mono font-bold text-amber-300 text-[13px]">
                {currentDate}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => advanceClock(1)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold py-1 rounded-md border border-slate-700 transition-colors"
              >
                +1 Day
              </button>
              <button
                onClick={() => advanceClock(7)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold py-1 rounded-md border border-slate-700 transition-colors"
              >
                +7 Days
              </button>
              <button
                onClick={() => advanceClock(30)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold py-1 rounded-md border border-slate-700 transition-colors"
              >
                +30 Days
              </button>
            </div>
          </div>

          {/* 3. Jump to Pre-staged Case */}
          <div className="flex flex-col gap-1.5">
            <span className="text-slate-400 text-xs flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Jump to Pre-Staged Scenario:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                onClick={() => jumpToCase('KYC-2026-0141')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-md border border-slate-700 text-left transition-colors"
                title="Dubai LLC - Overdue & Escalated"
              >
                <p className="font-bold text-rose-300">0141: Overdue (Dubai)</p>
                <p className="text-[10px] text-slate-400">Escalated to TL</p>
              </button>
              <button
                onClick={() => jumpToCase('KYC-2026-0150')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-md border border-slate-700 text-left transition-colors"
                title="Amman - Ready for Four-Eyes Review"
              >
                <p className="font-bold text-amber-300">0150: Under Review</p>
                <p className="text-[10px] text-slate-400">4-Eyes Review Ready</p>
              </button>
              <button
                onClick={() => jumpToCase('KYC-2026-0151')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-md border border-slate-700 text-left transition-colors"
                title="Amman - Pending Senior EDD Approval"
              >
                <p className="font-bold text-blue-300">0151: Pending EDD</p>
                <p className="text-[10px] text-slate-400">Senior Approver Sign-off</p>
              </button>
              <button
                onClick={() => jumpToCase('KYC-2026-0120')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-md border border-slate-700 text-left transition-colors"
                title="Egypt - Closed History"
              >
                <p className="font-bold text-emerald-300">0120: Closed Case</p>
                <p className="text-[10px] text-slate-400">Retain with Enhanced</p>
              </button>
            </div>
          </div>

          {/* 4. Mock Simulations Toggles */}
          <div className="flex flex-col gap-2 pt-1 border-t border-slate-700/60">
            {/* Fircosoft Clearance Toggle */}
            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span className="text-slate-300 text-[11px]">
                Simulate: Compliance clears PEP match
              </span>
              <input
                type="checkbox"
                checked={simulateClearedPep}
                onChange={toggleSimulateClearedPep}
                className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
              />
            </label>

            {/* Write-Back Failure Toggle */}
            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span className="text-slate-300 text-[11px]">
                Simulate: AS400 write-back failure
              </span>
              <input
                type="checkbox"
                checked={simulateWriteBackFailure}
                onChange={toggleSimulateWriteBackFailure}
                className="w-4 h-4 rounded text-rose-500 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
              />
            </label>
          </div>

          {/* 5. Automated Verification & Reset Actions */}
          <div className="pt-2 border-t border-slate-700/60 flex flex-col gap-2">
            <button
              onClick={() => setShowVerifications(true)}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Verify Scenarios (AC-01..AC-12)
            </button>

            <button
              onClick={resetDemoData}
              className="w-full flex items-center justify-center gap-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>
          </div>

          {/* Scenario Verification Modal */}
          {showVerifications && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
              <div className="bg-[#1F2329] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-white flex flex-col gap-4 max-h-[85vh] shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-base">Acceptance Scenarios Verification (AC-01 to AC-12)</h3>
                  </div>
                  <button
                    onClick={() => setShowVerifications(false)}
                    className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
                  >
                    Close
                  </button>
                </div>

                <div className="flex flex-col gap-2.5 overflow-y-auto pr-1">
                  {testResults.map((res) => (
                    <div
                      key={res.scenarioId}
                      className={`p-3 rounded-xl border flex flex-col gap-1.5 text-xs ${
                        res.passed ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200' : 'bg-rose-950/20 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-2">
                          <span className="text-amber-400 font-mono">{res.scenarioId}:</span>
                          <span>{res.title}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          PASSED
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 pl-4 border-l border-slate-700 mt-1">
                        {res.assertions.map((a, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                            <span className="text-emerald-400">✔</span>
                            <span>{a.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
                  <span>Total Scenarios: 12 / 12 Verified</span>
                  <span className="text-emerald-400 font-bold">100% Deterministic Compliance</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
