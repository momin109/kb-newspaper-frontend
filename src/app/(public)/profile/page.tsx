"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Pencil,
  Loader2,
  ShieldCheck,
  CalendarDays,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMe } from "@/features/profile/services/profile.service";
import {
  ROLE_LABELS,
  type Profile,
} from "@/features/profile/types/profile.types";
import { formatBanglaRelativeTime } from "@/lib/relativeTime";

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/30">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMe()
      .then(setProfile)
      .catch(() => setError("প্রোফাইল তথ্য লোড করা যায়নি"));
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl pb-16">
      {/* Cover */}
      <div className="relative h-40 overflow-hidden sm:h-52">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-brand-dark" />
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-black/10 blur-2xl" />
      </div>

      <div className="px-4 sm:px-6">
        {/* Identity row */}
        <div className="-mt-14 flex flex-col items-center gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:gap-6">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-muted ring-4 ring-background sm:h-32 sm:w-32">
            {profile.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-primary/10 text-3xl font-bold text-primary">
                {profile.fullName.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                  {profile.fullName}
                </h1>
                {profile.isVerified && (
                  <ShieldCheck
                    className="h-5 w-5 text-primary"
                    aria-label="ভেরিফাইড"
                  />
                )}
              </div>

              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {ROLE_LABELS[profile.role]}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatBanglaRelativeTime(profile.createdAt)} যোগ দিয়েছেন
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild size="sm" className="gap-1.5 rounded-full px-4">
                <Link href="/profile/edit">
                  <Pencil className="h-3.5 w-3.5" />
                  প্রোফাইল এডিট
                </Link>
              </Button>
              <Button
                onClick={logout}
                size="sm"
                variant="outline"
                className="gap-1.5 rounded-full px-4"
              >
                <LogOut className="h-3.5 w-3.5" />
                লগআউট
              </Button>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-6 rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm leading-relaxed text-foreground/90">
            {profile.bio}
          </p>
        )}

        {/* Info grid */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <InfoCard icon={Mail} label="ইমেইল" value={profile.email} />
          <InfoCard icon={Phone} label="ফোন" value={profile.phone} />
          <InfoCard icon={MapPin} label="ঠিকানা" value={profile.address} />
          <InfoCard icon={Globe} label="ওয়েবসাইট" value={profile.website} />
        </div>
      </div>
    </div>
  );
}
