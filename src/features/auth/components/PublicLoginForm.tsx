"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PERKS = [
  "প্রতিদিনের সেরা খবর সবার আগে",
  "প্রিয় বিভাগ বুকমার্ক করে রাখুন",
  "সরাসরি মন্তব্য ও আলোচনায় অংশ নিন",
];

export default function PublicLoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");
    try {
      const user = await login(values.email, values.password);
      toast.success(`স্বাগতম, ${user.fullName}!`);
      router.push("/");
      router.refresh();
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ??
          "লগইন ব্যর্থ হয়েছে। ইমেইল ও পাসওয়ার্ড আবার যাচাই করুন।",
      );
    }
  };

  return (
    <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl shadow-primary/10 md:grid-cols-2">
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
            আবার স্বাগতম
          </h2>
          <p className="text-sm leading-relaxed text-primary-foreground/80">
            আপনার অ্যাকাউন্টে লগইন করে প্রভাতবার্তার সব সুবিধা উপভোগ করুন।
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
        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground md:hidden">
          প্র
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          লগইন করুন
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            রেজিস্ট্রেশন করুন
          </Link>
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-5">
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <Link
                href="#"
                className="text-xs font-medium text-primary hover:underline"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>
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
                লগইন হচ্ছে...
              </>
            ) : (
              <>
                লগইন করুন
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          লগইন করার মাধ্যমে আপনি প্রভাতবার্তার{" "}
          <Link href="#" className="underline hover:text-foreground">
            ব্যবহারের শর্তাবলী
          </Link>{" "}
          মেনে নিচ্ছেন।
        </p>
      </div>
    </div>
  );
}
