"use client";

import React, { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { clearAuthData, getAuthToken, getStoredUser, setAuthData, setRefreshToken } from '../utils/auth-utils';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useLoginMutation, useRegisterMutation, useLogoutMutation, useAuthMeQuery } from '@/app/lib/api/queries';
import { useToast } from '@/app/components/ui/use-toast';
import { AUTH } from '@/app/lib/constants/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => void;
  register: (data: { name: string; email: string; password: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const storedToken = getAuthToken();
  const storedUser = getStoredUser<User>();
  const hasStoredSession = !!storedToken || !!storedUser;
  const { data: user, isLoading: meLoading, isFetched: meFetched } = useAuthMeQuery({ enabled: hasStoredSession });
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();
  const effectiveUser = user || (!meFetched && storedUser) || null;

  const isLoading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    logoutMutation.isPending;
  const isInitializing = hasStoredSession && meLoading;

  const { toastPromise } = useToast();

const login = useCallback(async (email: string, password: string) => {
    const promiseFn = async () => {
      console.log('[AUTH] Step 1: Calling login endpoint...');
      const response = await loginMutation.mutateAsync({ email, password });
      console.log('[AUTH] Step 1 success:', response);
      
      const userData = response;
      console.log('[AUTH] Step 2: Extracted user data:', userData);
      
      // Extract tokens with proper validation - handle both direct response and wrapped response
      const rawAccessToken = (userData as any)?.accessToken;
      const rawRefreshToken = (userData as any)?.refreshToken;
      
      // Only store tokens if they're valid (non-empty strings)
      const accessToken = rawAccessToken && typeof rawAccessToken === 'string' && rawAccessToken.length > 10 
        ? rawAccessToken 
        : null;
      const refreshToken = rawRefreshToken && typeof rawRefreshToken === 'string' && rawRefreshToken.length > 10 
        ? rawRefreshToken 
        : null;
      
      if (!accessToken || !refreshToken) {
        console.error('[AUTH] Token extraction failed! accessToken:', !!accessToken, 'refreshToken:', !!refreshToken);
        // Still try to auth - maybe cookies are set
      } else {
        console.log('[AUTH] Tokens extracted successfully');
      }
      
      setAuthData(accessToken || '', userData);
      
      // Store refresh token for token refresh flow (only if valid)
      if (refreshToken) {
        setRefreshToken(refreshToken);
        console.log('[AUTH] Refresh token stored successfully');
      }
      
      queryClient.setQueryData(['auth', 'me'], userData);
      
      const graceUntil = Date.now() + 30000;
      localStorage.setItem(AUTH.GRACE_UNTIL_KEY, graceUntil.toString());
      
      console.log('[AUTH] Login successful, refetching queries...');
      
      await queryClient.refetchQueries({ type: 'active' });
      
      console.log('[AUTH] Redirecting to dashboard...');
      router.replace('/dashboard');
      
      return { name: 'Sonner' };
    };

    toastPromise(promiseFn, {
      loading: 'Signing in...',
      success: (data) => `${data.name} toast has been added`,
      error: 'Login request failed. Please try again.',
    });
  }, [loginMutation, queryClient, router, toastPromise]);

  const register = useCallback(async (data: { name: string; email: string; password: string }) => {
    const promiseFn = async () => {
      console.log('[AUTH] Registering new account...');
      await registerMutation.mutateAsync(data);
      
      // Auto login after register
      await login(data.email, data.password);
      
      return { name: 'Sonner' };
    };

    toastPromise(promiseFn, {
      loading: 'Creating account...',
      success: (data) => `${data.name} toast has been added`,
      error: 'Registration failed. Please try again.',
    });
  }, [registerMutation, login, toastPromise]);

  const logout = useCallback(async () => {
    const promiseFn = async () => {
      await logoutMutation.mutateAsync();
      clearAuthData();
      queryClient.setQueryData(['auth', 'me'], null);
      router.replace("/");
      router.refresh();
      
      return { name: 'Sonner' };
    };

    toastPromise(promiseFn, {
      loading: 'Signing out...',
      success: (data) => `${data.name} toast has been added`,
      error: 'Logout failed.',
    });
  }, [logoutMutation, queryClient, router, toastPromise]);

  const value: AuthContextType = useMemo(() => ({
    user: effectiveUser,
    isLoading,
    isInitializing,
    login,
    register,
    logout,
    isAuthenticated: !!effectiveUser,
  }), [effectiveUser, isInitializing, isLoading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
