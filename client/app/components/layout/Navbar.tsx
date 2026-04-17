"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";

import { navLinks, type NavItem } from "./nav-config";

const dropdownTransition = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1] as const,
};

function isRouteActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function isNavItemActive(pathname: string, item: NavItem) {
  if (item.href) {
    return isRouteActive(pathname, item.href);
  }

  return item.dropdown?.some((link) => isRouteActive(pathname, link.href)) ?? false;
}

export default function Navbar() {
  const pathname = usePathname();
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)", { defaultValue: false });

  return (
    <NavbarContent
      key={`${pathname}-${isDesktop ? "desktop" : "mobile"}`}
      isDesktop={isDesktop}
      mounted={mounted}
      pathname={pathname}
      reduceMotion={Boolean(reduceMotion)}
    />
  );
}

type NavbarContentProps = {
  isDesktop: boolean;
  mounted: boolean;
  pathname: string;
  reduceMotion: boolean;
};

function NavbarContent({ isDesktop, mounted, pathname, reduceMotion }: NavbarContentProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);
  const [desktopBlogOpen, setDesktopBlogOpen] = useState(false);
  const effectiveMobileOpen = mounted && !isDesktop && mobileOpen;

  useEffect(() => {
    if (!effectiveMobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [effectiveMobileOpen]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 md:px-4">
      <motion.nav
        initial={reduceMotion ? false : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="nav-frame mx-auto flex w-full max-w-7xl items-center justify-between gap-4 rounded-[1.9rem] px-4 py-3 md:px-5 lg:px-6"
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="primary-wash flex h-11 w-11 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
            <Sparkles className="h-5 w-5 text-foreground" />
          </div>
          <div className="hidden sm:block">
            <p className="eyebrow text-foreground/48">FinOps Suite</p>
            <p className="text-sm font-semibold text-foreground">Modern finance, calmer workflows</p>
          </div>
        </Link>

        <LayoutGroup id="main-nav">
          <div className="hidden items-center gap-2 lg:flex">
            {navLinks.map((item) => {
              const active = isNavItemActive(pathname, item);

              if (item.dropdown) {
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setDesktopBlogOpen(true)}
                    onMouseLeave={() => setDesktopBlogOpen(false)}
                    onFocusCapture={() => setDesktopBlogOpen(true)}
                    onBlurCapture={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                        setDesktopBlogOpen(false);
                      }
                    }}
                  >
                    <button
                      type="button"
                      className={`nav-link-pill ${active ? "text-foreground" : "text-foreground/68"}`}
                      aria-expanded={desktopBlogOpen}
                      aria-haspopup="menu"
                    >
                      {active ? <motion.span layoutId="nav-pill" className="nav-link-pill-active" /> : null}
                      <span className="relative z-10 flex items-center gap-2">
                        {item.name}
                        <motion.span
                          animate={{ rotate: desktopBlogOpen ? 180 : 0 }}
                          transition={{ duration: reduceMotion ? 0 : 0.2 }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.span>
                      </span>
                    </button>

                    <AnimatePresence>
                      {desktopBlogOpen && mounted ? (
                        <motion.div
                          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                          transition={dropdownTransition}
                          className="nav-dropdown-panel absolute left-1/2 top-[calc(100%+0.9rem)] z-40 w-72 -translate-x-1/2 overflow-hidden rounded-[1.5rem] p-2"
                        >
                          <div className="space-y-1">
                            {item.dropdown.map((link) => {
                              const childActive = isRouteActive(pathname, link.href);

                              return (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className={`group flex items-center justify-between rounded-[1.15rem] px-4 py-3 text-sm transition ${
                                    childActive
                                      ? "bg-primary/70 text-foreground shadow-[0_10px_30px_rgba(33,49,43,0.08)]"
                                      : "text-foreground/72 hover:bg-background/75 hover:text-foreground"
                                  }`}
                                >
                                  <span className="font-medium">{link.name}</span>
                                  <ArrowRight className="h-4 w-4 opacity-45 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              }

              if (!item.href) {
                return null;
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link-pill ${active ? "text-foreground" : "text-foreground/68"}`}
                >
                  {active ? <motion.span layoutId="nav-pill" className="nav-link-pill-active" /> : null}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </LayoutGroup>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="soft-chip">Responsive by design</span>
          <Link href="/pricing" className="btn-primary-soft">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          className="nav-mobile-toggle flex h-12 w-12 items-center justify-center rounded-2xl lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((current) => !current)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {effectiveMobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
              className="fixed inset-0 z-40 bg-foreground/12 backdrop-blur-[2px] lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.98 }}
              transition={dropdownTransition}
              className="nav-mobile-panel fixed inset-x-3 top-[5.35rem] z-50 overflow-hidden rounded-[2rem] p-3 shadow-[0_30px_90px_rgba(33,49,43,0.14)] lg:hidden"
            >
              <div className="space-y-2">
                {navLinks.map((item) => {
                  const active = isNavItemActive(pathname, item);

                  if (item.dropdown) {
                    return (
                      <div key={item.name} className="rounded-[1.35rem] border border-border/70 bg-white/35 p-1">
                        <button
                          type="button"
                          className={`nav-mobile-link w-full ${active ? "bg-primary/70 text-foreground" : ""}`}
                          onClick={() => setMobileBlogOpen((current) => !current)}
                          aria-expanded={mobileBlogOpen}
                        >
                          <span>{item.name}</span>
                          <motion.span
                            animate={{ rotate: mobileBlogOpen ? 180 : 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.2 }}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                          {mobileBlogOpen ? (
                            <motion.div
                              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                              transition={dropdownTransition}
                              className="overflow-hidden"
                            >
                              <div className="space-y-1 px-1 pb-1">
                                {item.dropdown.map((link) => {
                                  const childActive = isRouteActive(pathname, link.href);

                                  return (
                                    <Link
                                      key={link.href}
                                      href={link.href}
                                      className={`nav-mobile-link justify-between ${
                                        childActive ? "bg-background text-foreground shadow-[0_10px_25px_rgba(33,49,43,0.08)]" : "text-foreground/72"
                                      }`}
                                    >
                                      <span>{link.name}</span>
                                      <ArrowRight className="h-4 w-4" />
                                    </Link>
                                  );
                                })}
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  if (!item.href) {
                    return null;
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`nav-mobile-link ${active ? "bg-primary/70 text-foreground shadow-[0_10px_25px_rgba(33,49,43,0.08)]" : ""}`}
                    >
                      {item.name}
                    </Link>
                  );
                })}

                <div className="grid gap-2 pt-2 sm:grid-cols-2">
                  <Link href="/pricing" className="btn-primary-soft w-full">
                    Pricing
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/about" className="btn-secondary-soft w-full">
                    About Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
