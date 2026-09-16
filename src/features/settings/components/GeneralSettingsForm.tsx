"use client";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Settings2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  getSettings,
  updateGeneralSettings,
} from "../services/settings.service";

import {
  generalSettingsSchema,
  type GeneralSettingsFormValues,
} from "../schemas/settings.schema";

export function GeneralSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: "",
      tagline: "",
      description: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      websiteUrl: "",
      language: "bn",
      timezone: "Asia/Dhaka",
      copyrightText: "",
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);

        const settings = await getSettings();

        reset({
          siteName: settings.general.siteName ?? "",
          tagline: settings.general.tagline ?? "",
          description: settings.general.description ?? "",
          contactEmail: settings.general.contactEmail ?? "",
          contactPhone: settings.general.contactPhone ?? "",
          address: settings.general.address ?? "",
          websiteUrl: settings.general.websiteUrl ?? "",
          language: settings.general.language ?? "bn",
          timezone: settings.general.timezone ?? "Asia/Dhaka",
          copyrightText: settings.general.copyrightText ?? "",
        });
      } catch (error) {
        console.error("Failed to load settings:", error);

        toast.error("Settings load করা যায়নি");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [reset]);

  const onSubmit = async (data: GeneralSettingsFormValues) => {
    try {
      setSaving(true);

      await updateGeneralSettings(data);

      toast.success("General settings successfully updated");
    } catch (error) {
      console.error("Failed to update settings:", error);

      toast.error("Settings update করা যায়নি");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Settings2 className="h-5 w-5" />
            </div>

            <div>
              <CardTitle>সাধারণ তথ্য</CardTitle>
              <CardDescription>
                আপনার সংবাদপত্রের basic information পরিচালনা করুন।
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          {/* Site Name */}
          <div className="space-y-2">
            <Label htmlFor="siteName">সাইটের নাম</Label>

            <Input
              id="siteName"
              placeholder="প্রভাতবার্তা"
              {...register("siteName")}
            />

            {errors.siteName && (
              <p className="text-sm text-destructive">
                {errors.siteName.message}
              </p>
            )}
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>

            <Input
              id="tagline"
              placeholder="দৈনিক সংবাদপত্র"
              {...register("tagline")}
            />

            {errors.tagline && (
              <p className="text-sm text-destructive">
                {errors.tagline.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              placeholder="আপনার সংবাদপত্র সম্পর্কে সংক্ষিপ্ত বিবরণ..."
              rows={4}
              {...register("description")}
            />

            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>যোগাযোগের তথ্য</CardTitle>

          <CardDescription>
            Public website-এ ব্যবহৃত contact information।
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>

            <Input
              id="contactEmail"
              type="email"
              placeholder="info@provatbarta.com"
              {...register("contactEmail")}
            />

            {errors.contactEmail && (
              <p className="text-sm text-destructive">
                {errors.contactEmail.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>

            <Input
              id="contactPhone"
              placeholder="+8801XXXXXXXXX"
              {...register("contactPhone")}
            />

            {errors.contactPhone && (
              <p className="text-sm text-destructive">
                {errors.contactPhone.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Office Address</Label>

            <Textarea
              id="address"
              placeholder="ঢাকা, বাংলাদেশ"
              rows={3}
              {...register("address")}
            />

            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Website */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="websiteUrl">Website URL</Label>

            <Input
              id="websiteUrl"
              type="url"
              placeholder="https://provatbarta.com"
              {...register("websiteUrl")}
            />

            {errors.websiteUrl && (
              <p className="text-sm text-destructive">
                {errors.websiteUrl.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Settings</CardTitle>

          <CardDescription>
            Website-এর language এবং timezone configuration।
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          {/* Language */}
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>

            <Input id="language" {...register("language")} readOnly />

            <p className="text-xs text-muted-foreground">
              বর্তমানে বাংলা language ব্যবহার করা হচ্ছে।
            </p>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>

            <Input id="timezone" {...register("timezone")} readOnly />

            <p className="text-xs text-muted-foreground">
              Bangladesh timezone: Asia/Dhaka
            </p>
          </div>

          {/* Copyright */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="copyrightText">Copyright Text</Label>

            <Input
              id="copyrightText"
              placeholder="© 2026 প্রভাতবার্তা। সর্বস্বত্ব সংরক্ষিত।"
              {...register("copyrightText")}
            />

            {errors.copyrightText && (
              <p className="text-sm text-destructive">
                {errors.copyrightText.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button type="submit" disabled={saving} className="min-w-[150px]">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
