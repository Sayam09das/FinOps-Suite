"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Check, AlertCircle, Lock, Zap, Target, Shield } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";

const validateFullName = (value: string) => {
  if (!value) {
    return { isValid: false, message: "Full name is required." };
  }
  if (value.trim().length < 2) {
    return { isValid: false, message: "Please enter at least 2 characters." };
  }
  if (!/^[a-zA-Z\s'-]+$/.test(value)) {
    return { isValid: false, message: "Please use only letters, spaces, hyphens, and apostrophes." };
  }
  return { isValid: true, message: "Name verified." };
};

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

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [fullNameState, setFullNameState] = useState<{ touched: boolean; isValid: boolean; message: string }>({
    touched: false,
    isValid: false,
    message: "",
  });

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

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    if (value) {
      const validation = validateFullName(value);
      setFullNameState({ touched: true, isValid: validation.isValid, message: validation.message });
    } else {
      setFullNameState({ touched: true, isValid: false, message: "" });
    }
  };

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fullNameValidation = validateFullName(fullName);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setFullNameState({ touched: true, isValid: fullNameValidation.isValid, message: fullNameValidation.message });
    setEmailState({ touched: true, isValid: emailValidation.isValid, message: emailValidation.message });
    setPasswordState({ touched: true, isValid: passwordValidation.isValid, message: passwordValidation.message });

    if (!fullNameValidation.isValid || !emailValidation.isValid || !passwordValidation.isValid) {
      return;
    }

    // TODO: wire this to the real registration flow
  };

  const isFormValid = fullNameState.isValid && emailState.isValid && passwordState.isValid;

  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(92,164,255,0.14),_transparent_48%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <section className="mb-10 max-w-2xl lg:mb-0 lg:w-1/2">
          <p className="mb-4 inline-flex rounded-full border border-blue-200/50 bg-blue-50/50 px-4 py-2 text-sm font-medium text-blue-700">
            ✓ Join thousands of teams
          </p>
          <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Start managing your
            <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              finances today
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-foreground/70">
            Create your account and take control of budgets, approvals, and spend analytics with enterprise-grade security.
          </p>
          
          <div className="mt-12 space-y-5">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-100 p-2 flex-shrink-0">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Get started instantly</p>
                <p className="mt-1 text-sm text-foreground/65">Set up your workspace and invite teammates in minutes.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-emerald-100 p-2 flex-shrink-0">
                <Target className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Smart budget controls</p>
                <p className="mt-1 text-sm text-foreground/65">Set limits, track spending, and get alerts in real-time.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-full bg-purple-100 p-2 flex-shrink-0">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Bank-level security</p>
                <p className="mt-1 text-sm text-foreground/65">SOC 2 certified with end-to-end encryption for all data.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4 text-sm text-foreground/60">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Free 30-day trial</span>
            </div>
            <span>•</span>
            <span>No credit card required</span>
            <span>•</span>
            <span>Cancel anytime</span>
          </div>
        </section>

        <section className="lg:w-[420px]">
          <Card className="overflow-hidden p-6 shadow-[0_30px_80px_rgba(33,49,43,0.12)] sm:p-8">
            <CardHeader>
              <CardTitle>Join FinOps Suite</CardTitle>
              <CardDescription>Register your account to unlock reporting, budgets, and team workflows.</CardDescription>
            </CardHeader>
            <CardContent className="mt-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-foreground/85">
                    Full name
                  </label>
                  <div className="relative">
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Jane Doe"
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) => handleFullNameChange(event.target.value)}
                      className={`${fullNameState.touched && fullName ? (fullNameState.isValid ? "border-emerald-300 bg-emerald-50/40" : "border-rose-300 bg-rose-50/40") : ""}`}
                    />
                    {fullNameState.touched && fullName && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        {fullNameState.isValid ? (
                          <Check className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-rose-600" />
                        )}
                      </div>
                    )}
                  </div>
                  {fullNameState.touched && fullNameState.message && (
                    <p className={`mt-2 text-xs font-medium ${fullNameState.isValid ? "text-emerald-700" : "text-rose-700"}`}>
                      {fullNameState.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground/85">
                    Work email
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
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground/85">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      autoComplete="new-password"
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

                {(fullNameState.touched || emailState.touched || passwordState.touched) && (
                  <div className={`rounded-lg border px-4 py-3 text-sm transition-all ${
                    isFormValid
                      ? "border-emerald-200 bg-emerald-50/60 text-emerald-900"
                      : "border-amber-200 bg-amber-50/60 text-amber-900"
                  }`}>
                    <p className="font-medium flex items-center gap-2">
                      {isFormValid ? (
                        <>
                          <Check className="h-4 w-4" />
                          Sonar validation passed. Ready to sign up.
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

                <Button type="submit" className="w-full rounded-2xl py-3 text-base" size="lg" disabled={!isFormValid}>
                  Create account
                </Button>
              </form>
            </CardContent>
            <CardFooter className="mt-6 justify-center text-sm text-foreground/75">
              <span>Already have an account?</span>
              <Link href="/login" className="ml-2 font-semibold text-foreground transition hover:text-foreground/90">
                Sign in
              </Link>
            </CardFooter>
          </Card>
        </section>
      </div>
    </main>
  );
}
