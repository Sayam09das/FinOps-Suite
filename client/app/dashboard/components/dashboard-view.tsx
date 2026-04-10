'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type {
  DashboardNotification,
  DashboardProfileAction,
  DashboardProfileSummary,
  DashboardSection,
} from '@/app/types';
import { useAuthStore } from '@/app/store/auth.store';
import { ApiError } from '@/lib/api/client';
import { dashboardService } from '@/lib/api/dashboard-service';
import { userService } from '@/lib/api/user-service';
import type { CurrentUser, DashboardData } from '@/lib/api/types';
import DashHero from './Dashhero';
import DashNavbar from './layout/DashNavbar';
import DashSidebar from './layout/DashSidebar';

const sectionCopy: Record<
  DashboardSection,
  {
    subtitle: string;
    title: string;
  }
> = {
  Dashboard: {
    title: 'Dashboard',
    subtitle: 'Your finance command center with live backend-connected totals.',
  },
  Analytics: {
    title: 'Analytics',
    subtitle: 'This section UI can be connected after the dashboard hero.',
  },
  Insights: {
    title: 'Insights',
    subtitle: 'This section UI can be connected after the dashboard hero.',
  },
  Updates: {
    title: 'Updates',
    subtitle: 'This section UI can be connected after the dashboard hero.',
  },
  Chat: {
    title: 'Chat',
    subtitle: 'This section UI can be connected after the dashboard hero.',
  },
  Settings: {
    title: 'Settings',
    subtitle: 'This section UI can be connected after the dashboard hero.',
  },
  'Help Desk': {
    title: 'Help Desk',
    subtitle: 'This section UI can be connected after the dashboard hero.',
  },
  Integration: {
    title: 'Integration',
    subtitle: 'This section UI can be connected after the dashboard hero.',
  },
  Feedback: {
    title: 'Feedback',
    subtitle: 'This section UI can be connected after the dashboard hero.',
  },
};

const normalizeHandle = (email: string) => `@${email.split('@')[0].toLowerCase()}`;

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const resolveSettledValue = <T,>(
  result: PromiseSettledResult<T>,
  fallbackMessage: string,
): [T | null, string | null] => {
  if (result.status === 'fulfilled') {
    return [result.value, null];
  }

  return [null, getErrorMessage(result.reason, fallbackMessage)];
};

export function DashboardView() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const currentUser = useAuthStore((state) => state.currentUser);
  const clearSession = useAuthStore((state) => state.clearSession);
  const hydrateSession = useAuthStore((state) => state.hydrateSession);
  const logout = useAuthStore((state) => state.logout);
  const updateCurrentUser = useAuthStore((state) => state.updateCurrentUser);
  const [profile, setProfile] = useState<CurrentUser | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<DashboardSection>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const requestWithAuth = async <T,>(request: () => Promise<T>): Promise<T> => {
    try {
      return await request();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        const user = await hydrateSession();

        if (!user) {
          clearSession();
          router.replace('/login');
          throw new Error('Your session has expired. Please sign in again.');
        }

        return request();
      }

      throw error;
    }
  };

  const loadDashboard = useEffectEvent(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const results = await Promise.allSettled([
      requestWithAuth(() => userService.getCurrent()),
      requestWithAuth(() => dashboardService.get()),
    ]);

    const [profileResult, dashboardResult] = results;
    const [nextProfile, profileError] = resolveSettledValue(
      profileResult,
      'Failed to load your profile.',
    );
    const [nextDashboard, dashboardError] = resolveSettledValue(
      dashboardResult,
      'Failed to load your dashboard totals.',
    );

    if (nextProfile) {
      setProfile(nextProfile);
      updateCurrentUser(nextProfile);
    }

    if (nextDashboard) {
      setDashboard(nextDashboard);
    }

    setErrorMessage(profileError ?? dashboardError);
    setIsLoading(false);
  });

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    let cancelled = false;

    const bootstrapDashboard = async () => {
      const sessionUser = currentUser?.id ? currentUser : await hydrateSession();

      if (cancelled) {
        return;
      }

      if (!sessionUser?.id) {
        clearSession();
        router.replace('/login');
        return;
      }

      await loadDashboard();
    };

    void bootstrapDashboard();

    return () => {
      cancelled = true;
    };
  }, [clearSession, currentUser, hasHydrated, hydrateSession, loadDashboard, router]);

  const handleProfileAction = (action: DashboardProfileAction) => {
    if (action === 'logout') {
      void (async () => {
        await logout();
        router.replace('/login');
      })();
      return;
    }

    const label = {
      profile: 'Profile',
      settings: 'Settings',
      billing: 'Billing',
    }[action];

    toast.info(`${label} UI will be connected next.`);
  };

  const displayEmail =
    profile?.email ?? currentUser?.email ?? 'signed-in-user@finops.local';
  const displayName =
    profile?.name?.trim() || currentUser?.name?.trim() || displayEmail.split('@')[0];
  const profileSummary: DashboardProfileSummary = {
    name: displayName,
    handle: normalizeHandle(displayEmail),
    email: displayEmail,
    role: profile?.role ?? currentUser?.role ?? 'USER',
  };

  const notifications: DashboardNotification[] = Object.entries(
    dashboard?.budgets ?? {},
  )
    .filter(([, budget]) => Boolean(budget.alert))
    .slice(0, 3)
    .map(([category, budget], index) => ({
      id: `budget-${category}`,
      title: `${category}: ${budget.alert}`,
      unread: index === 0,
    }));

  const filteredNotifications = searchValue.trim()
    ? notifications.filter((notification) =>
        notification.title.toLowerCase().includes(searchValue.trim().toLowerCase()),
      )
    : notifications;

  const currentSection = sectionCopy[activeSection];

  if (!hasHydrated) {
    return <div className="min-h-screen bg-[linear-gradient(180deg,#f7f7fb_0%,#ffffff_35%,#eef4ff_100%)]" />;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f7fb_0%,#ffffff_35%,#eef4ff_100%)] text-slate-950">
      <div className="flex min-h-screen">
        <DashSidebar
          activeItem={activeSection}
          isMobileOpen={isSidebarOpen}
          onMobileClose={() => setIsSidebarOpen(false)}
          onSelectItem={setActiveSection}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
            <DashNavbar
              notifications={filteredNotifications}
              onOpenSidebar={() => setIsSidebarOpen(true)}
              onProfileAction={handleProfileAction}
              profile={profileSummary}
              searchValue={searchValue}
              subtitle={currentSection.subtitle}
              title={currentSection.title}
              onSearchChange={setSearchValue}
            />
          </header>

          <main className="flex-1 px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pb-10">
            <div className="mx-auto max-w-7xl space-y-6">
              {errorMessage ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                  {errorMessage}
                </div>
              ) : null}

              {activeSection === 'Dashboard' ? (
                <DashHero
                  dashboard={dashboard}
                  displayName={displayName}
                  isLoading={isLoading}
                />
              ) : (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.06)] sm:p-8">
                  <h2 className="text-2xl font-bold text-slate-950">
                    {activeSection}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    This section is ready for your next UI piece. For now, only the
                    dashboard hero is connected to the backend, just like you asked.
                  </p>
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
