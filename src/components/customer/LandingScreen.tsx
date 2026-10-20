import React from 'react';
import { PNBButton } from '../common/PNBButton';
import { Shield, Sparkles, ArrowRight, CheckCircle2, Lock, Smartphone, Award, Clock } from 'lucide-react';
import { PNB_BRAND } from '../../config/theme.config';

interface LandingScreenProps {
  onStart: () => void;
  onExploreProducts: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart, onExploreProducts }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4">
      {/* Hero Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-pnb overflow-hidden">
        {/* PNB Top Banner Accent */}
        <div className="h-2 bg-gradient-to-r from-[#7B1013] via-[#A21D22] to-[#FDB913]" />

        <div className="p-6 sm:p-10">
          {/* Badge & PNB ONE Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 bg-[#FDF2F2] border border-[#A21D22]/20 px-3 py-1 rounded-full text-xs font-semibold text-[#A21D22]">
              <Sparkles className="w-3.5 h-3.5 text-[#FDB913]" />
              <span>Next-Gen Intelligent Digital Onboarding</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit Bank-Grade Encryption</span>
            </div>
          </div>

          {/* Main Title & Value Proposition */}
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Open your PNB Savings Account
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
              Simple, secure, and powered by intelligent assistance. No 20-field tedious forms—let us help you find and activate the right account for your needs in minutes.
            </p>
          </div>

          {/* Key Trust & Experience Highlights */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">3-Minute Digital Journey</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Straight-through processing with minimal manual steps.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">PNB ONE Ready</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Instant virtual RuPay Platinum card & UPI handle setup.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-[#FDF2F2] text-[#A21D22] flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Trusted Since 1895</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  India's 2nd largest PSU bank with over 10,000+ branches.
                </p>
              </div>
            </div>
          </div>

          {/* Call-to-Action Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <PNBButton
              variant="primary"
              size="lg"
              onClick={onStart}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Open Savings Account
            </PNBButton>
            <PNBButton
              variant="outline"
              size="lg"
              onClick={onExploreProducts}
              className="w-full sm:w-auto"
            >
              Explore Savings Accounts
            </PNBButton>
          </div>

          {/* Regulatory & Safety Footer */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#A21D22]" />
              <span>Compliant with RBI Master Directions on KYC & Digital Onboarding</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Zero paper submission • Paperless Aadhaar / CKYC verification
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
