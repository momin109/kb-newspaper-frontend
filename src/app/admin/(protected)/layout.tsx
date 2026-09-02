"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";
import AdminLayout from "@/features/admin/components/AdminLayout";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user?.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, user, router, pathname]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
