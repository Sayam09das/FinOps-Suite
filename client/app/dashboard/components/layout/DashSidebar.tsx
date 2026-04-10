'use client';

import { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import {
  BarChart2,
  ChevronLeft,
  Clock,
  Crown,
  HelpCircle,
  LayoutDashboard,
  Lightbulb,
  Link2,
  MessageCircle,
  Settings,
  UserCheck,
  X,
} from 'lucide-react';
import type { DashboardNavItem, DashboardSection } from '@/app/types';

const defaultMenuItems: DashboardNavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: BarChart2, label: 'Analytics' },
  { icon: Lightbulb, label: 'Insights' },
  { icon: Clock, label: 'Updates' },
  { icon: MessageCircle, label: 'Chat', badge: 20 },
];

const defaultGeneralItems: DashboardNavItem[] = [
  { icon: Settings, label: 'Settings' },
  { icon: HelpCircle, label: 'Help Desk' },
  { icon: Link2, label: 'Integration' },
  { icon: UserCheck, label: 'Feedback' },
];

const sidebarVariants = {
  open: { x: 0, opacity: 1 },
  closed: { x: -320, opacity: 0 },
} satisfies Variants;

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (index: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.055,
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
} satisfies Variants;

type DashSidebarProps = Readonly<{
  activeItem: DashboardSection;
  brandLabel?: string;
  generalItems?: DashboardNavItem[];
  isMobileOpen: boolean;
  menuItems?: DashboardNavItem[];
  onMobileClose: () => void;
  onSelectItem: (item: DashboardSection) => void;
}>;

type SidebarSectionProps = Readonly<{
  activeItem: DashboardSection;
  items: DashboardNavItem[];
  onSelectItem: (item: DashboardSection) => void;
  sectionLabel: string;
  startIndex: number;
}>;

function SidebarSection({
  activeItem,
  items,
  onSelectItem,
  sectionLabel,
  startIndex,
}: SidebarSectionProps) {
  return (
    <div>
      <p className="mb-2 px-3 text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
        {sectionLabel}
      </p>

      <ul className="space-y-0.5">
        {items.map((item, index) => {
          const isActive = activeItem === item.label;

          return (
            <motion.li
              key={item.label}
              custom={startIndex + index}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <button
                type="button"
                onClick={() => onSelectItem(item.label)}
                className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <AnimatePresence>
                  {isActive ? (
                    <motion.span
                      layoutId="sidebar-active-indicator"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      exit={{ scaleY: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-primary"
                    />
                  ) : null}
                </AnimatePresence>

                <item.icon
                  size={18}
                  className={`shrink-0 transition-colors ${
                    isActive
                      ? 'text-slate-800'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />

                <span className="flex-1 text-left">{item.label}</span>

                {item.badge ? (
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

export default function DashSidebar({
  activeItem,
  brandLabel = 'FinOps',
  generalItems = defaultGeneralItems,
  isMobileOpen,
  menuItems = defaultMenuItems,
  onMobileClose,
  onSelectItem,
}: DashSidebarProps) {
  const [proCardVisible, setProCardVisible] = useState(true);

  const handleSelect = (item: DashboardSection) => {
    onSelectItem(item);
    onMobileClose();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-3 px-4 pb-8 pt-6"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary shadow-md shadow-primary/20">
          <div className="h-5 w-5 rotate-45 rounded-full border-[3px] border-r-transparent border-white" />
        </div>
        <div>
          <span className="block text-[22px] font-bold tracking-tight text-slate-900">
            {brandLabel}
          </span>
          <span className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Suite
          </span>
        </div>
      </motion.div>

      <div className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        <SidebarSection
          activeItem={activeItem}
          items={menuItems}
          onSelectItem={handleSelect}
          sectionLabel="Menu"
          startIndex={0}
        />

        <SidebarSection
          activeItem={activeItem}
          items={generalItems}
          onSelectItem={handleSelect}
          sectionLabel="General"
          startIndex={menuItems.length}
        />
      </div>

      <div className="px-3 pb-6 pt-2">
        <AnimatePresence>
          {proCardVisible ? (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <button
                type="button"
                onClick={() => setProCardVisible(false)}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white transition-colors hover:bg-slate-100"
                aria-label="Dismiss upgrade card"
              >
                <X size={13} className="text-slate-500" />
              </button>

              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 shadow-md shadow-orange-200">
                <Crown size={18} className="text-white" />
              </div>

              <p className="mb-1 text-sm font-bold text-slate-900">Upgrade Pro</p>
              <p className="mb-4 text-xs leading-relaxed text-slate-500">
                Higher productivity with sharper analytics and better organization.
              </p>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Upgrade
              </motion.button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200/80 bg-white lg:flex xl:w-72">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isMobileOpen ? (
          <>
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
            />

            <motion.aside
              key="sidebar-drawer"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl lg:hidden"
            >
              <button
                type="button"
                onClick={onMobileClose}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 transition-colors hover:bg-slate-200"
                aria-label="Close sidebar"
              >
                <ChevronLeft size={16} className="text-slate-600" />
              </button>

              {sidebarContent}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
