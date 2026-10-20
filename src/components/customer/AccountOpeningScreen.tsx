import React, { useState, useEffect } from 'react';
import { PNBButton } from '../common/PNBButton';
import { GeneratedAccount, CustomerProfile, PnbProduct } from '../../types/banking.types';
import { Building2, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, Smartphone, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AccountOpeningScreenProps {
  customer: CustomerProfile;
  product: PnbProduct;
  account: GeneratedAccount;
  onProceed: () => void;
  speed: 'normal' | 'fast';
}

export const AccountOpeningScreen: React.FC<AccountOpeningScreenProps> = ({
  customer,
  product,
  account,
  onProceed,
  speed,
}) => {
  const [provisionStep, setProvisionStep] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const steps = [
    'Preparing account opening request...',
    'Validating application payload...',
    'Submitting to Infosys Finacle 10.x Core Banking...',
    'Creating Customer Information File (CIF)...',
    'Allocating Account Ledger (Scheme: SBGEN)...',
    'Activating digital banking services...',
  ];

  useEffect(() => {
    const stepDuration = speed === 'fast' ? 350 : 700;
    const interval = setInterval(() => {
      setProvisionStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsDone(true);
          // Trigger celebration confetti
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#A21D22', '#FDB913', '#0D824B', '#FFFFFF'],
            });
          } catch (e) {
            // Safe fallback if canvas-confetti is not loaded
          }
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [speed]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-pnb overflow-hidden">
        {/* Banner Accent */}
        <div className="h-2 bg-gradient-to-r from-[#7B1013] via-[#A21D22] to-[#FDB913]" />

        <div className="p-6 sm:p-10">
          {!isDone ? (
            /* Animated Provisioning State */
            <div className="py-8 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#FDF2F2] border border-[#A21D22]/20 flex items-center justify-center mx-auto mb-5 text-[#A21D22] shadow-inner">
                <Building2 className="w-8 h-8 animate-pulse text-[#A21D22]" />
              </div>

              <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                Opening your PNB account
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Account Opening Agent is orchestrating core banking provisioning with Infosys Finacle CBS.
              </p>

              {/* Progress Steps List */}
              <div className="mt-8 space-y-2 text-left bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                {steps.map((text, idx) => {
                  const isCurrent = idx === provisionStep;
                  const isFinished = idx < provisionStep;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 transition-all py-1 ${
                        isCurrent
                          ? 'font-bold text-[#A21D22]'
                          : isFinished
                          ? 'text-emerald-700 font-medium'
                          : 'text-slate-400'
                      }`}
                    >
                      {isFinished ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 border-2 border-[#A21D22] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                      )}
                      <span>{text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* High-Impact Account Created Success View */
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Account Provisioned in Finacle CBS</span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {account.openingDate}
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Your PNB Savings Account is ready!
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Welcome to Punjab National Bank, {customer.name}. Your account is active and primed for digital banking.
              </p>

              {/* Account Credentials Card */}
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-[#7B1013] via-[#A21D22] to-[#580A0D] text-white shadow-xl relative overflow-hidden">
                {/* Background Crest Watermark */}
                <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
                  <Building2 className="w-64 h-64 text-white" />
                </div>

                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <span className="text-[11px] font-bold text-[#FDB913] uppercase tracking-widest">
                      {product.title}
                    </span>
                    <h3 className="text-xs text-slate-200 mt-0.5">
                      {account.branchName} • IFSC: {account.ifscCode}
                    </h3>
                  </div>
                  <span className="text-xs bg-[#FDB913] text-[#7B1013] font-bold px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                    ACTIVE
                  </span>
                </div>

                <div className="mt-6 relative z-10">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block">
                    Account Number
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-2xl sm:text-3xl font-mono font-bold tracking-wider text-white">
                      {account.maskedAccountNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(account.accountNumber)}
                      title="Copy Account Number"
                      className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white"
                    >
                      {copied ? <Check className="w-4 h-4 text-[#FDB913]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-300 block uppercase">Customer ID (CIF)</span>
                    <span className="font-mono font-bold text-white">{account.cifNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-300 block uppercase">Reserved UPI VPA</span>
                    <span className="font-mono font-medium text-[#FDB913]">{account.upiVpa}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-300 block uppercase">Initial Balance</span>
                    <span className="font-bold text-white">₹0.00 (Ready to Fund)</span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Smartphone className="w-4 h-4 text-[#A21D22]" />
                  <span>Next: Activate your digital services and virtual RuPay Platinum card</span>
                </div>

                <PNBButton
                  variant="gold"
                  size="lg"
                  onClick={onProceed}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Activate Digital Services
                </PNBButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
