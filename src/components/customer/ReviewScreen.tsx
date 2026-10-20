import React from 'react';
import { PNBButton } from '../common/PNBButton';
import { CustomerProfile, PnbProduct } from '../../types/banking.types';
import { User, Phone, MapPin, Building, CreditCard, CheckCircle2, ArrowRight, Edit3 } from 'lucide-react';

interface ReviewScreenProps {
  customer: CustomerProfile;
  product: PnbProduct;
  onConfirm: () => void;
  onEdit: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  customer,
  product,
  onConfirm,
  onEdit,
}) => {
  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4">
      {/* Stage Indicator */}
      <div className="mb-6 flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
          <span className="w-5 h-5 rounded-full bg-[#A21D22] text-white flex items-center justify-center text-[10px]">6</span>
          <span className="text-[#A21D22]">Application Review</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-slate-400">
          <span>7. Account</span>
          <span>8. Activation</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-pnb overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                Review your application
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Please verify your details before final consent and submission to PNB CBS.
              </p>
            </div>
            <button
              onClick={onEdit}
              className="text-xs font-semibold text-[#A21D22] hover:text-[#7B1013] flex items-center gap-1 p-2 rounded-lg hover:bg-[#FDF2F2] transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {/* Personal & Identity Details */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <User className="w-4 h-4 text-[#A21D22]" />
                <span>Personal & Identity Details</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Full Name</span>
                  <span className="font-bold text-slate-800">{customer.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Date of Birth</span>
                  <span className="font-semibold text-slate-800">{customer.dob}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">PAN Number</span>
                  <span className="font-mono font-bold text-[#A21D22]">{customer.pan}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Aadhaar (Masked)</span>
                  <span className="font-mono font-bold text-slate-800">{customer.aadhaarMasked}</span>
                </div>
              </div>
            </div>

            {/* Contact & Branch Location */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#A21D22]" />
                <span>Contact Details & Branch</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Mobile Number</span>
                  <span className="font-semibold text-slate-800">{customer.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email Address</span>
                  <span className="font-semibold text-slate-800">{customer.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Allocated Branch & IFSC</span>
                  <span className="font-semibold text-slate-800">
                    {customer.branch} ({customer.branchIfsc})
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Account & Services */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-[#A21D22]" />
                <span>Account & Enabled Digital Services</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 mb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Selected Product</span>
                  <h4 className="text-sm font-bold text-[#A21D22]">{product.title}</h4>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Zero Opening Fee
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-1.5 p-2 rounded bg-white border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-700 font-medium">Debit Card: Yes (RuPay)</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded bg-white border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-700 font-medium">PNB ONE: Yes</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded bg-white border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-700 font-medium">UPI / BHIM: Yes</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded bg-white border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-700 font-medium">SMS Alerts: Yes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
            <button
              onClick={onEdit}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Back to edit information
            </button>

            <PNBButton
              variant="primary"
              size="lg"
              onClick={onConfirm}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Confirm & Continue to Consent
            </PNBButton>
          </div>
        </div>
      </div>
    </div>
  );
};
