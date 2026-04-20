import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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
  metadataBase: new URL("https://yourdomain.com"),

  title: {
    default: "FinOps Suite",
    template: "%s | FinOps Suite",
  },

  description:
    "A polished financial operations workspace for budgeting, reporting, approvals, and financial insights.",

  keywords: [
    "FinOps",
    "finance dashboard",
    "budgeting app",
    "expense tracking",
    "financial analytics",
  ],

  openGraph: {
    title: "FinOps Suite",
    description:
      "Manage budgets, approvals, and reporting in one modern financial workspace.",
    url: "https://yourdomain.com",
    siteName: "FinOps Suite",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FinOps Suite Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "FinOps Suite",
    description:
      "A polished financial operations workspace for modern teams.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

import { AppProvider } from "./providers/app-provider"
import Navbar from "@/app/components/layout/Navbar"
import Footer from "@/app/components/layout/Footer"
import BackToTop from "@/app/components/layout/BackToTop"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background font-sans text-foreground" suppressHydrationWarning>
        <main className="relative flex min-h-full flex-col">
          <AppProvider>
            <Navbar />
            <div className="relative flex-1">{children}</div>
            <Footer />
            <BackToTop />
          </AppProvider>
        </main>
      </body>
    </html>
  );
}