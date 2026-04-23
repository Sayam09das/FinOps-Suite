"use client";

import React, { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { clearAuthData, getGraceUser, setAuthData } from '../utils/auth-utils';
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
  const { data: user, isLoading: meLoading } = useAuthMeQuery();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();
  const graceUser = getGraceUser<User>();
  const effectiveUser = user || graceUser || null;

  const isLoading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    logoutMutation.isPending;
  const isInitializing = meLoading && !effectiveUser;

  const { toast } = useToast();

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('[AUTH] Step 1: Calling login endpoint...');
      // Step 1: Call login endpoint (sets cookies in response)
      const response = await loginMutation.mutateAsync({ email, password });
      console.log('[AUTH] Step 1 success:', response);
      
      // Step 2: Extract user data from login response
      // Login response should contain user data
      const userData = response;
      console.log('[AUTH] Step 2: Extracted user data:', userData);
      
      // Store real accessToken + user in localStorage (Bearer fallback)
      const accessToken = (userData as any).accessToken;
      setAuthData(accessToken || '', userData);
      
      // Set RQ cache directly (no invalidate during grace)
      queryClient.setQueryData(['auth', 'me'], userData);
      
      // Grace period flag for dashboard (30s)
      const graceUntil = Date.now() + 30000;
      localStorage.setItem(AUTH.GRACE_UNTIL_KEY, graceUntil.toString());
      
      console.log('[AUTH] Grace flag set until:', new Date(graceUntil).toISOString());
      
      console.log('[AUTH] Login successful, redirecting to dashboard...');
      toast({
        title: "Success",
        description: "Login successful! (grace active)",
      });
      
      // Step 4: Navigate to dashboard without refreshing the login route.
      console.log('[AUTH] Calling router.replace...');
      router.replace('/dashboard/maindashboard');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('[AUTH] Login failed:', errorMsg);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMsg === 'Request timeout'
          ? 'The server is waking up. Please wait a few seconds and try again.'
          : errorMsg.includes('401')
            ? 'Invalid email or password'
            : 'Login failed',
      });
    }
  }, [loginMutation, queryClient, router, toast]);

  // Register handler
  const register = useCallback(async (data: { name: string; email: string; password: string }) => {
    try {
      console.log('[AUTH] Registering new account...');
      await registerMutation.mutateAsync(data);
      toast({
        title: "Success",
        description: "Account created! Logging you in...",
      });
      
      // Auto login after register
      await login(data.email, data.password);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('[AUTH] Registration failed:', errorMsg);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMsg === 'Request timeout'
          ? 'The server is waking up. Please wait a few seconds and try again.'
          : errorMsg.includes('already')
            ? 'Email already registered'
            : 'Registration failed',
      });
    }
  }, [registerMutation, login, toast]);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      clearAuthData();
      queryClient.setQueryData(['auth', 'me'], null);
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      router.push("/login");
      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Logout failed",
      });
    }
  }, [logoutMutation, queryClient, router, toast]);

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
