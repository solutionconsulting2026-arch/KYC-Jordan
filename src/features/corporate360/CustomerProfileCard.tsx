import React, { useState } from 'react';
import { Customer } from '../../types/kyc.types';
import { useKycStore } from '../../store/KycContext';
import { SEED_USERS } from '../../data/seed/users';
import { KycStatusChip } from '../../components/common/KycStatusChip';
import { Edit2, Diamond, Star, ExternalLink } from 'lucide-react';

interface CustomerProfileCardProps {
  customer: Customer;
  onOpenHierarchy: () => void;
}

export const CustomerProfileCard: React.FC<CustomerProfileCardProps> = ({
  customer,
  onOpenHierarchy,
}) => {
  const { profiles } = useKycStore();
  const [activeTab, setActiveTab] = useState<'Summary' | 'Contact' | 'Financials'>('Summary');

  const profile = profiles[customer.cif];
  const assignedRm = SEED_USERS.find((u) => u.id === customer.rmId) || SEED_USERS[0];

  const ratingVariant =
    profile?.riskRating === 'High' ? 'bad' : profile?.riskRating === 'Medium' ? 'warn' : 'ok';

  return (
    <div className="bg-white rounded-xl shadow-xs border border-[#CFD3D8] p-5 flex flex-col justify-between">
      {/* Header Profile Title */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs border border-slate-700">
              AL
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#1F2329] leading-snug">
                {customer.accountName}
              </h2>
              <span className="text-[12px] text-[#5B616B] font-mono">{customer.cif}</span>
            </div>
          </div>
          <button
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            title="Edit Customer Details"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Inner Sub-Tabs: Summary | Contact | Financials */}
        <div className="flex items-center gap-6 mt-3 border-b border-[#E6E8EB] text-xs">
          {(['Summary', 'Contact', 'Financials'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-semibold transition-all relative ${
                activeTab === tab
                  ? 'text-[#1F2329]'
                  : 'text-[#5B616B] hover:text-[#1F2329]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5C518]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content: Summary */}
        {activeTab === 'Summary' && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 mt-4 text-[13px]">
            <div>
              <span className="block text-[11px] text-[#5B616B]">Customer Since</span>
              <span className="font-semibold text-[#1F2329]">{customer.customerSince}</span>
            </div>

            <div>
              <span className="block text-[11px] text-[#5B616B]">Customer Band</span>
              <span className="font-semibold text-[#1F2329] flex items-center gap-1.5">
                <Diamond className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                {customer.band}
              </span>
            </div>

            <div>
              <span className="block text-[11px] text-[#5B616B]">Status Code</span>
              <span className="font-semibold text-emerald-700">{customer.statusCode}</span>
            </div>

            <div>
              <span className="block text-[11px] text-[#5B616B]">Corporate Hierarchy</span>
              <button
                onClick={onOpenHierarchy}
                className="font-semibold text-[#1F5BD8] hover:underline inline-flex items-center gap-1 text-[12px]"
              >
                Show Hierarchy <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div>
              <span className="block text-[11px] text-[#5B616B]">Customer Rating</span>
              <div className="flex items-center gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= customer.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="block text-[11px] text-[#5B616B]">Industry</span>
              <span className="font-semibold text-[#1F2329] truncate block" title={customer.industry}>
                {customer.industry}
              </span>
            </div>

            <div>
              <span className="block text-[11px] text-[#5B616B]">Employee Strength</span>
              <span className="font-semibold text-[#1F2329]">{customer.employeeStrength}</span>
            </div>

            <div>
              <span className="block text-[11px] text-[#5B616B]">Customer Priority</span>
              <span className="font-semibold text-[#1F2329]">{customer.priority}</span>
            </div>

            {/* NEW IN BRD §6.2: KYC Risk Rating */}
            <div>
              <span className="block text-[11px] text-[#5B616B]">KYC Risk Rating</span>
              <div className="mt-0.5">
                <KycStatusChip
                  label={profile?.riskRating || 'Medium'}
                  variant={ratingVariant}
                  size="sm"
                />
              </div>
            </div>

            {/* NEW IN BRD §6.2: Next KYC Review */}
            <div>
              <span className="block text-[11px] text-[#5B616B]">Next KYC Review</span>
              <span className="font-semibold text-[#1F2329] font-mono text-[12px]">
                {profile?.nextReviewDate || '19/11/2026'}
              </span>
            </div>

            <div>
              <span className="block text-[11px] text-[#5B616B]">Customer Segment</span>
              <span className="font-semibold text-[#1F2329]">{customer.segment}</span>
            </div>

            <div>
              <span className="block text-[11px] text-[#5B616B]">Relationship Tenure</span>
              <span className="font-semibold text-[#1F2329]">
                {customer.relationshipTenureYears} years
              </span>
            </div>

            <div className="col-span-2">
              <span className="block text-[11px] text-[#5B616B]">Location</span>
              <span className="font-semibold text-[#1F2329]">{customer.location}</span>
            </div>
          </div>
        )}

        {activeTab === 'Contact' && (
          <div className="flex flex-col gap-3 mt-4 text-[13px]">
            <div>
              <span className="text-[11px] text-[#5B616B] block">Primary Email</span>
              <span className="font-medium text-[#1F2329]">{customer.email}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#5B616B] block">Registered Address</span>
              <span className="font-medium text-[#1F2329]">
                Building 14, King Abdullah II St, Amman, Jordan
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#5B616B] block">Commercial Registry</span>
              <span className="font-mono text-[12px]">{customer.registrationNo}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#5B616B] block">Tax Identification No.</span>
              <span className="font-mono text-[12px]">{customer.taxNo}</span>
            </div>
          </div>
        )}

        {activeTab === 'Financials' && (
          <div className="grid grid-cols-2 gap-3 mt-4 text-[13px]">
            <div>
              <span className="text-[11px] text-[#5B616B] block">Annual Turnover</span>
              <span className="font-bold text-[#1F2329]">JOD 24.8M</span>
            </div>
            <div>
              <span className="text-[11px] text-[#5B616B] block">EBITDA Margin</span>
              <span className="font-bold text-emerald-700">18.4%</span>
            </div>
            <div>
              <span className="text-[11px] text-[#5B616B] block">Funded Exposure</span>
              <span className="font-bold text-[#1F2329]">JOD 8.5M</span>
            </div>
            <div>
              <span className="text-[11px] text-[#5B616B] block">Non-Funded LC/LG</span>
              <span className="font-bold text-[#1F2329]">JOD 4.2M</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer: Relationship Manager Profile */}
      <div className="pt-4 mt-4 border-t border-[#E6E8EB] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={assignedRm.avatar}
            alt={assignedRm.name}
            className="w-7 h-7 rounded-full object-cover border border-slate-300"
          />
          <div>
            <span className="block text-[10px] text-[#5B616B] font-semibold uppercase">
              Relationship Manager
            </span>
            <span className="text-[12px] font-bold text-[#1F2329]">{assignedRm.name}</span>
          </div>
        </div>
        <span className="text-[10px] font-semibold bg-slate-100 text-[#5B616B] px-2 py-0.5 rounded">
          Amman CIB
        </span>
      </div>
    </div>
  );
};
