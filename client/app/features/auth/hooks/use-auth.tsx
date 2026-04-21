"use client";

import React, { createContext, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useLoginMutation, useRegisterMutation, useLogoutMutation, useAuthMeQuery } from '@/app/lib/api/queries';
import { AUTH } from '@/app/lib/constants/auth';
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
  register: (formData: FormData) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
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
      showToast({
        title: "Success",
        description: "Login successful!",
      });
      router.push('/dashboard/maindashboard');
      router.refresh();
    } catch (error) {
      showToast({
        variant: "destructive",
        title: "Error",
        description: "Login failed. Check credentials.",
      });
    }
  }, [loginMutation, router, showToast]);

  // Register handler
  const register = useCallback(async (formData: FormData) => {
    try {
      await registerMutation.mutateAsync(formData);
      showToast({
        title: "Success",
        description: "Account created! Logging you in...",
      });
      // Auto login after register
      await loginMutation.mutateAsync({ 
        email: formData.get('email') as string, 
        password: formData.get('password') as string 
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
      router.push(AUTH.LOGIN_PATH);
      router.refresh();
    } catch (error) {
      showToast({
        variant: "destructive",
        title: "Error",
        description: "Logout failed",
      });
    }
  }, [logoutMutation, router, showToast]);

  useEffect(() => {
    if (meLoading || !pathname) return; // Wait for loading and pathname
    
    // Only redirect if we're not on auth pages and user is not authenticated
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password');
    const isProtectedRoute = pathname.startsWith('/dashboard');
    
    if (!isAuthPage && isProtectedRoute && !user) {
      router.push(AUTH.LOGIN_PATH);
    }
  }, [user, meLoading, pathname, router]);

  const value: AuthContextType = {
    user: user || null,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

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

