"use client";

import React, { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
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
      
      // Step 2: Wait for browser to process Set-Cookie headers
      console.log('[AUTH] Step 2: Waiting for cookies...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 3: Refetch auth/me query to validate cookie was set
      console.log('[AUTH] Step 3: Fetching /auth/me with cookie...');
      const meResponse = await queryClient.fetchQuery({
        queryKey: ['auth', 'me'],
        queryFn: () => api.get('/auth/me'),
        staleTime: 0, // Force fresh fetch
      });
      console.log('[AUTH] Step 3 response:', meResponse);
      
      // Step 4: Extract user data from API response wrapper
      // API returns { success: true, data: { user }, message: "..." }
      const meResult = meResponse?.data || meResponse;
      console.log('[AUTH] Step 3 success (extracted user):', meResult);
      
      // Step 5: Update React Query state with just the user data (not the wrapper)
      queryClient.setQueryData(['auth', 'me'], meResult);
      
      console.log('[AUTH] Login successful, redirecting to dashboard...');
      toast({
        title: "Success",
        description: "Login successful!",
      });
      
      // Step 6: Wait a bit to ensure query cache is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Step 7: Navigate to dashboard
      console.log('[AUTH] Calling router.replace...');
      router.replace('/dashboard/maindashboard');
      console.log('[AUTH] router.replace called');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('[AUTH] Login failed:', errorMsg);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMsg.includes('401') ? 'Invalid email or password' : 'Login failed',
      });
    }
  }, [loginMutation, queryClient, router, toast, api]);

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
