"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PERKS = [
  "সম্পূর্ণ ফ্রি রেজিস্ট্রেশন, মাত্র ১ মিনিটে",
  "মন্তব্য, রিয়েকশন ও পছন্দের তালিকা",
  "প্রিমিয়াম কনটেন্টে অগ্রাধিকার প্রবেশাধিকার",
];

export default function PublicRegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError("");
    try {
      const user = await registerUser({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      toast.success(`স্বাগতম, ${user.fullName}! আপনার অ্যাকাউন্ট তৈরি হয়েছে।`);
      router.push("/");
      router.refresh();
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ??
          "রেজিস্ট্রেশন ব্যর্থ হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।",
      );
    }
  };

  return (
    <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl shadow-primary/10 md:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-brand-dark p-10 text-primary-foreground md:flex">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-black/10 blur-2xl" />

        <div className="relative">
          <Link href="/" className="mb-10 flex items-center gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-lg font-extrabold backdrop-blur">
              প্র
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              প্রভাত<span className="text-white/80">বার্তা</span>
            </span>
          </Link>

          <h2 className="mb-3 text-2xl font-bold leading-snug sm:text-3xl">
            পরিবারে যোগ দিন
          </h2>
          <p className="text-sm leading-relaxed text-primary-foreground/80">
            একটি অ্যাকাউন্ট তৈরি করে প্রভাতবার্তার সম্পূর্ণ অভিজ্ঞতা নিন।
          </p>
        </div>

        <ul className="relative space-y-3">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-center gap-2.5 text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-white/90" />
              <span className="text-primary-foreground/90">{perk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center p-6 sm:p-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          নতুন অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            লগইন করুন
          </Link>
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">পূর্ণ নাম</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="fullName"
                  placeholder="আপনার নাম"
                  className="h-11 pl-10"
                  disabled={isSubmitting}
                  {...form.register("fullName")}
                />
              </div>
              {form.formState.errors.fullName && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">মোবাইল নম্বর</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="017XXXXXXXX"
                  className="h-11 pl-10"
                  disabled={isSubmitting}
                  {...form.register("phone")}
                />
              </div>
              {form.formState.errors.phone && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">ইমেইল</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-11 pl-10"
                disabled={isSubmitting}
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 pl-10 pr-10"
                  disabled={isSubmitting}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 pl-10 pr-10"
                  disabled={isSubmitting}
                  {...form.register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showConfirm ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"
                  }
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary accent-primary"
              disabled={isSubmitting}
              {...form.register("agreeTerms")}
            />
            <span>
              আমি প্রভাতবার্তার{" "}
              <Link
                href="#"
                className="text-primary underline hover:no-underline"
              >
                ব্যবহারের শর্তাবলী
              </Link>{" "}
              ও{" "}
              <Link
                href="#"
                className="text-primary underline hover:no-underline"
              >
                গোপনীয়তা নীতি
              </Link>{" "}
              মেনে নিচ্ছি
            </span>
          </label>
          {form.formState.errors.agreeTerms && (
            <p className="text-xs text-destructive">
              {form.formState.errors.agreeTerms.message}
            </p>
          )}

          {serverError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full gap-1.5 rounded-full text-[15px] shadow-lg shadow-primary/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                অ্যাকাউন্ট তৈরি হচ্ছে...
              </>
            ) : (
              <>
                রেজিস্ট্রেশন করুন
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
