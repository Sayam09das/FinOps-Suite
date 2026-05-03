"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, AlertCircle, Lock, TrendingUp, Users, BarChart3 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { useAuth } from "@/app/features/auth";
import { AUTH } from "@/app/lib/constants/auth";

const validateEmail = (value: string) => {
  if (!value) {
    return { isValid: false, message: "Email address is required." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return { isValid: false, message: "Please enter a valid email address." };
  }
  return { isValid: true, message: "Email address verified." };
};

const validatePassword = (value: string) => {
  if (!value) {
    return { isValid: false, message: "Password is required." };
  }
  if (value.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters." };
  }
  if (!/[A-Z]/.test(value)) {
    return { isValid: false, message: "Add an uppercase letter." };
  }
  if (!/[a-z]/.test(value)) {
    return { isValid: false, message: "Add a lowercase letter." };
  }
  if (!/[0-9]/.test(value)) {
    return { isValid: false, message: "Add a number." };
  }
  if (!/[!@#$%^&*()_\-+=]/.test(value)) {
    return { isValid: false, message: "Add a special character." };
  }
  return { isValid: true, message: "Password meets security standards." };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailState, setEmailState] = useState<{ touched: boolean; isValid: boolean; message: string }>({
    touched: false,
    isValid: false,
    message: "",
  });

  const [passwordState, setPasswordState] = useState<{ touched: boolean; isValid: boolean; message: string }>({
    touched: false,
    isValid: false,
    message: "",
  });

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value) {
      const validation = validateEmail(value);
      setEmailState({ touched: true, isValid: validation.isValid, message: validation.message });
    } else {
      setEmailState({ touched: true, isValid: false, message: "" });
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value) {
      const validation = validatePassword(value);
      setPasswordState({ touched: true, isValid: validation.isValid, message: validation.message });
    } else {
      setPasswordState({ touched: true, isValid: false, message: "" });
    }
  };

  const { login, isLoading: authLoading, isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace(AUTH.DASHBOARD_PATH);
    }
  }, [isAuthenticated, isInitializing, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setEmailState({ touched: true, isValid: emailValidation.isValid, message: emailValidation.message });
    setPasswordState({ touched: true, isValid: passwordValidation.isValid, message: passwordValidation.message });

    if (!emailValidation.isValid || !passwordValidation.isValid) {
      return;
    }

    await login(email, password);
  };

  const isFormValid = emailState.isValid && passwordState.isValid && !authLoading;

  if (isInitializing || isAuthenticated) {
    return null;
  }

  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(57,148,255,0.18),_transparent_45%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <section className="mb-10 max-w-2xl lg:mb-0 lg:w-1/2">
          <p className="mb-4 inline-flex rounded-full border border-emerald-200/50 bg-emerald-50/50 px-4 py-2 text-sm font-medium text-emerald-700">
            ✓ Trusted by finance teams
          </p>
          <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Welcome back to
            <span className="block bg-linear-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              FinOps Suite
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-foreground/70">
            One unified platform for managing budgets, approvals, and spend insights. Used by leading finance and operations teams worldwide.
          </p>
          
          <div className="mt-12 space-y-5">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-emerald-100 p-2 flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Instant spend insights</p>
                <p className="mt-1 text-sm text-foreground/65">Real-time dashboards and AI-powered analytics at your fingertips.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-100 p-2 flex-shrink-0">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Team collaboration</p>
                <p className="mt-1 text-sm text-foreground/65">Invite colleagues, set permissions, and keep everyone aligned.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-full bg-purple-100 p-2 flex-shrink-0">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Advanced reporting</p>
                <p className="mt-1 text-sm text-foreground/65">Custom reports and forecasting to stay ahead of your budget.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4 text-sm text-foreground/60">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Enterprise security</span>
            </div>
            <span>•</span>
            <span>30-day free trial</span>
            <span>•</span>
            <span>No credit card</span>
          </div>
        </section>

        <section className="lg:w-[420px]">
          <Card className="overflow-hidden p-6 shadow-[0_30px_80px_rgba(33,49,43,0.12)] sm:p-8">
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Enter your credentials to access your dashboard and start tracking spend.</CardDescription>
            </CardHeader>
            <CardContent className="mt-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground/85">
                    Email address
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => handleEmailChange(event.target.value)}
                      className={`${emailState.touched && email ? (emailState.isValid ? "border-emerald-300 bg-emerald-50/40" : "border-rose-300 bg-rose-50/40") : ""}`}
                    />
                    {emailState.touched && email && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        {emailState.isValid ? (
                          <Check className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-rose-600" />
                        )}
                      </div>
                    )}
                  </div>
                  {emailState.touched && emailState.message && (
                    <p className={`mt-2 text-xs font-medium ${emailState.isValid ? "text-emerald-700" : "text-rose-700"}`}>
                      {emailState.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm text-foreground/75">
                    <label htmlFor="password" className="mb-2 block font-medium">
                      Password
                    </label>
                    <Link href="/forgot-password" className="font-medium text-foreground/80 transition hover:text-foreground">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className={`pr-24 ${passwordState.touched && password ? (passwordState.isValid ? "border-emerald-300 bg-emerald-50/40" : "border-rose-300 bg-rose-50/40") : ""}`}
                      value={password}
                      onChange={(event) => handlePasswordChange(event.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-12 flex items-center text-foreground/60 transition hover:text-foreground"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {passwordState.touched && password && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        {passwordState.isValid ? (
                          <Check className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-rose-600" />
                        )}
                      </div>
                    )}
                  </div>
                  {passwordState.touched && passwordState.message && (
                    <p className={`mt-2 text-xs font-medium ${passwordState.isValid ? "text-emerald-700" : "text-rose-700"}`}>
                      {passwordState.message}
                    </p>
                  )}
                </div>

                {(emailState.touched || passwordState.touched) && (
                  <div className={`rounded-lg border px-4 py-3 text-sm transition-all ${
                    isFormValid
                      ? "border-emerald-200 bg-emerald-50/60 text-emerald-900"
                      : "border-amber-200 bg-amber-50/60 text-amber-900"
                  }`}>
                    <p className="font-medium flex items-center gap-2">
                      {isFormValid ? (
                        <>
                          <Check className="h-4 w-4" />
                          Sonar validation passed. Ready to sign in.
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          Complete all required fields to proceed.
                        </>
                      )}
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full rounded-2xl py-3 text-base" size="lg" disabled={!isFormValid || authLoading}>
                  {authLoading ? (
                    <>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="mt-6 justify-center text-sm text-foreground/75">
              <span>New to FinOps Suite?</span>
              <Link href="/register" className="ml-2 font-semibold text-foreground transition hover:text-foreground/90">
                Create an account
              </Link>
            </CardFooter>
          </Card>
        </section>
      </div>
    </main>
  );
}
