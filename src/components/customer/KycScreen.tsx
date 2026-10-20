import React, { useState, useEffect } from 'react';
import { PNBButton } from '../common/PNBButton';
import { DemoScenario } from '../../data/scenarios';
import { CheckCircle2, Shield, ArrowRight, UserCheck, Video, Database, Sparkles } from 'lucide-react';

interface KycScreenProps {
  scenario: DemoScenario;
  onProceed: () => void;
  speed: 'normal' | 'fast';
}

export const KycScreen: React.FC<KycScreenProps> = ({ scenario, onProceed, speed }) => {
  const [isEvaluating, setIsEvaluating] = useState(true);

  useEffect(() => {
    const delay = speed === 'fast' ? 500 : 1200;
    const timer = setTimeout(() => {
      setIsEvaluating(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [speed]);

  const kyc = scenario.kycRoute;

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4">
      {/* Stage Indicator */}
      <div className="mb-6 flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-[#A21D22] text-white flex items-center justify-center text-[10px]">4</span>
          <span className="text-[#A21D22]">3. KYC Verification</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-slate-400">
          <span>4. Verification</span>
          <span>5. Account</span>
          <span>6. Activation</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-pnb overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Verifying your identity
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            PNB's KYC Orchestration Agent evaluates regulatory registries to identify the fastest compliant route.
          </p>

          {/* AI Orchestration Card */}
          <div className="mt-6 p-5 rounded-xl border border-slate-200 bg-gradient-to-br from-[#FDF8F8] to-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#A21D22] text-[#FDB913] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#7B1013]">KYC AGENT</h4>
                  <p className="text-[11px] text-slate-500">
                    {isEvaluating ? 'Analyzing available verification methods...' : 'Verification route determined'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                Confidence: 97%
              </span>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">
                    Your identity information is already available and validated
                  </h5>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    "We will use the simplest compliant verification path available for your profile."
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    <strong>Reasoning:</strong> {kyc.reason}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Available KYC Routes Comparison */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Recommended: Digital KYC */}
            <div className="p-4 rounded-xl border-2 border-emerald-600 bg-emerald-50/30 relative">
              <div className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Recommended Route
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Digital KYC (CKYCR)</h4>
                  <span className="text-[10px] text-emerald-700 font-semibold">Instant Execution (Paperless)</span>
                </div>
              </div>
              <p className="text-xs text-slate-600">
                Leverages your active CERSAI Central KYC Registry record (KIN 400192849201). No video call required.
              </p>
            </div>

            {/* Alternative: Video KYC */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 opacity-75">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700">Video KYC (V-KYC)</h4>
                  <span className="text-[10px] text-slate-500">Live Agent Interaction (Not Required)</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Reserved as a fallback when CKYC records are missing or require fresh photo biometric re-alignment.
              </p>
            </div>
          </div>

          {/* Progress Milestones */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Identity Verified
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Documents Consistent
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> KYC Validated
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 flex justify-end">
            <PNBButton
              variant="primary"
              size="lg"
              onClick={onProceed}
              disabled={isEvaluating}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Compliance Screening
            </PNBButton>
          </div>
        </div>
      </div>
    </div>
  );
};
