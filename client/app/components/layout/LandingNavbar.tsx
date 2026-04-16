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
    router.push('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${isScrolled
          ? 'border-b border-gray-100 bg-white/85 shadow-lg backdrop-blur-lg'
          : 'bg-transparent'
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  prefetch={link.href === '/dashboard' ? false : undefined}
                  className="group relative text-[15px] font-medium text-dark/80 hover:text-primary"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-secondary transition-all group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden items-center gap-4 lg:flex">
            {!hasHydrated || !isAuthenticated ? (
              <>
                <Link href="/login" className="px-5 py-2.5 font-medium">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-2xl bg-dark px-6 py-2.5 font-semibold text-white"
                >
                  Create Account
                </Link>
              </>
            ) : (
              <>
                <span className="rounded-full border px-4 py-2 text-sm">
                  {currentUser?.email}
                </span>
                <Link
                  href="/dashboard"
                  prefetch={false}
                  className="rounded-2xl border px-5 py-2.5 font-semibold"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => void handleLogout()}
                  className="rounded-2xl bg-dark px-5 py-2.5 text-white"
                >
                  Log Out
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu (ONLY NAV LINKS NOW) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white lg:hidden"
          >
            <div className="space-y-4 px-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}