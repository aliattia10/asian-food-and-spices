import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { apiUrl } from '@/lib/api';

type CustomerType = 'retail' | 'business';
type AccountStatus = 'pending' | 'verified' | 'rejected';

interface BusinessProfile {
  businessName: string;
  businessIdentification: string;
  swissBusinessNumber: string;
  country: string;
  email: string;
  status: AccountStatus;
}

interface BusinessAuthContextType {
  customerType: CustomerType;
  businessProfile: BusinessProfile | null;
  isBusinessAuthenticated: boolean;
  minimumRetailOrderChf: number;
  switchToRetail: () => void;
  loginBusiness: (email: string, password: string) => Promise<{ error?: string; status?: string }>;
  registerBusiness: (data: RegisterData) => Promise<{ error?: string; status?: string }>;
  logoutBusiness: () => void;
}

interface RegisterData {
  businessName: string;
  businessIdentification: string;
  swissBusinessNumber: string;
  country: string;
  email: string;
  password: string;
}

const STORAGE_KEY = 'afs_business_profile_v1';
const MIN_RETAIL_ORDER_CHF = 50;

const BusinessAuthContext = createContext<BusinessAuthContextType | undefined>(undefined);

function readStoredProfile(): BusinessProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BusinessProfile;
    if (!parsed?.businessName || !parsed?.swissBusinessNumber || parsed?.status !== 'verified') return null;
    return parsed;
  } catch {
    return null;
  }
}

export const BusinessAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(() =>
    readStoredProfile(),
  );

  const loginBusiness = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(apiUrl('/api/business/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error, status: data.status };
      }
      const profile: BusinessProfile = {
        businessName: data.account.businessName,
        businessIdentification: data.account.businessIdentification,
        swissBusinessNumber: data.account.swissBusinessNumber,
        country: data.account.country,
        email: data.account.email,
        status: 'verified',
      };
      setBusinessProfile(profile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      return {};
    } catch {
      return { error: 'network' };
    }
  }, []);

  const registerBusiness = useCallback(async (data: RegisterData) => {
    try {
      const res = await fetch(apiUrl('/api/business/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) {
        return { error: body.error };
      }
      return { status: body.status };
    } catch {
      return { error: 'network' };
    }
  }, []);

  const logoutBusiness = useCallback(() => {
    setBusinessProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const switchToRetail = useCallback(() => {
    logoutBusiness();
  }, [logoutBusiness]);

  const value = useMemo<BusinessAuthContextType>(
    () => ({
      customerType: businessProfile ? 'business' : 'retail',
      businessProfile,
      isBusinessAuthenticated: Boolean(businessProfile),
      minimumRetailOrderChf: MIN_RETAIL_ORDER_CHF,
      switchToRetail,
      loginBusiness,
      registerBusiness,
      logoutBusiness,
    }),
    [businessProfile, switchToRetail, loginBusiness, registerBusiness, logoutBusiness],
  );

  return <BusinessAuthContext.Provider value={value}>{children}</BusinessAuthContext.Provider>;
};

export const useBusinessAuth = () => {
  const ctx = useContext(BusinessAuthContext);
  if (!ctx) throw new Error('useBusinessAuth must be used within BusinessAuthProvider');
  return ctx;
};

export type { BusinessProfile, CustomerType, AccountStatus };
