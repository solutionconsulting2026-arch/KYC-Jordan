import React, { useState, useEffect } from 'react';
import { useKycStore } from '../../store/KycContext';
import { useRouter } from '../../router/AppRouter';
import { HeaderStrip } from './HeaderStrip';
import { CustomerProfileCard } from './CustomerProfileCard';
import { InsightCard } from './InsightCard';
import { AssignedSignatoriesCard } from './AssignedSignatoriesCard';
import { CompliancesTab } from './CompliancesTab';
import { ShowHierarchyModal } from './ShowHierarchyModal';
import { InitiateKycModal } from './InitiateKycModal';
import { ActionCenterDrawer } from '../..//components/shell/ActionCenterDrawer';
import {
  LayoutDashboard,
  Camera,
  Users2,
  FileSpreadsheet,
  Coins,
  Package,
  Receipt,
  Target,
  ShieldCheck,
  Newspaper,
  Percent,
  ChevronDown,
  Bell,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import { diffDays } from '../../domain/dateUtils';
import { KYC_CONFIG } from '../../config/kycConfig';

export const Corporate360Page: React.FC = () => {
  const { currentRoute, navigate } = useRouter();
  const { customers, profiles, currentDate, cases, documents, parties } = useKycStore();

  const cif = currentRoute.cif || '00001715';
  const customer = customers[cif] || customers['00001715'];

  const [activeTab, setActiveTab] = useState<string>(currentRoute.tab || 'snapshot');
  const [snapshotSubTab, setSnapshotSubTab] = useState<'info' | 'alerts'>('info');

  const [isHierarchyOpen, setIsHierarchyOpen] = useState(false);
  const [isActionCenterOpen, setIsActionCenterOpen] = useState(false);
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [initiateType, setInitiateType] = useState<'Periodic' | 'Event'>('Periodic');
  const [isGroupMode, setIsGroupMode] = useState(false);

  // Sync tab with URL
  useEffect(() => {
    if (currentRoute.tab) {
      setActiveTab(currentRoute.tab);
    }
  }, [currentRoute.tab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`#/c360/${cif}?tab=${tabId}`);
  };

  const handleOpenInitiatePeriodic = () => {
    setInitiateType('Periodic');
    setIsGroupMode(false);
    setIsInitiateModalOpen(true);
  };

  const handleOpenTriggerEvent = () => {
    setInitiateType('Event');
    setIsGroupMode(false);
    setIsInitiateModalOpen(true);
  };

  const handleOpenGroupReview = () => {
    setInitiateType('Periodic');
    setIsGroupMode(true);
    setIsInitiateModalOpen(true);
  };

  const mainTabs = [
    { id: 'summary', label: 'Customer Summary', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'snapshot', label: 'Snapshot', icon: <Camera className="w-3.5 h-3.5" /> },
    { id: 'hierarchy', label: 'Director Hierarchy', icon: <Users2 className="w-3.5 h-3.5" /> },
    { id: 'details', label: 'Details', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { id: 'financials', label: 'Financials', icon: <Coins className="w-3.5 h-3.5" /> },
    { id: 'products', label: 'Product Details', icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'transactions', label: 'Transaction Summary', icon: <Receipt className="w-3.5 h-3.5" /> },
    { id: 'deals', label: 'Strategy & Deals', icon: <Target className="w-3.5 h-3.5" /> },
    { id: 'compliances', label: 'Compliances', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'news', label: 'News Feed', icon: <Newspaper className="w-3.5 h-3.5" /> },
    { id: 'raroc', label: 'Risk & RAROC Assessment', icon: <Percent className="w-3.5 h-3.5" />, hasDropdown: true },
  ];

  return (
    <div className="flex-1 flex flex-col p-5 gap-4 overflow-y-auto max-w-[1600px] w-full mx-auto animate-in fade-in duration-150">
      {/* Title Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-[#1F2329] tracking-tight">Corporate 360</h1>
      </div>

      {/* Header Strip Card (5 Columns with KYC STATUS) */}
      <HeaderStrip
        customer={customer}
        onOpenHierarchy={() => setIsHierarchyOpen(true)}
        onOpenActionCenter={() => setIsActionCenterOpen(true)}
      />

      {/* Primary Tab Navigation Bar per Section 4.3 */}
      <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 text-xs select-none">
        {mainTabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`h-9 px-3.5 rounded-lg border font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#1F2329] text-white border-[#1F2329] shadow-xs'
                  : 'bg-white text-[#1F2329] border-[#CFD3D8] hover:bg-slate-50'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
              {t.hasDropdown && <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Sub-Tabs (Under Tab Bar) */}
      {activeTab === 'snapshot' && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSnapshotSubTab('info')}
            className={`h-7 px-3.5 rounded-full text-xs font-bold transition-all ${
              snapshotSubTab === 'info'
                ? 'bg-[#F5C518] text-[#1F2329] shadow-xs'
                : 'bg-white border border-[#CFD3D8] text-[#5B616B] hover:text-[#1F2329]'
            }`}
          >
            Customer Information
          </button>
          <button
            onClick={() => setSnapshotSubTab('alerts')}
            className={`h-7 px-3.5 rounded-full text-xs font-bold transition-all ${
              snapshotSubTab === 'alerts'
                ? 'bg-[#F5C518] text-[#1F2329] shadow-xs'
                : 'bg-white border border-[#CFD3D8] text-[#5B616B] hover:text-[#1F2329]'
            }`}
          >
            Predictive Alerts
          </button>
        </div>
      )}

      {/* Tab Viewport Content */}
      {activeTab === 'snapshot' && snapshotSubTab === 'info' && (
        /* 3-Column Layout from reference/corporate360.png */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left: Customer Profile (~30% / 4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <CustomerProfileCard
              customer={customer}
              onOpenHierarchy={() => setIsHierarchyOpen(true)}
            />
          </div>

          {/* Center: Insight Card (~40% / 5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <InsightCard customer={customer} onInitiateKyc={handleOpenInitiatePeriodic} />
          </div>

          {/* Right: Assigned Signatories (~30% / 3 cols) */}
          <div className="lg:col-span-3 flex flex-col">
            <AssignedSignatoriesCard customer={customer} />
          </div>
        </div>
      )}

      {/* Predictive Alerts Sub-Tab View */}
      {activeTab === 'snapshot' && snapshotSubTab === 'alerts' && (
        <div className="bg-white rounded-xl shadow-xs border border-[#CFD3D8] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EB]">
            <div>
              <h3 className="font-bold text-[15px] text-[#1F2329]">Predictive Alerts Feed</h3>
              <p className="text-xs text-[#5B616B]">
                Automated AI surveillance and regulatory deadline tracking
              </p>
            </div>
            <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md font-semibold">
              Live Monitoring
            </span>
          </div>

          <div className="divide-y divide-slate-100 flex flex-col">
            <div className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <div>
                  <p className="font-bold text-xs text-[#1F2329]">
                    KYC Review Due in 25 days (19/11/2026)
                  </p>
                  <p className="text-[11px] text-[#5B616B]">
                    Periodic review window open. CBJ 24-month rule in effect.
                  </p>
                </div>
              </div>
              <button
                onClick={handleOpenInitiatePeriodic}
                className="text-xs font-bold text-[#1F5BD8] hover:underline"
              >
                Initiate Review
              </button>
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <div>
                  <p className="font-bold text-xs text-[#1F2329]">
                    Chamber of Commerce Certificate Expired
                  </p>
                  <p className="text-[11px] text-[#5B616B]">
                    Expired on 30/09/2026. Refresh required for submission.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleTabChange('compliances')}
                className="text-xs font-bold text-[#1F5BD8] hover:underline"
              >
                Upload Slip
              </button>
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <div>
                  <p className="font-bold text-xs text-[#1F2329]">
                    Signatory ID Expired: Lina Khoury
                  </p>
                  <p className="text-[11px] text-[#5B616B]">
                    National ID expired on 01/10/2026. Updated card needed.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleTabChange('compliances')}
                className="text-xs font-bold text-[#1F5BD8] hover:underline"
              >
                Request Updated ID
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compliances Tab (S-02) */}
      {activeTab === 'compliances' && (
        <CompliancesTab
          customer={customer}
          onInitiatePeriodic={handleOpenInitiatePeriodic}
          onTriggerEvent={handleOpenTriggerEvent}
          onStartGroupReview={handleOpenGroupReview}
        />
      )}

      {/* Other Tabs (Placeholder Cards for Complete Experience) */}
      {activeTab !== 'snapshot' && activeTab !== 'compliances' && (
        <div className="bg-white rounded-xl shadow-xs border border-[#CFD3D8] p-12 text-center flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-2">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[15px] text-[#1F2329]">
            {mainTabs.find((t) => t.id === activeTab)?.label}
          </h3>
          <p className="text-xs text-[#5B616B] max-w-md">
            Corporate banking portfolio data synchronized from AS400 core system. Click Snapshot or Compliances to navigate KYC review workflows.
          </p>
          <button
            onClick={() => handleTabChange('snapshot')}
            className="mt-3 text-xs font-bold text-[#1F5BD8] hover:underline"
          >
            Return to Corporate 360 Snapshot
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <ShowHierarchyModal isOpen={isHierarchyOpen} onClose={() => setIsHierarchyOpen(false)} />

      <InitiateKycModal
        isOpen={isInitiateModalOpen}
        onClose={() => setIsInitiateModalOpen(false)}
        customer={customer}
        defaultType={initiateType}
        isGroupMode={isGroupMode}
      />

      <ActionCenterDrawer
        isOpen={isActionCenterOpen}
        onClose={() => setIsActionCenterOpen(false)}
      />
    </div>
  );
};
