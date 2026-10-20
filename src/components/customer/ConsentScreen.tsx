import React, { useState } from 'react';
import { PNBButton } from '../common/PNBButton';
import { ShieldCheck, Lock, CheckSquare, Square, ArrowRight, FileCheck } from 'lucide-react';
import { PNB_BRAND } from '../../config/theme.config';

interface ConsentScreenProps {
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({ onSubmit, isSubmitting = false }) => {
  const [agreedKyc, setAgreedKyc] = useState(true);
  const [agreedDpdp, setAgreedDpdp] = useState(true);
  const [agreedCommunication, setAgreedCommunication] = useState(true);
  const [agreedTerms, setAgreedTerms] = useState(true);

  const canSubmit = agreedKyc && agreedDpdp && agreedTerms;

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4">
      {/* Stage Indicator */}
      <div className="mb-6 flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-[#A21D22] text-white flex items-center justify-center text-[10px]">7</span>
          <span className="text-[#A21D22]">Consent & Declarations</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-slate-400">
          <span>8. Account Opening</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-pnb overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                Consent & Regulatory Declaration
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                In compliance with Reserve Bank of India and DPDP Act 2023 guidelines.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <Lock className="w-3.5 h-3.5" />
              <span>Digital Signature Authenticated</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {/* KYC & Identity Declaration */}
            <div
              onClick={() => setAgreedKyc(!agreedKyc)}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer bg-slate-50/50 flex items-start gap-3.5"
            >
              <div className="mt-0.5 text-[#A21D22]">
                {agreedKyc ? (
                  <CheckSquare className="w-5 h-5 fill-[#A21D22] text-white" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  KYC & Identity Verification Consent
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  I voluntarily submit my PAN and Aadhaar details to Punjab National Bank for the purpose of establishing identity and opening a Savings Account under RBI Master Direction on KYC. I confirm that the details furnished are true and authentic.
                </p>
              </div>
            </div>

            {/* DPDP Act 2023 Privacy Consent */}
            <div
              onClick={() => setAgreedDpdp(!agreedDpdp)}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer bg-slate-50/50 flex items-start gap-3.5"
            >
              <div className="mt-0.5 text-[#A21D22]">
                {agreedDpdp ? (
                  <CheckSquare className="w-5 h-5 fill-[#A21D22] text-white" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Data Privacy & Processing Consent (DPDP Act 2023)
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  I consent to the collection, verification, and automated risk scoring of my application data strictly for account provisioning, fraud prevention, and regulatory reporting to RBI, CERSAI, and FIU-IND.
                </p>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div
              onClick={() => setAgreedTerms(!agreedTerms)}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer bg-slate-50/50 flex items-start gap-3.5"
            >
              <div className="mt-0.5 text-[#A21D22]">
                {agreedTerms ? (
                  <CheckSquare className="w-5 h-5 fill-[#A21D22] text-white" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Bank Rules & Schedule of Charges
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  I agree to abide by the General Terms and Conditions governing Savings Accounts, RuPay Debit Card issuance guidelines, and Average Quarterly Balance (AQB) requirements of PNB Select Saving Scheme.
                </p>
              </div>
            </div>

            {/* Digital Communications Consent */}
            <div
              onClick={() => setAgreedCommunication(!agreedCommunication)}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer bg-slate-50/50 flex items-start gap-3.5"
            >
              <div className="mt-0.5 text-[#A21D22]">
                {agreedCommunication ? (
                  <CheckSquare className="w-5 h-5 fill-[#A21D22] text-white" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Electronic & WhatsApp Communication (Optional)
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  I consent to receive electronic statements, transaction OTPs, account activation updates, and service alerts via WhatsApp, SMS, and registered email.
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Affirmative consent timestamp will be logged into PNB CBS</span>
            </div>

            <PNBButton
              variant="primary"
              size="lg"
              onClick={onSubmit}
              disabled={!canSubmit || isSubmitting}
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Confirm & Submit Application
            </PNBButton>
          </div>
        </div>
      </div>
    </div>
  );
};
