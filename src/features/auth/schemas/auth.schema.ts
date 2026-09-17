import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "ইমেইল আবশ্যক").email("সঠিক ইমেইল ঠিকানা দিন"),

  password: z
    .string()
    .min(1, "পাসওয়ার্ড আবশ্যক")
    .min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "নাম আবশ্যক")
      .min(3, "নাম কমপক্ষে ৩ অক্ষরের হতে হবে"),

    email: z.string().min(1, "ইমেইল আবশ্যক").email("সঠিক ইমেইল ঠিকানা দিন"),

    phone: z
      .string()
      .min(1, "মোবাইল নম্বর আবশ্যক")
      .regex(/^(\+?880|0)1[3-9]\d{8}$/, "সঠিক বাংলাদেশি মোবাইল নম্বর দিন"),

    password: z
      .string()
      .min(1, "পাসওয়ার্ড আবশ্যক")
      .min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),

    confirmPassword: z.string().min(1, "পাসওয়ার্ড আবার লিখুন"),

    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "চালিয়ে যেতে হলে শর্তাবলী মেনে নিতে হবে",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড দুটো মিলছে না",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
