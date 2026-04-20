"use client";

import Link from "next/link";
import { ArrowLeft, Search, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-sky-200/20 via-transparent to-emerald-200/20" />
      
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-8 rounded-3xl bg-white/70 p-8 shadow-2xl backdrop-blur-sm ring-1 ring-white/40">
            <AlertTriangle className="mx-auto h-24 w-24 text-slate-500" strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h1 className="bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900 bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl md:text-8xl lg:text-9xl">
            404
          </h1>

          <p className="eyebrow mb-4 mt-4 text-sm uppercase tracking-widest text-slate-500">Page Not Found</p>

          <h2 className="mb-8 max-w-2xl text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Hmm... this page doesn&apos;t exist.
          </h2>

          <p className="mb-12 max-w-xl text-lg text-foreground/70 sm:text-xl">
            Take a step back to the homepage, or use the search if you think this page should exist.
          </p>

          {/* Actions */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg" className="shadow-lg shadow-blue-500/10">
              <Link href="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
            <Button variant="ghost" size="lg" className="shadow-lg shadow-slate-500/10">
              <Search className="mr-2 h-5 w-5" />
              Contact Support
            </Button>
          </div>

          {/* Additional info */}
          <Card className="mt-16 w-full max-w-md border-border/30 shadow-xl">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Try searching or check our documentation for the latest features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Browse Documentation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
