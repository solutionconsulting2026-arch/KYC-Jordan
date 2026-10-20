import React, { useState, useEffect } from 'react';
import { PNBButton } from '../common/PNBButton';
import { MessageSquare, Bot, Sparkles, CheckCircle2, ArrowRight, UserCheck, Zap } from 'lucide-react';
import { CustomerProfile } from '../../types/banking.types';

interface IntakeScreenProps {
  customer: CustomerProfile;
  initialQuery?: string;
  onProceed: () => void;
  speed: 'normal' | 'fast';
}

export const IntakeScreen: React.FC<IntakeScreenProps> = ({
  customer,
  initialQuery = 'I want to open a savings account with digital banking.',
  onProceed,
  speed,
}) => {
  const [typedMessage, setTypedMessage] = useState(initialQuery);
  const [isProcessing, setIsProcessing] = useState(true);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);

  useEffect(() => {
    const delay = speed === 'fast' ? 600 : 1400;
    const timer = setTimeout(() => {
      setIsProcessing(false);
      setAiAnalysisComplete(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [speed]);

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4">
      {/* Onboarding Stage Indicator */}
      <div className="mb-6 flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#A21D22] text-white flex items-center justify-center text-[10px]">
            1
          </span>
          <span className="text-[#A21D22]">1. Your Needs</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-slate-400">
          <span>2. Documents</span>
          <span>3. KYC</span>
          <span>4. Verification</span>
          <span>5. Account</span>
          <span>6. Activation</span>
        </div>
      </div>

      {/* Main Conversational Box */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-pnb overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            How can we help you today?
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Tell us in your own words what banking services you are looking for.
          </p>

          {/* User Input Simulation */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#A21D22]" />
              <span>Customer Query / Statement</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                className="w-full text-sm font-medium bg-white text-slate-900 border border-slate-300 rounded-lg px-3.5 py-2.5 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#A21D22]"
              />
            </div>
          </div>

          {/* Unobtrusive AI Assistant Panel */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-gradient-to-b from-[#FDF8F8] to-white p-5">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#A21D22] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot className="w-5 h-5 text-[#FDB913]" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#7B1013]">PNB AI Assistant</h4>
                    <span className="text-[10px] font-semibold bg-[#FDB913]/20 text-[#7B1013] px-2 py-0.5 rounded-full">
                      Intake Agent Active
                    </span>
                  </div>
                  {isProcessing && (
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 animate-pulse">
                      <Zap className="w-3 h-3 text-[#FDB913]" />
                      Understanding your request...
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                  "Certainly. I can help you open a PNB Savings Account. I will guide you through the process and only ask for information that is required."
                </p>

                {/* AI Classification & Entity Tagging */}
                {aiAnalysisComplete && (
                  <div className="mt-4 pt-4 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                        Intent
                      </span>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Savings Account Opening
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                        Customer
                      </span>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        New-to-PNB (NTB)
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                        Journey
                      </span>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FDB913]" />
                        Digital Self-Onboarding
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 flex justify-end">
            <PNBButton
              variant="primary"
              size="md"
              onClick={onProceed}
              disabled={isProcessing}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Product Selection
            </PNBButton>
          </div>
        </div>
      </div>
    </div>
  );
};
