import React, { useState } from 'react';
import { Customer } from '../../types/kyc.types';
import { useKycStore } from '../../store/KycContext';
import { diffDays } from '../../domain/dateUtils';
import { KYC_CONFIG } from '../../config/kycConfig';
import { ShieldAlert, TrendingUp, DollarSign, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { useRouter } from '../../router/AppRouter';

interface InsightCardProps {
  customer: Customer;
  onInitiateKyc: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ customer, onInitiateKyc }) => {
  const { profiles, currentDate, documents, parties, cases } = useKycStore();
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<'All' | 'Engagement' | 'Alert' | 'NBA' | 'Meeting'>('All');

  const profile = profiles[customer.cif];
  const activeCase = profile?.openCaseId ? cases[profile.openCaseId] : undefined;
  const isCaseOpen = activeCase && activeCase.status !== 'Closed' && activeCase.status !== 'Cancelled';

  // Compute KYC tiles per Section 6.3
  const kycTiles: Array<{
    id: string;
    product: string;
    headline: string;
    body: string;
    cta: string;
    action: () => void;
    tone: 'amber' | 'bad';
  }> = [];

  // 1. Review Window Open / Overdue (only when no open case or when overdue)
  if (profile) {
    const daysToReview = diffDays(profile.nextReviewDate, currentDate);
    if (!isCaseOpen) {
      if (daysToReview < 0) {
        kycTiles.push({
          id: 'KYC-OVERDUE',
          product: 'KYC & Compliance',
          headline: `KYC review overdue by ${Math.abs(daysToReview)} days`,
          body: `Overdue under regulatory cycle. Escalation dispatched to Team Leader. Immediate submission required.`,
          cta: 'Initiate KYC Review',
          action: onInitiateKyc,
          tone: 'bad',
        });
      } else if (daysToReview <= KYC_CONFIG.leadWindowDays) {
        kycTiles.push({
          id: 'KYC-WINDOW',
          product: 'KYC & Compliance',
          headline: `KYC review due in ${daysToReview} days`,
          body: `Periodic review for ${profile.riskRating} risk customers. Last review ${profile.lastReviewDate}.`,
          cta: 'Initiate KYC Review',
          action: onInitiateKyc,
          tone: 'amber',
        });
      }
    }
  }

  // 2. Document Expired
  const custDocs = documents[customer.cif] || [];
  const expiredDoc = custDocs.find((d) => {
    if (d.versions.length === 0) return false;
    const latest = d.versions[d.versions.length - 1];
    return latest.expiryDate && diffDays(latest.expiryDate, currentDate) < 0;
  });

  if (expiredDoc) {
    const latest = expiredDoc.versions[expiredDoc.versions.length - 1];
    kycTiles.push({
      id: 'KYC-DOC-EXP',
      product: 'KYC & Compliance',
      headline: `${expiredDoc.label.split('(')[0]} expired on ${latest.expiryDate}`,
      body: 'Refresh required before the next review can be submitted.',
      cta: 'Open Compliances',
      action: () => navigate(`#/c360/${customer.cif}?tab=compliances`),
      tone: 'amber',
    });
  }

  // 3. Signatory ID Expired
  const custParties = parties[customer.cif] || [];
  const expiredSignatory = custParties.find(
    (p) => p.kind === 'Signatory' && p.idExpiry && diffDays(p.idExpiry, currentDate) < 0
  );

  if (expiredSignatory) {
    kycTiles.push({
      id: 'KYC-SIG-EXP',
      product: 'KYC & Compliance',
      headline: `Signatory ID expired: ${expiredSignatory.name}`,
      body: "Update the signatory's identity document in compliance records.",
      cta: 'Open Compliances',
      action: () => navigate(`#/c360/${customer.cif}?tab=compliances`),
      tone: 'amber',
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 flex flex-col justify-between">
      <div>
        {/* Card Header Title */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E6E8EB]">
          <h3 className="text-[15px] font-bold text-[#1F2329]">Insight</h3>
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            {kycTiles.length + customer.insights.length} Insights Active
          </span>
        </div>

        {/* Inner Sub-Tabs: All | Engagement Analysis | Alert | Next Best Action | Meeting */}
        <div className="flex items-center gap-4 mt-2.5 border-b border-[#E6E8EB] text-xs overflow-x-auto">
          {[
            { id: 'All', label: 'All' },
            { id: 'Engagement', label: 'Engagement Analysis' },
            { id: 'Alert', label: 'Alert' },
            { id: 'NBA', label: 'Next Best Action' },
            { id: 'Meeting', label: 'Meeting' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`pb-2 font-semibold whitespace-nowrap transition-all relative ${
                activeTab === t.id
                  ? 'text-[#1F2329]'
                  : 'text-[#5B616B] hover:text-[#1F2329]'
              }`}
            >
              {t.label}
              {activeTab === t.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5C518]" />
              )}
            </button>
          ))}
        </div>

        {/* Stacked Tiles Feed */}
        <div className="flex flex-col gap-3 mt-3.5 max-h-[380px] overflow-y-auto pr-1">
          {/* KYC Alert Tiles (Rendered First per BRD §6.3) */}
          {(activeTab === 'All' || activeTab === 'Alert') &&
            kycTiles.map((tile) => (
              <div
                key={tile.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  tile.tone === 'bad'
                    ? 'bg-[#FFF5F5] border-rose-300'
                    : 'bg-[#FFF9EE] border-amber-300/80 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  {tile.product}
                </div>
                <h4 className="text-[13px] font-bold text-[#1F2329] leading-snug">
                  {tile.headline}
                </h4>
                <p className="text-[12px] text-[#5B616B] mt-1 leading-relaxed">{tile.body}</p>
                <button
                  onClick={tile.action}
                  className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-bold text-[#1F5BD8] hover:underline"
                >
                  {tile.cta} <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}

          {/* Non-KYC Product Tiles (Retained from Reference Screens) */}
          {activeTab !== 'Alert' &&
            customer.insights.map((ins) => {
              const bg =
                ins.tone === 'amber'
                  ? 'bg-[#FFF9EE] border-amber-200'
                  : ins.tone === 'blue'
                  ? 'bg-[#F4F8FF] border-blue-200'
                  : 'bg-white border-slate-200 shadow-xs';

              return (
                <div key={ins.id} className={`p-3.5 rounded-xl border ${bg}`}>
                  <span className="text-[11px] font-bold text-[#5B616B] uppercase tracking-wider block mb-1">
                    {ins.product}
                  </span>
                  <h4 className="text-[13px] font-bold text-[#1F2329] leading-snug">
                    {ins.headline}
                  </h4>
                  <p className="text-[12px] text-[#5B616B] mt-1 leading-relaxed">{ins.body}</p>
                  <button
                    onClick={() => alert(`Initiating workflow for ${ins.headline}`)}
                    className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-bold text-[#1F5BD8] hover:underline"
                  >
                    {ins.cta} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      {/* Footer Buttons per Section 4.3 */}
      <div className="pt-4 mt-3 border-t border-[#E6E8EB] flex items-center justify-center gap-2">
        <button className="h-7 px-3 rounded-full border border-[#CFD3D8] hover:bg-slate-50 text-[11px] font-semibold text-[#1F2329] transition-colors">
          Edit
        </button>
        <button className="h-7 px-3 rounded-full border border-[#CFD3D8] hover:bg-slate-50 text-[11px] font-semibold text-[#1F2329] transition-colors">
          Clone
        </button>
        <button className="h-7 px-3 rounded-full border border-[#CFD3D8] hover:bg-slate-50 text-[11px] font-semibold text-[#1F2329] transition-colors">
          ETB Journey EOE POC
        </button>
        <button className="h-7 px-3 rounded-full border border-[#CFD3D8] hover:bg-slate-50 text-[11px] font-semibold text-[#1F2329] transition-colors">
          Close
        </button>
      </div>
    </div>
  );
};
