import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Shown when GET /api/article/:slug returns 403 (isPremium && no auth). */
export function PremiumGate() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-lg border border-border bg-card px-6 py-12 text-center">
      <Lock className="h-8 w-8 text-primary" />
      <h1 className="text-lg font-bold">এটি প্রিমিয়াম কনটেন্ট</h1>
      <p className="text-sm text-muted-foreground">
        পুরো প্রতিবেদনটি পড়তে অনুগ্রহ করে লগইন করুন অথবা সাবস্ক্রাইব করুন।
      </p>
      <Button onClick={() => (window.location.href = "/login")}>
        লগইন করুন
      </Button>
    </div>
  );
}
