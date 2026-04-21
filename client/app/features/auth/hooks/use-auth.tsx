"use client";

import React, { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useLoginMutation, useRegisterMutation, useLogoutMutation, useAuthMeQuery } from '@/app/lib/api/queries';
import { useToast } from '@/app/components/ui/use-toast';

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

  // Login handler
  const { toast: showToast } = useToast();

  const login = useCallback(async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ email, password });
      await queryClient.invalidateQueries({ queryKey: ['auth'] });
      await queryClient.refetchQueries({ queryKey: ['auth'] });
      console.log('Login success, redirecting...');
      showToast({
        title: "Success",
        description: "Login successful!",
      });
      router.replace('/dashboard/maindashboard');
    } catch (error) {
      showToast({
        variant: "destructive",
        title: "Error",
        description: "Login failed. Check credentials.",
      });
    }
  }, [loginMutation, queryClient, router, showToast]);

  // Register handler
  const register = useCallback(async (data: { name: string; email: string; password: string }) => {
    try {
      await registerMutation.mutateAsync(data);
      showToast({
        title: "Success",
        description: "Account created! Logging you in...",
      });
      // Auto login after register
      await loginMutation.mutateAsync({ 
        email: data.email, 
        password: data.password 
      });
      router.push('/dashboard/maindashboard');
    } catch (error) {
      showToast({
        variant: "destructive",
        title: "Error",
        description: "Registration failed. Try again.",
      });
    }
  }, [registerMutation, loginMutation, router, showToast]);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      showToast({
        title: "Success",
        description: "Logged out successfully",
      });
      router.push("/login");
      router.refresh();
    } catch (error) {
      showToast({
        variant: "destructive",
        title: "Error",
        description: "Logout failed",
      });
    }
  }, [logoutMutation, router, showToast]);

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

