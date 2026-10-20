import React, { useState, useEffect } from 'react';
import { PNBButton } from '../common/PNBButton';
import { DemoScenario } from '../../data/scenarios';
import { ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, ArrowRight, Eye, Sparkles, UserCheck } from 'lucide-react';

interface RiskScreenProps {
  scenario: DemoScenario;
  onProceed: () => void;
  speed: 'normal' | 'fast';
  onTriggerHITL?: () => void;
}

export const RiskScreen: React.FC<RiskScreenProps> = ({
  scenario,
  onProceed,
  speed,
  onTriggerHITL,
}) => {
  const [isComputing, setIsComputing] = useState(true);
  const [showExecutiveDetails, setShowExecutiveDetails] = useState(false);

  useEffect(() => {
    const delay = speed === 'fast' ? 500 : 1200;
    const timer = setTimeout(() => {
      setIsComputing(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [speed]);

  const risk = scenario.riskResult;
  const isHighRisk = risk.riskTier === 'HIGH';

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4">
      {/* Stage Indicator */}
      <div className="mb-6 flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-[#A21D22] text-white flex items-center justify-center text-[10px]">5</span>
          <span className="text-[#A21D22]">Final Verification</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-slate-400">
          <span>6. Account</span>
          <span>7. Activation</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-pnb overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Almost there
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            PNB is completing a few final checks before opening your account.
          </p>

          {/* Subtle Progress Visualization */}
          <div className="mt-6 p-6 rounded-xl border border-slate-200 bg-slate-50 text-center">
            {isComputing ? (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-10 h-10 border-3 border-[#A21D22] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs font-semibold text-slate-700">
                  Synthesizing identity, regulatory, and policy factors...
                </p>
              </div>
            ) : isHighRisk ? (
              <div className="py-2 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Application Referred for Human Review
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  "Autonomous processing stopped. Decision exceeds autonomous authority per PMLA / RBI AML guidelines."
                </p>
                <div className="mt-4">
                  <button
                    onClick={onTriggerHITL}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-700 text-white text-xs font-bold shadow hover:bg-rose-800 transition-all"
                  >
                    <UserCheck className="w-4 h-4" />
                    Open Compliance Officer Review Desk
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-2 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Your application is eligible for straight-through processing
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  All automated eligibility requirements, credit bureau parameters, and compliance verifications have been satisfied.
                </p>
              </div>
            )}
          </div>

          {/* Executive Expandable Panel */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowExecutiveDetails(!showExecutiveDetails)}
              className="flex items-center justify-between w-full text-xs font-semibold text-[#A21D22] hover:text-[#7B1013] py-1.5"
            >
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#FDB913]" />
                <span>Executive Demo: View internal Risk Assessment Agent decision</span>
              </div>
              {showExecutiveDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showExecutiveDetails && (
              <div className="mt-3 p-5 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono space-y-3 border border-slate-800 animate-in fade-in duration-150">
                <div className="flex justify-between items-center text-[#FDB913] font-bold pb-2 border-b border-slate-800">
                  <span>AGENT: RISK_ASSESSMENT_AGENT (PNB-RISK-05)</span>
                  <span>Confidence: {risk.confidence}%</span>
                </div>

                <div className="flex justify-between items-center bg-slate-800/80 p-2.5 rounded-lg">
                  <span className="text-slate-400">Customer Risk Rating:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-xs ${
                      risk.riskTier === 'LOW'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {risk.riskTier} RISK
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div className="text-slate-400 font-semibold uppercase text-[10px]">
                    Key Factors Evaluated:
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Identity verified via UIDAI masked Aadhaar and NSDL PAN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Documents consistent (Middle name alignment score: {scenario.docIntelResult.similarity}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={risk.riskTier === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'}>
                      {risk.riskTier === 'HIGH' ? '⚠' : '✓'}
                    </span>
                    <span>
                      AML & Sanctions screening: {risk.riskTier === 'HIGH' ? 'Flagged (84% fuzzy match)' : 'Clear (Zero hits)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Bureau CIBIL score: {risk.cibilScore} (Prime risk category)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px]">
                  <div className="text-slate-400">Decision:</div>
                  <div className="font-bold text-white text-xs mt-0.5">{risk.recommendation}</div>
                  <div className="text-slate-400 mt-1">Reason: "{risk.rationale}"</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          {!isHighRisk && (
            <div className="mt-8 flex justify-end">
              <PNBButton
                variant="primary"
                size="lg"
                onClick={onProceed}
                disabled={isComputing}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Review Application Summary
              </PNBButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
