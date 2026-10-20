import React, { createContext, useContext, useEffect, useState } from 'react';

export interface RouteMatch {
  route: 'c360' | 'kyc' | 'worklist';
  cif?: string;
  caseId?: string;
  tab?: string;
  subTab?: string;
  rawHash: string;
}

interface RouterContextType {
  currentRoute: RouteMatch;
  navigate: (toHash: string) => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

function parseHash(hash: string): RouteMatch {
  const clean = hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = clean.split('?');
  const params = new URLSearchParams(queryPart || '');
  const segments = pathPart.split('/').filter(Boolean);

  if (segments[0] === 'c360') {
    return {
      route: 'c360',
      cif: segments[1] || '00001715',
      tab: params.get('tab') || 'snapshot',
      rawHash: hash,
    };
  }

  if (segments[0] === 'kyc') {
    return {
      route: 'kyc',
      caseId: segments[1],
      tab: segments[2] || 'initiation',
      subTab: params.get('subTab') || undefined,
      rawHash: hash,
    };
  }

  if (segments[0] === 'worklist') {
    return {
      route: 'worklist',
      tab: params.get('tab') || 'all',
      rawHash: hash,
    };
  }

  // Default fallback to primary demo case initiation S-06
  return {
    route: 'kyc',
    caseId: 'KYC-2026-0150',
    tab: 'initiation',
    rawHash: '#/kyc/KYC-2026-0150/initiation',
  };
}

export const AppRouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<RouteMatch>(() => {
    return parseHash(window.location.hash || '#/kyc/KYC-2026-0150/initiation');
  });

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '#/kyc/KYC-2026-0150/initiation';
    }

    const handleHashChange = () => {
      setCurrentRoute(parseHash(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (toHash: string) => {
    const formatted = toHash.startsWith('#') ? toHash : `#${toHash}`;
    window.location.hash = formatted;
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within AppRouterProvider');
  }
  return ctx;
}
