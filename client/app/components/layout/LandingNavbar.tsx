'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/store/auth.store';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
] as const;

export default function LandingNavbar() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = Boolean(currentUser);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-gray-100 bg-white/85 shadow-lg backdrop-blur-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-secondary to-accent shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-dark">
                FinOps Suite
              </span>
            </Link>
          </motion.div>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  href={link.href}
                  prefetch={link.href === '/dashboard' ? false : undefined}
                  className="group relative text-[15px] font-medium text-dark/80 transition-colors duration-300 hover:text-primary"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            {!hasHydrated || !isAuthenticated ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/login"
                    className="px-5 py-2.5 text-[15px] font-medium text-dark transition-colors duration-300 hover:text-primary"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/register"
                    className="rounded-2xl bg-dark px-6 py-2.5 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-primary hover:shadow-2xl hover:shadow-primary/30"
                  >
                    Create Account
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
                  {currentUser?.email ?? 'Signed in'}
                </span>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/dashboard"
                    prefetch={false}
                    className="rounded-2xl border border-slate-200 px-5 py-2.5 text-[15px] font-semibold text-dark transition-all duration-300 hover:border-primary hover:text-primary"
                  >
                    Open Dashboard
                  </Link>
                </motion.div>
                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="rounded-2xl bg-dark px-5 py-2.5 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-primary"
                  >
                  Log Out
                </button>
              </>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="rounded-xl p-2 transition-colors duration-300 hover:bg-gray-100 lg:hidden"
          >
            <svg
              className="h-6 w-6 text-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-gray-100 bg-white shadow-2xl lg:hidden"
          >
            <div className="space-y-4 px-4 py-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    prefetch={link.href === '/dashboard' ? false : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-dark transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <div className="space-y-3 border-t border-gray-100 pt-4">
                {!hasHydrated || !isAuthenticated ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block rounded-xl px-4 py-3 text-center text-base font-medium text-dark transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 hover:text-primary"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block rounded-xl bg-dark px-4 py-3 text-center text-base font-semibold text-white transition-all duration-300 hover:bg-primary hover:shadow-xl"
                    >
                      Create Account
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-600">
                      {currentUser?.email ?? 'Signed in'}
                    </div>
                    <Link
                      href="/dashboard"
                      prefetch={false}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block rounded-xl bg-dark px-4 py-3 text-center text-base font-semibold text-white transition-all duration-300 hover:bg-primary hover:shadow-xl"
                    >
                      Open Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleLogout()}
                      className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-base font-semibold text-dark transition-all duration-300 hover:border-primary hover:text-primary"
                    >
                      Log Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  );
}
