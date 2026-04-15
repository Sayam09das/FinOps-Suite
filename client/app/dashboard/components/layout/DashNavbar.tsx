'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  ChevronDown,
  Command,
  HelpCircle,
  Menu,
  Search,
  X,
} from 'lucide-react';
import type {
  DashboardNotification,
  DashboardProfileAction,
  DashboardProfileMenuItem,
  DashboardProfileSummary,
} from '@/app/types';

const defaultProfileMenu: DashboardProfileMenuItem[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'settings', label: 'Settings' },
  { id: 'billing', label: 'Billing' },
  { id: 'logout', label: 'Log out', danger: true },
];

type DashNavbarProps = Readonly<{
  notifications: DashboardNotification[];
  onOpenSidebar: () => void;
  onProfileAction: (action: DashboardProfileAction) => void;
  profile: DashboardProfileSummary;
  searchValue: string;
  subtitle?: string;
  title: string;
  onSearchChange: (value: string) => void;
}>;

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

export default function DashNavbar({
  notifications,
  onOpenSidebar,
  onProfileAction,
  profile,
  searchValue,
  subtitle,
  title,
  onSearchChange,
}: DashNavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const searchInputId = useId();
  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <div className="relative">
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full items-center justify-between gap-3 rounded-[1.75rem] border border-slate-200/80 bg-white px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:px-6"
      >
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="flex min-w-0 items-center gap-3"
        >
          <button
            type="button"
            onClick={onOpenSidebar}
            className="rounded-xl p-2 transition-colors hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={18} className="text-slate-600" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="hidden truncate text-sm text-slate-500 sm:block">
                {subtitle}
              </p>
            ) : null}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="hidden max-w-xs flex-1 cursor-text items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 transition-colors hover:bg-slate-200 sm:flex lg:max-w-sm xl:max-w-md"
          onClick={() => document.getElementById(searchInputId)?.focus()}
        >
          <Search size={15} className="shrink-0 text-slate-400" />
          <input
            id={searchInputId}
            type="text"
            placeholder="Search transactions, budgets, and notes..."
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
          />
          <div className="hidden shrink-0 items-center gap-0.5 lg:flex">
            <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[11px] font-medium leading-none text-slate-400">
              K
            </kbd>
            <Command size={11} className="text-slate-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="flex items-center gap-1 sm:gap-2"
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => setSearchOpen(true)}
            className="rounded-xl p-2 transition-colors hover:bg-slate-100 sm:hidden"
            aria-label="Search"
          >
            <Search size={18} className="text-slate-600" />
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            className="rounded-xl p-2 transition-colors hover:bg-slate-100"
            aria-label="Help"
          >
            <HelpCircle size={18} className="text-slate-500" />
          </motion.button>

          <div className="relative">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => {
                setNotificationOpen((current) => !current);
                setDropdownOpen(false);
              }}
              className="relative rounded-xl p-2 transition-colors hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell size={18} className="text-slate-500" />
              {unreadCount ? (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-orange-400 px-1 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </motion.button>

            <AnimatePresence>
              {notificationOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"
                >
                  <div className="mb-2 flex items-center justify-between px-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Notifications
                    </p>
                    <span className="text-xs text-slate-400">
                      {notifications.length} items
                    </span>
                  </div>

                  {notifications.length ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex cursor-pointer items-start gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-slate-50"
                      >
                        <span
                          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                            notification.unread ? 'bg-primary' : 'bg-slate-300'
                          }`}
                        />
                        <p className="text-sm text-slate-700">{notification.title}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-500">
                      You are all caught up.
                    </div>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="relative">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setDropdownOpen((current) => !current);
                setNotificationOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-slate-100"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#500cb0_0%,#b264ff_100%)] text-xs font-semibold text-white">
                {getInitials(profile.name)}
              </div>

              <div className="hidden text-left md:flex md:flex-col">
                <span className="text-sm font-semibold leading-tight text-slate-800">
                  {profile.name}
                </span>
                <span className="text-xs leading-tight text-slate-400">
                  {profile.handle}
                </span>
              </div>

              <motion.div
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="hidden md:block"
              >
                <ChevronDown size={15} className="text-slate-400" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {dropdownOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white py-2 shadow-lg"
                >
                  <div className="border-b border-slate-100 px-4 pb-3 pt-2">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {profile.name}
                    </p>
                    <p className="truncate text-xs text-slate-400">{profile.email}</p>
                  </div>

                  {defaultProfileMenu.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        onProfileAction(item.id);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50 ${
                        item.danger ? 'mt-1 border-t border-slate-100 pt-3 text-rose-500' : 'text-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.nav>

      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-white/95 p-4 backdrop-blur-sm sm:hidden"
          >
            <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search transactions, budgets, and notes..."
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <p className="mt-4 px-1 text-xs text-slate-400">
              Start typing to filter dashboard data.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {dropdownOpen || notificationOpen ? (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setDropdownOpen(false);
            setNotificationOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
