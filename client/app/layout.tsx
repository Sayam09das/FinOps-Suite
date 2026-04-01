import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import './globals.css';

const gilroy = localFont({
  src: [
    {
      path: '../public/fonts/Gilroy-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Gilroy-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
});

const siteUrl = 'https://fin-ops-suite.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'FinOps Suite',
    template: '%s | FinOps Suite',
  },
  description:
    'FinOps Suite is a financial operations dashboard for managing transactions, budgets, analytics, reports, and team workflows.',
  applicationName: 'FinOps Suite',
  keywords: [
    'FinOps Suite',
    'finance dashboard',
    'expense tracking',
    'budget management',
    'financial analytics',
    'transaction management',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'FinOps Suite',
    description:
      'A modern finance operations platform for tracking transactions, budgets, analytics, and performance.',
    siteName: 'FinOps Suite',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinOps Suite',
    description:
      'A modern finance operations platform for tracking transactions, budgets, analytics, and performance.',
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#500cb0',
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${gilroy.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
