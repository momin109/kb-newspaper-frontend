import { z } from "zod";

export const generalSettingsSchema = z.object({
  siteName: z.string().min(2, "সাইটের নাম কমপক্ষে ২ অক্ষরের হতে হবে"),

  tagline: z.string().min(2, "Tagline কমপক্ষে ২ অক্ষরের হতে হবে"),

  description: z
    .string()
    .max(500, "Description সর্বোচ্চ ৫০০ অক্ষর হতে পারে")
    .optional()
    .or(z.literal("")),

  contactEmail: z
    .string()
    .email("সঠিক email address দিন")
    .optional()
    .or(z.literal("")),

  contactPhone: z.string().optional().or(z.literal("")),

  address: z.string().optional().or(z.literal("")),

  websiteUrl: z
    .string()
    .url("সঠিক website URL দিন")
    .optional()
    .or(z.literal("")),

  language: z.string().min(1, "Language নির্বাচন করুন"),

  timezone: z.string().min(1, "Timezone নির্বাচন করুন"),

  copyrightText: z
    .string()
    .max(200, "Copyright text সর্বোচ্চ ২০০ অক্ষর হতে পারে")
    .optional()
    .or(z.literal("")),
});

export type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;
