"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { trackAnalytics } from "@/lib/analytics";

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams?.toString();

    const pageUrl = search ? `${pathname}?${search}` : pathname;

    trackAnalytics({
      action: "page_view",
      target: "Page",
      details: pageUrl,
    });
  }, [pathname, searchParams]);

  return null;
}
