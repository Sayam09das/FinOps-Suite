"use client";

import { usePathname } from "next/navigation";

import BackToTop from "@/app/components/layout/BackToTop";
import Footer from "@/app/components/layout/Footer";
import Navbar from "@/app/components/layout/Navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  return (
    <>
      {!isDashboardRoute ? <Navbar /> : null}
      <div className="relative flex-1">{children}</div>
      {!isDashboardRoute ? <Footer /> : null}
      {!isDashboardRoute ? <BackToTop /> : null}
    </>
  );
}
