import React from 'react';
import { PNBButton } from '../common/PNBButton';
import { GeneratedAccount, CustomerProfile } from '../../types/banking.types';
import { Smartphone, CheckCircle2, ShieldCheck, ArrowRight, CreditCard, Bell, Mail, Wifi } from 'lucide-react';

interface ActivationScreenProps {
  customer: CustomerProfile;
  account: GeneratedAccount;
  onProceedToDashboard: () => void;
}

export const ActivationScreen: React.FC<ActivationScreenProps> = ({
  customer,
  account,
  onProceedToDashboard,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4">
      {/* Stage Indicator */}
      <div className="mb-6 flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="text-emerald-700 font-bold">Services Activated</span>
        </div>
        <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Onboarding Complete</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-pnb overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                Your banking is ready
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Your digital banking channels and virtual payment credentials have been provisioned by the Activation Agent.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-full border border-emerald-200">
              Instant Provisioning
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Virtual RuPay Platinum Debit Card Visual (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl p-5 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl border border-slate-700 relative overflow-hidden">
                {/* Chip & Contactless */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold tracking-tight text-sm text-[#FDB913]">
                      PNB
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Platinum
                    </span>
                  </div>
                  <Wifi className="w-5 h-5 text-slate-400 rotate-90" />
                </div>

                {/* EMV Chip */}
                <div className="w-10 h-7 rounded bg-amber-200/80 border border-amber-300 mt-5 shadow-inner" />

                {/* Card Number */}
                <div className="mt-5 font-mono text-base tracking-widest text-slate-200">
                  {account.debitCardNumber}
                </div>

                {/* Cardholder & Expiry */}
                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-end justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                      Cardholder
                    </span>
                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                      {account.debitCardName}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                      Valid Thru
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-300">
                      {account.debitCardExpiry}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#FDB913] tracking-tighter">
                      RuPay
                    </span>
                    <span className="block text-[8px] text-slate-400 uppercase -mt-0.5">
                      Platinum
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 text-center mt-2.5">
                Virtual debit card enabled immediately for e-commerce and UPI tokenization.
              </p>
            </div>

            {/* Service Activation Status Checklist (7 Cols) */}
            <div className="lg:col-span-7 space-y-2.5">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">PNB ONE Mobile App</h4>
                    <p className="text-[11px] text-slate-500">Access profile ready with linked mobile</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">Activated</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">UPI / BHIM Handle</h4>
                    <p className="text-[11px] text-slate-500 font-mono text-[#A21D22]">{account.upiVpa}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">Ready</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">SMS Transaction Alerts</h4>
                    <p className="text-[11px] text-slate-500">Registered to {customer.mobile}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">Enabled</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Monthly e-Statements</h4>
                    <p className="text-[11px] text-slate-500">Scheduled to {customer.email}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">Enabled</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>PNB Welcome Kit dispatched to your registered email</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <PNBButton
                variant="primary"
                size="lg"
                onClick={onProceedToDashboard}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Continue to PNB ONE Dashboard
              </PNBButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
