// app/profile/edit/page.tsx
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  changePassword,
  getMe,
  updateMe,
} from "@/features/profile/services/profile.service";
import type {
  Profile,
  UpdateProfilePayload,
} from "@/features/profile/types/profile.types";

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground outline-none transition-colors focus:border-primary";
const labelClass = "mb-1.5 block text-sm font-medium text-foreground/80";

export default function EditProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<UpdateProfilePayload>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  useEffect(() => {
    getMe().then((p) => {
      setProfile(p);
      setForm({
        fullName: p.fullName,
        phone: p.phone,
        address: p.address ?? "",
        bio: p.bio ?? "",
        website: p.website ?? "",
      });
    });
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      await updateMe(form, avatarFile);
      setProfileMsg({ type: "ok", text: "প্রোফাইল সফলভাবে আপডেট হয়েছে" });
      router.refresh();
    } catch {
      setProfileMsg({ type: "err", text: "প্রোফাইল আপডেট করা যায়নি" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: "err", text: "নতুন পাসওয়ার্ড দুটো মিলছে না" });
      return;
    }
    setSavingPassword(true);
    setPasswordMsg(null);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMsg({ type: "ok", text: "পাসওয়ার্ড পরিবর্তন হয়েছে" });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      setPasswordMsg({
        type: "err",
        text: "বর্তমান পাসওয়ার্ড সঠিক নয়, অথবা কোনো সমস্যা হয়েছে",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-xl font-bold text-foreground">
        প্রোফাইল এডিট করুন
      </h1>

      {/* Profile info form */}
      <form onSubmit={handleProfileSubmit} className="space-y-5">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-primary/10 ring-2 ring-primary/20"
          >
            {(avatarPreview ?? profile.avatar) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarPreview ?? profile.avatar ?? ""}
                alt={profile.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xl font-bold text-primary">
                {profile.fullName.charAt(0)}
              </span>
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-5 w-5 text-white" />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <p className="text-sm text-muted-foreground">
            ছবিতে ক্লিক করে নতুন প্রোফাইল ছবি বাছাই করুন
          </p>
        </div>

        <div>
          <label className={labelClass}>নাম</label>
          <input
            className={inputClass}
            value={form.fullName ?? ""}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>ফোন</label>
          <input
            className={inputClass}
            value={form.phone ?? ""}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>ঠিকানা</label>
          <input
            className={inputClass}
            value={form.address ?? ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>ওয়েবসাইট</label>
          <input
            className={inputClass}
            value={form.website ?? ""}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>বায়ো</label>
          <textarea
            rows={4}
            className={inputClass}
            value={form.bio ?? ""}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>

        {profileMsg && (
          <p className={cn_text(profileMsg.type)}>{profileMsg.text}</p>
        )}

        <Button type="submit" disabled={savingProfile} className="rounded-full">
          {savingProfile ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
        </Button>
      </form>

      {/* Change password */}
      <div className="my-10 border-t border-border" />

      <h2 className="mb-5 text-lg font-bold text-foreground">
        পাসওয়ার্ড পরিবর্তন
      </h2>
      <form onSubmit={handlePasswordSubmit} className="space-y-5">
        <div>
          <label className={labelClass}>বর্তমান পাসওয়ার্ড</label>
          <input
            type="password"
            className={inputClass}
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                currentPassword: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className={labelClass}>নতুন পাসওয়ার্ড</label>
          <input
            type="password"
            className={inputClass}
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
          />
        </div>
        <div>
          <label className={labelClass}>নতুন পাসওয়ার্ড আবার লিখুন</label>
          <input
            type="password"
            className={inputClass}
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              })
            }
          />
        </div>

        {passwordMsg && (
          <p className={cn_text(passwordMsg.type)}>{passwordMsg.text}</p>
        )}

        <Button
          type="submit"
          disabled={savingPassword}
          variant="outline"
          className="rounded-full"
        >
          {savingPassword ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
        </Button>
      </form>
    </div>
  );
}

function cn_text(type: "ok" | "err") {
  return type === "ok" ? "text-sm text-green-600" : "text-sm text-destructive";
}
