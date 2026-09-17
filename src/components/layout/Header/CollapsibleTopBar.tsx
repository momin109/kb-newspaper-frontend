"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * TopUtilityBar + MainHeader-কে র‍্যাপ করে। স্ক্রল ২৪px পার হওয়ার সাথে সাথেই
 * এই অংশ height/opacity animate করে হাইড হয়ে যায়, ফলে নিচের CategoryNavBar
 * (sticky top-0) সাথে সাথেই viewport-এর একদম উপরে চলে আসে।
 */
export function CollapsibleTopBar({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setHidden(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={
        hidden
          ? "pointer-events-none max-h-0 overflow-hidden opacity-0 transition-[max-height,opacity] duration-300 ease-in-out"
          : "max-h-[320px] overflow-hidden opacity-100 transition-[max-height,opacity] duration-300 ease-in-out"
      }
    >
      {children}
    </div>
  );
}
