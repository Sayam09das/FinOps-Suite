"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(57,148,255,0.18),_transparent_45%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <section className="mb-10 max-w-2xl lg:mb-0 lg:w-1/2">
          <p className="mb-4 inline-flex rounded-full border border-emerald-200/50 bg-emerald-50/50 px-4 py-2 text-sm font-medium text-emerald-700">
            Password Recovery
          </p>
          <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Reset your password
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-foreground/70">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </section>

        <section className="lg:w-[420px]">
          <Card className="overflow-hidden p-6 shadow-[0_30px_80px_rgba(33,49,43,0.12)] sm:p-8">
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>Enter your email to receive reset instructions.</CardDescription>
            </CardHeader>
            <CardContent className="mt-6">
              <form className="space-y-6">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground/85">
                    Email address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm text-foreground/60 hover:text-foreground">
                  <ArrowLeft className="mr-2 inline h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}