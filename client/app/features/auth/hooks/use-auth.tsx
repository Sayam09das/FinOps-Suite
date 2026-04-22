"use client";

import React, { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { setAuthData } from '../utils/auth-utils';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useLoginMutation, useRegisterMutation, useLogoutMutation, useAuthMeQuery } from '@/app/lib/api/queries';
import { useToast } from '@/app/components/ui/use-toast';
import { api } from '@/app/lib/api/client';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
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

  const isLoading = meLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending;

  const { toast } = useToast();

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('[AUTH] Step 1: Calling login endpoint...');
      // Step 1: Call login endpoint (sets cookies in response)
      const response = await loginMutation.mutateAsync({ email, password });
      console.log('[AUTH] Step 1 success:', response);
      
      // Step 2: Extract user data from login response
      // Login response should contain user data
      const userData = response?.data || response;
      console.log('[AUTH] Step 2: Extracted user data:', userData);
      
      // Store in localStorage as fallback (no token since httpOnly cookies)
      setAuthData('', userData);
      
      // Step 3: Update React Query state with user data
      queryClient.setQueryData(['auth', 'me'], userData);
      // Production serverless delay for cookie sync
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        console.log('[AUTH] Invalidated auth query for refetch');
      }, 5000);
      
      console.log('[AUTH] Login successful, redirecting to dashboard...');
      toast({
        title: "Success",
        description: "Login successful!",
      });
      
      // Step 4: Navigate to dashboard immediately
      // Navigate with replace + refresh for clean state
      console.log('[AUTH] Calling router.replace + refresh...');
      try {
        router.replace('/dashboard/maindashboard');
        router.refresh();
        console.log('[AUTH] Navigation succeeded');
      } catch (navError) {
        console.error('[AUTH] Navigation failed:', navError);
        window.location.replace('/dashboard/maindashboard');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('[AUTH] Login failed:', errorMsg);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMsg.includes('401') ? 'Invalid email or password' : 'Login failed',
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
        description: errorMsg.includes('already') ? 'Email already registered' : 'Registration failed',
      });
    }
  }, [registerMutation, login, toast]);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Logout failed",
      });
    }
  }, [logoutMutation, router, toast]);

  const value: AuthContextType = useMemo(() => ({
    user: user || null,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }), [user, isLoading, login, register, logout]);

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
