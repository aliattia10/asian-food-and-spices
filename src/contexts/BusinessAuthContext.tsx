import React, { createContext, useContext, useMemo, useState } from 'react';

type CustomerType = 'retail' | 'business';

interface BusinessProfile {
  businessName: string;
  businessIdentification: string;
  swissBusinessNumber: string;
  country: string;
  email: string;
}

interface BusinessAuthContextType {
  customerType: CustomerType;
  businessProfile: BusinessProfile | null;
  isBusinessAuthenticated: boolean;
  minimumRetailOrderChf: number;
  switchToRetail: () => void;
  loginBusiness: (profile: BusinessProfile) => void;
  logoutBusiness: () => void;
}

const STORAGE_KEY = 'afs_business_profile_v1';
const MIN_RETAIL_ORDER_CHF = 50;

const BusinessAuthContext = createContext<BusinessAuthContextType | undefined>(undefined);

function readStoredProfile(): BusinessProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BusinessProfile;
    if (!parsed?.businessName || !parsed?.swissBusinessNumber) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const BusinessAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(() => readStoredProfile());

  const loginBusiness = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  };

  const logoutBusiness = () => {
    setBusinessProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchToRetail = () => {
    logoutBusiness();
  };

  const value = useMemo<BusinessAuthContextType>(
    () => ({
      customerType: businessProfile ? 'business' : 'retail',
      businessProfile,
      isBusinessAuthenticated: Boolean(businessProfile),
      minimumRetailOrderChf: MIN_RETAIL_ORDER_CHF,
      switchToRetail,
      loginBusiness,
      logoutBusiness,
    }),
    [businessProfile],
  );

  return <BusinessAuthContext.Provider value={value}>{children}</BusinessAuthContext.Provider>;
};

export const useBusinessAuth = () => {
  const ctx = useContext(BusinessAuthContext);
  if (!ctx) throw new Error('useBusinessAuth must be used within BusinessAuthProvider');
  return ctx;
};

export type { BusinessProfile, CustomerType };
