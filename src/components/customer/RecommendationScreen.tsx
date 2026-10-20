import React, { useState } from 'react';
import { PNBButton } from '../common/PNBButton';
import { PNB_PRODUCTS } from '../../config/pnbProducts';
import { PnbProduct, CustomerProfile } from '../../types/banking.types';
import { Sparkles, CheckCircle2, HelpCircle, ArrowRight, ShieldCheck, X } from 'lucide-react';

interface RecommendationScreenProps {
  customer: CustomerProfile;
  selectedProduct: PnbProduct;
  onSelectProduct: (product: PnbProduct) => void;
  onProceed: () => void;
}

export const RecommendationScreen: React.FC<RecommendationScreenProps> = ({
  customer,
  selectedProduct,
  onSelectProduct,
  onProceed,
}) => {
  const [showWhyModal, setShowWhyModal] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4">
      {/* Onboarding Stage Indicator */}
      <div className="mb-6 flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
            ✓
          </span>
          <span className="w-5 h-5 rounded-full bg-[#A21D22] text-white flex items-center justify-center text-[10px]">
            2
          </span>
          <span className="text-[#A21D22]">Recommended Account</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-slate-400">
          <span>Documents</span>
          <span>KYC</span>
          <span>Verification</span>
          <span>Account</span>
          <span>Activation</span>
        </div>
      </div>

      {/* AI Recommendation Context Banner */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#FDF2F2] to-amber-50/50 border border-[#A21D22]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#A21D22] text-white flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[#FDB913]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#7B1013] uppercase tracking-wider block">
              Contextual AI Product Match
            </span>
            <p className="text-sm text-slate-800 mt-0.5">
              "Based on your profile, age (32), occupation (Salaried) and stated banking needs,{' '}
              <strong className="text-[#A21D22]">PNB Select Saving Account</strong> appears suitable."
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowWhyModal(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A21D22] hover:text-[#7B1013] underline underline-offset-2 flex-shrink-0 self-start sm:self-center"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Why this recommendation?</span>
        </button>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PNB_PRODUCTS.map((product) => {
          const isSelected = selectedProduct.id === product.id;
          const isRecommended = product.isRecommended;

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#A21D22] bg-white shadow-md ring-2 ring-[#A21D22]/10'
                  : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#A21D22] text-[#FDB913] text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm border border-[#7B1013]">
                  AI Recommended
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {product.tier} Tier
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-[#A21D22] bg-[#A21D22] text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2 tracking-tight">
                  {product.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[32px]">
                  {product.tagline}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                    Minimum Balance
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {product.minBalance}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                    Debit Card
                  </span>
                  <span className="text-xs font-medium text-slate-700">
                    {product.cardType}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                    Key Privileges
                  </span>
                  {product.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-[#A21D22] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? 'Selected Account' : 'Select This Account'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary CTA */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zero account opening charges • Nominal average quarterly balance</span>
        </div>

        <PNBButton
          variant="primary"
          size="lg"
          onClick={onProceed}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Continue with {selectedProduct.title}
        </PNBButton>
      </div>

      {/* "Why this recommendation?" Modal */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FDF2F2] text-[#A21D22] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#FDB913]" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Why this recommendation?
                </h3>
              </div>
              <button
                onClick={() => setShowWhyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-1">1. Customer Profile Considered</h5>
                <p>
                  Salaried Professional, Age 32, residing in New Delhi with estimated monthly income of ₹1,20,000. Customer stated requirement for active digital banking and contactless debit card.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-1">2. Account Features Considered</h5>
                <p>
                  PNB Select provides complimentary RuPay Platinum debit card with ₹1,00,000 ATM limit, ₹10 Lakh accidental insurance, and free unlimited digital transactions (NEFT/RTGS/IMPS).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-1">3. Eligibility & Cash Flow Alignment</h5>
                <p>
                  The Average Quarterly Balance (AQB) of ₹10,000 aligns comfortably with the customer's monthly income of ₹1.2L without creating dormant fee exposure.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <PNBButton variant="primary" size="sm" onClick={() => setShowWhyModal(false)}>
                Got it, thank you
              </PNBButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
