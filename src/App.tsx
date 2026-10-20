import React, { useState } from 'react';
import { KycProvider, useKycStore } from './store/KycContext';
import { AppRouterProvider, useRouter } from './router/AppRouter';
import { TopBar } from './components/shell/TopBar';
import { LeftRail } from './components/shell/LeftRail';
import { DemoControlPanel } from './components/shell/DemoControlPanel';
import { ToastContainer } from './components/shell/ToastContainer';
import { ActionCenterDrawer } from './components/shell/ActionCenterDrawer';
import { ShowHierarchyModal } from './features/corporate360/ShowHierarchyModal';
import { Corporate360Page } from './features/corporate360/Corporate360Page';
import { CasePage } from './features/kyc/CasePage';
import { WorklistPage } from './features/worklist/WorklistPage';

function AppContent() {
  const { currentRoute } = useRouter();
  const [isActionCenterOpen, setIsActionCenterOpen] = useState(false);
  const [isHierarchyOpen, setIsHierarchyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#EDEFF2] text-[#1F2329] font-sans flex flex-col antialiased selection:bg-[#F5C518]/30">
      {/* Top Application Shell Bar */}
      <TopBar
        onOpenActionCenter={() => setIsActionCenterOpen(true)}
        onOpenHierarchy={() => setIsHierarchyOpen(true)}
      />

      {/* Main App Workspace Layout (Left Rail + Content Viewport) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Vertical Left Navigation Rail */}
        <LeftRail />

        {/* Viewport Router Switcher */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#EDEFF2]">
          {currentRoute.route === 'c360' && <Corporate360Page />}
          {currentRoute.route === 'kyc' && <CasePage />}
          {currentRoute.route === 'worklist' && <WorklistPage />}
        </main>
      </div>

      {/* Global Slide-Over Drawers & Modals */}
      <ActionCenterDrawer
        isOpen={isActionCenterOpen}
        onClose={() => setIsActionCenterOpen(false)}
      />

      <ShowHierarchyModal
        isOpen={isHierarchyOpen}
        onClose={() => setIsHierarchyOpen(false)}
      />

      {/* Presenter Floating Demo Control Panel (Ctrl+Shift+D) */}
      <DemoControlPanel />

      {/* Notification Toast Layer */}
      <ToastContainer />
    </div>
  );
}

export function App() {
  return (
    <KycProvider>
      <AppRouterProvider>
        <AppContent />
      </AppRouterProvider>
    </KycProvider>
  );
}

export default App;
