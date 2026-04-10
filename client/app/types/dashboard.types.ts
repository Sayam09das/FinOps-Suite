import type { LucideIcon } from 'lucide-react';

export type DashboardSection =
  | 'Dashboard'
  | 'Analytics'
  | 'Insights'
  | 'Updates'
  | 'Chat'
  | 'Settings'
  | 'Help Desk'
  | 'Integration'
  | 'Feedback';

export type DashboardNavItem = {
  icon: LucideIcon;
  label: DashboardSection;
  badge?: number | null;
};

export type DashboardNotification = {
  id: string;
  title: string;
  unread?: boolean;
};

export type DashboardProfileAction = 'profile' | 'settings' | 'billing' | 'logout';

export type DashboardProfileMenuItem = {
  id: DashboardProfileAction;
  label: string;
  danger?: boolean;
};

export type DashboardProfileSummary = {
  name: string;
  handle: string;
  email: string;
  role: string;
};
