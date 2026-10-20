import React, { useState, useEffect } from 'react';
import { PNBButton } from '../common/PNBButton';
import { DemoScenario } from '../../data/scenarios';
import { ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, AlertTriangle, ArrowRight, Lock, Eye } from 'lucide-react';

interface AmlScreenProps {
  scenario: DemoScenario;
  onProceed: () => void;
  speed: 'normal' | 'fast';
}

export const AmlScreen: React.FC<AmlScreenProps> = ({ scenario, onProceed, speed }) => {
  const [isScreening, setIsScreening] = useState(true);
  const [showExecutiveDetails, setShowExecutiveDetails] = useState(false);

  useEffect(() => {
    const delay = speed === 'fast' ? 600 : 1300;
    const timer = setTimeout(() => {
      setIsScreening(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [speed]);

  const aml = scenario.amlResult;

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4">
      {/* Stage Indicator */}
      <div className="mb-6 flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-[#A21D22] text-white flex items-center justify-center text-[10px]">5</span>
          <span className="text-[#A21D22]">4. Verification & Security</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-slate-400">
          <span>5. Account</span>
          <span>6. Activation</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-pnb overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F2] text-[#A21D22] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                Running security and compliance checks
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Protecting your account with real-time regulatory compliance validation.
              </p>
            </div>
          </div>

          {/* Customer-Facing Reassurance Checklist */}
          <div className="mt-8 space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Identity Verification</h4>
                  <p className="text-[11px] text-slate-500">Cross-verified against national databases</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700">Completed</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Security Screening</h4>
                  <p className="text-[11px] text-slate-500">Device security & fraud protection rules evaluated</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700">Completed</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Regulatory Checks</h4>
                  <p className="text-[11px] text-slate-500">PMLA and Reserve Bank of India compliant</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700">Completed</span>
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-6 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>
                {isScreening
                  ? 'Analyzing security indicators in the background...'
                  : 'Your verification checks are complete. All regulatory standards met.'}
              </span>
            </div>
            {!isScreening && (
              <span className="font-bold text-emerald-700">Status: PASS</span>
            )}
          </div>

          {/* Executive Optional Expandable Panel */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowExecutiveDetails(!showExecutiveDetails)}
              className="flex items-center justify-between w-full text-xs font-semibold text-[#A21D22] hover:text-[#7B1013] py-1.5"
            >
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#FDB913]" />
                <span>Executive Demo: View internal AML Screening Agent explanation</span>
              </div>
              {showExecutiveDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showExecutiveDetails && (
              <div className="mt-3 p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono space-y-2 border border-slate-800 animate-in fade-in duration-150">
                <div className="flex justify-between text-[#FDB913] font-bold pb-1 border-b border-slate-800">
                  <span>AGENT: AML_SCREENING_AGENT (PNB-AML-04)</span>
                  <span>Confidence: {aml.confidenceScore}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>Sanctions Screening: <span className="text-emerald-400 font-bold">{aml.sanctionsMatch ? 'FLAGGED' : 'CLEAR'}</span></div>
                  <div>PEP Screening: <span className="text-emerald-400 font-bold">CLEAR</span></div>
                  <div>Internal Watchlist: <span className="text-emerald-400 font-bold">CLEAR</span></div>
                  <div>Adverse Media: <span className="text-emerald-400 font-bold">NO MATERIAL MATCH</span></div>
                </div>
                <div className="pt-2 text-slate-400 text-[11px]">
                  <strong>Name Similarity Resolution:</strong> {aml.resolution}
                </div>
                <div className="text-[11px] text-slate-300">
                  <strong>Outcome:</strong> {aml.summary}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="mt-8 flex justify-end">
            <PNBButton
              variant="primary"
              size="lg"
              onClick={onProceed}
              disabled={isScreening}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Risk Assessment
            </PNBButton>
          </div>
        </div>
      </div>
    </div>
  );
};
