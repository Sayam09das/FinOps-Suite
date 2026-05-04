"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { useAuth } from "@/app/features/auth";
import { AUTH } from "@/app/lib/constants/auth";
import { useForgotPasswordMutation } from "@/app/lib/api/queries";
import { useToast } from "@/app/components/ui/use-toast";

const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, isInitializing } = useAuth();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const normalizedEmail = email.trim();
  const isEmailValid = useMemo(() => validateEmail(normalizedEmail), [normalizedEmail]);

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace(AUTH.DASHBOARD_PATH);
    }
  }, [isAuthenticated, isInitializing, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!normalizedEmail) {
      toast({
        title: "Email required",
        description: "Enter your account email to receive a reset link.",
        variant: "destructive",
      });
      return;
    }

    if (!isEmailValid) {
      toast({
        title: "Enter a valid email",
        description: "Please check the email address and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      await forgotPasswordMutation.mutateAsync({ email: normalizedEmail });
      setIsSubmitted(true);
      toast({
        title: "Check your inbox",
        description: "If this email exists, reset link has been sent.",
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description: error instanceof Error ? error.message : "Unable to send reset link right now.",
        variant: "destructive",
      });
    }
  };

  if (isInitializing || isAuthenticated) {
    return null;
  }

  return (
    <main className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#f3f8f4_38%,#ffffff_100%)] text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.15),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_34%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <section className="mb-10 max-w-2xl lg:mb-0 lg:w-[52%]">
          <p className="mb-4 inline-flex rounded-full border border-emerald-200/60 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur">
            Password Recovery
          </p>
          <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            Recover access
            <span className="block bg-linear-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              without the friction
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700/80">
            Enter your email address and we&apos;ll send a one-time secure link so you can create a new password in minutes.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur">
              <Mail className="h-5 w-5 text-blue-600" />
              <p className="mt-4 text-sm font-semibold text-slate-900">Email verification</p>
              <p className="mt-2 text-sm text-slate-600">We send the same neutral response to protect account privacy.</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <p className="mt-4 text-sm font-semibold text-slate-900">One-time token</p>
              <p className="mt-2 text-sm text-slate-600">Each reset link expires quickly and works only once.</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur">
              <Sparkles className="h-5 w-5 text-teal-600" />
              <p className="mt-4 text-sm font-semibold text-slate-900">Fast recovery</p>
              <p className="mt-2 text-sm text-slate-600">Open the email, choose a new password, and sign in again.</p>
            </div>
          </div>

          <div className="mt-10 rounded-[28px] border border-slate-200/70 bg-white/75 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white">1</span>
              Request the reset link
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">2</span>
              Open the email and verify the token
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">3</span>
              Create your new password and log in
            </div>
          </div>
        </section>

        <section className="lg:w-[430px]">
          <Card className="overflow-hidden rounded-[32px] border border-white/75 bg-white/88 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur sm:p-8">
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>
                {isSubmitted
                  ? "A reset link has been requested. Check your inbox and spam folder."
                  : "Enter your email to receive reset instructions."}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-6">
              {isSubmitted ? (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-emerald-200 bg-emerald-50/85 p-5 text-emerald-900">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                      <div>
                        <p className="font-semibold">Reset email requested</p>
                        <p className="mt-1 text-sm text-emerald-800/80">
                          If an account exists for <span className="font-medium">{email}</span>, a one-time reset link has been sent.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5 text-sm text-slate-600">
                    The reset link expires soon for security. If you don&apos;t see the email, check spam or request a new one.
                  </div>

                  <Button type="button" variant="secondary" className="w-full" onClick={() => setIsSubmitted(false)}>
                    Send again
                  </Button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm text-slate-600">
                    Enter the email you use to sign in. We&apos;ll handle the rest securely on the backend using the reset token flow.
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground/85">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/45" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className={`pl-10 ${normalizedEmail ? (isEmailValid ? "border-emerald-300 bg-emerald-50/40" : "border-rose-300 bg-rose-50/40") : ""}`}
                      />
                    </div>
                    {normalizedEmail && (
                      <p className={`mt-2 text-xs font-medium ${isEmailValid ? "text-emerald-700" : "text-rose-700"}`}>
                        {isEmailValid ? "Email looks good. We can send a reset link here." : "Please enter a valid email address."}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full rounded-2xl py-3 text-base" disabled={forgotPasswordMutation.isPending || !isEmailValid}>
                    {forgotPasswordMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              )}

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
