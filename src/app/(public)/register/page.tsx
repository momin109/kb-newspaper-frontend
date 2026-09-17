import type { Metadata } from "next";

import PublicRegisterForm from "@/features/auth/components/PublicRegisterForm";

export const metadata: Metadata = {
  title: "রেজিস্ট্রেশন | প্রভাতবার্তা",
  description:
    "প্রভাতবার্তায় নতুন অ্যাকাউন্ট তৈরি করে মন্তব্য, পছন্দ ও প্রিমিয়াম কনটেন্টের সুবিধা নিন।",
};

export default function RegisterPage() {
  return (
    <main className="relative isolate flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, color-mix(in oklch, var(--primary), transparent 88%), transparent 45%), radial-gradient(circle at 85% 80%, color-mix(in oklch, var(--primary), transparent 90%), transparent 45%)",
        }}
      />
      <PublicRegisterForm />
    </main>
  );
}
