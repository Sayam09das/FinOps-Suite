'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/store/auth.store';

type DropdownItem = {
  name: string;
  href: string;
};

type NavLink = {
  name: string;
  href: string;
  dropdown?: DropdownItem[];
};

const navLinks: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'About', href: '/about' },
  { name: 'Pricing', href: '/pricing' },
  {
    name: 'Blog',
    href: '#',
    dropdown: [
      { name: 'All Posts', href: '/blog' },
      { name: 'Categories', href: '/blog/categories' },
      { name: 'Write Blog', href: '/blog/create' },
    ],
  },
];

export default function LandingNavbar() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
          ? 'border-b border-gray-100/50 bg-white/90 shadow-2xl backdrop-blur-xl supports-[backdrop-filter:blur(20px)]:bg-white/95'
          : 'bg-transparent/80 backdrop-blur-sm'
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
              <div key={link.name}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                  onHoverStart={() => link.dropdown && setActiveDropdown(link.name)}
                  onHoverEnd={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    prefetch={link.href === '/dashboard' ? false : undefined}
                    className="group relative text-[15px] font-medium text-dark/80 hover:text-primary"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-secondary transition-all group-hover:w-full" />
                  </Link>
                  {link.dropdown && activeDropdown === link.name && (
                    <motion.div
                      className="absolute left-0 top-full mt-2 w-56 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="py-3">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-5 py-2.5 text-sm font-medium text-dark/80 hover:text-primary hover:bg-gray-50"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
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
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className={isMobileMenuOpen ? 'hidden' : ''}
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className={!isMobileMenuOpen ? 'hidden' : ''}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 bg-white/95 backdrop-blur-md lg:hidden"
          >
            <div className="space-y-1 px-4 py-6">
              {navLinks.map((link) => (
                <div key={link.name} className="space-y-1">
                  {!link.dropdown ? (
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block rounded-xl px-4 py-3 text-base font-medium text-dark/80 hover:bg-gray-50 hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base font-medium text-dark/80 hover:bg-gray-50 hover:text-primary"
                      >
                        {link.name}
                        <svg
                          className={`h-4 w-4 transition-transform ${activeDropdown === link.name ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {activeDropdown === link.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-4 overflow-hidden rounded-2xl bg-gray-50/50 px-4 py-3 backdrop-blur-sm"
                          >
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  setActiveDropdown(null);
                                }}
                                className="block rounded-lg px-3 py-2 text-sm font-medium text-dark/70 hover:bg-white hover:text-primary"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}