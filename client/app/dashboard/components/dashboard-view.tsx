'use client';

import {
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { Blocks, Headphones, Link2, MessageSquareMore, Settings2 } from 'lucide-react';
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
import { transactionService } from '@/lib/api/transaction-service';
import { userService } from '@/lib/api/user-service';
import type {
  CreateTransactionPayload,
  CurrentUser,
  DashboardData,
} from '@/lib/api/types';
import Analyticshome from './Analytics/Analyticshome';
import Dashchat from './Chat/Dashchat';
import DashHomeSection from './DashHome/DashHomeSection';
import DashInsights from './Insights/DashInsights';
import DashUpdates from './Updates/DashUpdates';
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
    title: 'Dashboard Home',
    subtitle: 'Live totals, budgets, and recent transactions synced from your backend.',
  },
  Analytics: {
    title: 'Analytics',
    subtitle: 'Category performance and cash-flow signals from your latest data.',
  },
  Insights: {
    title: 'Insights',
    subtitle: 'Actionable summaries based on balances, budgets, and spending behavior.',
  },
  Updates: {
    title: 'Updates',
    subtitle: 'Recent financial activity and status changes in one timeline.',
  },
  Chat: {
    title: 'Finance Assistant',
    subtitle: 'Quick prompts and data-aware answers for your dashboard.',
  },
  Settings: {
    title: 'Settings',
    subtitle: 'Workspace preferences and account-level controls.',
  },
  'Help Desk': {
    title: 'Help Desk',
    subtitle: 'Support guidance and onboarding help for your team.',
  },
  Integration: {
    title: 'Integration',
    subtitle: 'Connect banks, tools, and workflows into your finance stack.',
  },
  Feedback: {
    title: 'Feedback',
    subtitle: 'Share product feedback and prioritize what we improve next.',
  },
};

const utilitySectionContent: Record<
  Extract<DashboardSection, 'Settings' | 'Help Desk' | 'Integration' | 'Feedback'>,
  {
    description: string;
    title: string;
    icon: typeof Settings2;
  }
> = {
  Settings: {
    title: 'Account settings',
    description:
      'Profile, billing, notifications, and session controls can live here next. The navigation is now wired so this section opens correctly from the dashboard shell.',
    icon: Settings2,
  },
  'Help Desk': {
    title: 'Support center',
    description:
      'This area is ready for FAQs, guided onboarding, and support channels. The navbar and sidebar now route here cleanly without breaking the dashboard.',
    icon: Headphones,
  },
  Integration: {
    title: 'Connected tools',
    description:
      'Use this section for bank feeds, exports, and third-party workflows. The dashboard structure is now set up so these utility pages stay aligned with the rest of the app.',
    icon: Link2,
  },
  Feedback: {
    title: 'Product feedback',
    description:
      'Collect requests, votes, or release notes here. Navigation to this section now works from the dashboard sidebar just like the main product views.',
    icon: MessageSquareMore,
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

const getBudgetNotifications = (dashboard: DashboardData | null) =>
  Object.entries(dashboard?.budgets ?? {})
    .filter(([, budget]) => Boolean(budget.alert))
    .map(([category, budget], index) => ({
      id: `budget-${category}`,
      title: `${category}: ${budget.alert}`,
      unread: index === 0,
    }));

const getTransactionNotifications = (dashboard: DashboardData | null) =>
  (dashboard?.recentTransactions ?? []).slice(0, 2).map((transaction, index) => ({
    id: `txn-${transaction.id}`,
    title: `${transaction.type === 'income' ? 'Income' : 'Expense'}: ${transaction.category}`,
    unread: index === 0,
  }));

type UtilitySectionProps = {
  section: Extract<
    DashboardSection,
    'Settings' | 'Help Desk' | 'Integration' | 'Feedback'
  >;
};

function UtilitySection({ section }: UtilitySectionProps) {
  const { description, icon: Icon, title } = utilitySectionContent[section];

  return (
    <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <div className="grid gap-3 sm:min-w-72">
          {[
            'Navigation now stays inside the dashboard shell.',
            'Top navbar remains visible across sections.',
            'This panel is ready for the next feature pass.',
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<DashboardSection>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const deferredSearchValue = useDeferredValue(searchValue);

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

  const loadDashboard = useEffectEvent(
    async (options: { background?: boolean } = {}) => {
      const { background = false } = options;

      if (background) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

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
      setIsRefreshing(false);
    },
  );

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

  useEffect(() => {
    if (!hasHydrated || !(currentUser?.id ?? profile?.id)) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadDashboard({ background: true });
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [currentUser?.id, hasHydrated, loadDashboard, profile?.id]);

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

    toast.info(`${label} tools are ready to be connected next.`);
  };

  const handleCreateTransaction = async (payload: CreateTransactionPayload) => {
    await requestWithAuth(() => transactionService.create(payload));
    toast.success('Transaction added and dashboard refreshed.');
    await loadDashboard({ background: true });
  };

  const handleSelectSection = (section: DashboardSection) => {
    startTransition(() => {
      setActiveSection(section);
      setIsSidebarOpen(false);
    });
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

  const notifications: DashboardNotification[] = [
    ...getBudgetNotifications(dashboard),
    ...getTransactionNotifications(dashboard),
  ].slice(0, 5);

  const currentSection = sectionCopy[activeSection];
  const sharedLoadingState = isLoading || isRefreshing;

  const renderSection = () => {
    switch (activeSection) {
      case 'Dashboard':
        return (
          <DashHomeSection
            dashboard={dashboard}
            displayName={displayName}
            isLoading={sharedLoadingState}
            isRefreshing={isRefreshing}
            onCreateTransaction={handleCreateTransaction}
            searchValue={deferredSearchValue}
          />
        );
      case 'Analytics':
        return (
          <Analyticshome
            dashboard={dashboard}
            isLoading={sharedLoadingState}
          />
        );
      case 'Insights':
        return <DashInsights dashboard={dashboard} />;
      case 'Updates':
        return (
          <DashUpdates
            dashboard={dashboard}
            isLoading={sharedLoadingState}
            searchValue={deferredSearchValue}
          />
        );
      case 'Chat':
        return (
          <Dashchat
            dashboard={dashboard}
            displayName={displayName}
            searchValue={deferredSearchValue}
          />
        );
      case 'Settings':
      case 'Help Desk':
      case 'Integration':
      case 'Feedback':
        return <UtilitySection section={activeSection} />;
      default:
        return (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <Blocks className="h-5 w-5" />
            </div>
            <p className="mt-4">
              This dashboard section is available, but its dedicated content has not
              been connected yet.
            </p>
          </section>
        );
    }
  };

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f7f7fb_0%,#ffffff_35%,#eef4ff_100%)]" />
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f7fb_0%,#ffffff_35%,#eef4ff_100%)] text-slate-950">
      <div className="flex min-h-screen">
        <DashSidebar
          activeItem={activeSection}
          isMobileOpen={isSidebarOpen}
          onMobileClose={() => setIsSidebarOpen(false)}
          onSelectItem={handleSelectSection}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
            <DashNavbar
              notifications={notifications}
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

              {renderSection()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
