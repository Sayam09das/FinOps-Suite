'use client';

import { create } from 'zustand';
 import { ApiError } from '@/lib/api/client';
import { authService } from '@/lib/api/auth-service';
import type { AuthUser, CurrentUser } from '@/lib/api/types';

type AuthState = {
  currentUser: AuthUser | CurrentUser | null;
  hasHydrated: boolean;
  isHydrating: boolean;
  setSession: (user: AuthUser | CurrentUser | null) => void;
  updateCurrentUser: (user: CurrentUser) => void;
  hydrateSession: () => Promise<AuthUser | CurrentUser | null>;
  logout: () => Promise<void>;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  hasHydrated: false,
  isHydrating: false,

  setSession: (user) => {
    set({
      currentUser: user,
      hasHydrated: true,
    });
  },

  updateCurrentUser: (user) => {
    set((state) => ({
      currentUser: state.currentUser
        ? {
            ...state.currentUser,
            ...user,
          }
        : user,
      hasHydrated: true,
    }));
  },

  hydrateSession: async () => {
    if (get().isHydrating) {
      return get().currentUser;
    }

    set({ isHydrating: true });

    try {
      const user = await authService.getSession();
      set({
        currentUser: user ?? null,
        hasHydrated: true,
        isHydrating: false,
      });
      return user ?? null;
    } catch (error) {
      if (
        error instanceof ApiError &&
        (error.status === 401 || error.status === 503 || error.status === 504)
      ) {
        set({
          currentUser: null,
          hasHydrated: true,
          isHydrating: false,
        });
        return null;
      }

      set({
        hasHydrated: true,
        isHydrating: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      // Must call backend directly with credentials so the browser sends
      // its cookies to onrender.com, which can then issue Set-Cookie: expires=0
      await fetch('https://finops-suite.onrender.com/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
      });
    } catch {
      // Proceed with local session clear even if the network call fails
    } finally {
      set({ currentUser: null, hasHydrated: true });
      if (typeof window !== 'undefined') {
        // Force-clear cookies client-side (safety for non-httpOnly)
        document.cookie = 'finops.access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        document.cookie = 'finops.refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        window.location.replace('/login');
      }
    }
  },

  clearSession: () => {
    set({
      currentUser: null,
      hasHydrated: true,
    });
  },
}));
