"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { useAuth } from "@/app/features/auth";
import { AUTH } from "@/app/lib/constants/auth";
import { useResetPasswordMutation } from "@/app/lib/api/queries";
import { useToast } from "@/app/components/ui/use-toast";

const validatePassword = (value: string) => {
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(value)) return "Add at least one uppercase letter.";
  if (!/[a-z]/.test(value)) return "Add at least one lowercase letter.";
  if (!/[0-9]/.test(value)) return "Add at least one number.";
  if (!/[!@#$%^&*()_\-+=]/.test(value)) return "Add at least one special character.";
  return "";
};

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { isAuthenticated, isInitializing } = useAuth();
  const resetPasswordMutation = useResetPasswordMutation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const token = searchParams.get("token")?.trim() || "";
  const passwordError = useMemo(() => (password ? validatePassword(password) : ""), [password]);
  const confirmError = useMemo(() => {
    if (!confirmPassword) return "";
    return password === confirmPassword ? "" : "Passwords do not match.";
  }, [confirmPassword, password]);

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace(AUTH.DASHBOARD_PATH);
    }
  }, [isAuthenticated, isInitializing, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      toast({
        title: "Invalid link",
        description: "This password reset link is missing its token.",
        variant: "destructive",
      });
      return;
    }

    if (passwordError || confirmError) {
      toast({
        title: "Fix password fields",
        description: passwordError || confirmError,
        variant: "destructive",
      });
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({ token, password, confirmPassword });
      setIsComplete(true);
      toast({
        title: "Password updated",
        description: "Your password has been reset. Please sign in again.",
      });
      window.setTimeout(() => {
        router.replace("/login");
      }, 1200);
    } catch (error) {
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "This reset link is invalid or expired.",
        variant: "destructive",
      });
    }
  };

  if (isInitializing || isAuthenticated) {
    return null;
  }

  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_45%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <section className="mb-10 max-w-2xl lg:mb-0 lg:w-1/2">
          <p className="mb-4 inline-flex rounded-full border border-blue-200/50 bg-blue-50/60 px-4 py-2 text-sm font-medium text-blue-700">
            Secure Password Reset
          </p>
          <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Create a new password
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-foreground/70">
            Choose a strong password to restore access to your FinOps Suite workspace.
          </p>
        </section>

        <section className="lg:w-[440px]">
          <Card className="overflow-hidden p-6 shadow-[0_30px_80px_rgba(33,49,43,0.12)] sm:p-8">
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                {isComplete
                  ? "Your password is updated. Redirecting you back to login."
                  : "Enter a new password and confirm it to finish the reset."}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-6">
              {!token ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 text-rose-900">
                  <p className="font-semibold">Invalid reset link</p>
                  <p className="mt-1 text-sm text-rose-800/80">
                    This link is incomplete. Request a fresh password reset email and try again.
                  </p>
                </div>
              ) : isComplete ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-emerald-900">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-semibold">Password changed successfully</p>
                      <p className="mt-1 text-sm text-emerald-800/80">
                        Your reset token has been consumed, and you can now sign in with the new password.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground/85">
                      New password
                    </label>
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/45" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="pr-10 pl-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute inset-y-0 right-3 flex items-center text-foreground/55"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className={`mt-2 text-xs ${passwordError ? "text-rose-700" : "text-foreground/60"}`}>
                      {passwordError || "Use 8+ characters with uppercase, lowercase, number, and special character."}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-foreground/85">
                      Confirm password
                    </label>
                    <div className="relative">
                      <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/45" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="pr-10 pl-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((current) => !current)}
                        className="absolute inset-y-0 right-3 flex items-center text-foreground/55"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmError && <p className="mt-2 text-xs text-rose-700">{confirmError}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={resetPasswordMutation.isPending || !password || !confirmPassword}
                  >
                    {resetPasswordMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating password...
                      </>
                    ) : (
                      "Save New Password"
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
