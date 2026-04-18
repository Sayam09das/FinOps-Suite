import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Footer from "@/app/components/layout/Footer";
import Navbar from "@/app/components/layout/Navbar";
import BackToTop from "@/app/components/layout/BackToTop";

import "./globals.css";
import "./utilities.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinOps Suite",
  description: "A polished financial operations workspace for budgeting, reporting, and approvals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-foreground">
        <div className="relative flex min-h-full flex-col">
          <Navbar />
          <div className="relative flex-1">{children}</div>
          <Footer />
          <BackToTop />
        </div>
      </body>
    </html>
  );
}
