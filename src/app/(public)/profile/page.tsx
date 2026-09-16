// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Pencil,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getMe } from "@/features/profile/services/profile.service";
import {
  ROLE_LABELS,
  type Profile,
} from "@/features/profile/types/profile.types";

function InfoRow({
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
    <div className="flex items-start gap-3 border-b border-border/60 py-4 last:border-0">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-base text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMe()
      .then(setProfile)
      .catch(() => setError("প্রোফাইল তথ্য লোড করা যায়নি"));
  }, []);

  if (error) {
    return (
      <p className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground">
        {error}
      </p>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-8 sm:flex-row sm:gap-10">
        {/* Identity block */}
        <div className="flex shrink-0 flex-col items-center gap-3 sm:w-48 sm:items-start">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary/10 ring-2 ring-primary/20">
            {profile.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-primary">
                {profile.fullName.charAt(0)}
              </span>
            )}
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-xl font-bold text-foreground">
              {profile.fullName}
            </h1>
            <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {ROLE_LABELS[profile.role]}
            </span>
          </div>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="mt-2 gap-1.5 rounded-full"
          >
            <Link href="/profile/edit">
              <Pencil className="h-3.5 w-3.5" />
              প্রোফাইল এডিট করুন
            </Link>
          </Button>
        </div>

        {/* Info list */}
        <div className="flex-1">
          <InfoRow icon={Mail} label="ইমেইল" value={profile.email} />
          <InfoRow icon={Phone} label="ফোন" value={profile.phone} />
          <InfoRow icon={MapPin} label="ঠিকানা" value={profile.address} />
          <InfoRow icon={Globe} label="ওয়েবসাইট" value={profile.website} />
          <InfoRow icon={FileText} label="বায়ো" value={profile.bio} />
        </div>
      </div>
    </div>
  );
}
