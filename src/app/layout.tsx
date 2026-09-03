import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "@/components/Providers";
import AuthProvider from "@/features/auth/components/AuthProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import QueryProvider from "@/components/QueryProvider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "প্রভাতবার্তা | দৈনিক সংবাদপত্র",
  description: "প্রভাতবার্তা — বাংলাদেশের বিশ্বস্ত অনলাইন সংবাদ মাধ্যম",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={cn("h-full antialiased", "font-sans", geist.variable)}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
