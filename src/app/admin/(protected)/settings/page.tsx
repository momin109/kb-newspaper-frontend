import { GeneralSettingsForm } from "@/features/settings/components/GeneralSettingsForm";

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          আপনার সংবাদপত্রের website settings পরিচালনা করুন।
        </p>
      </div>

      {/* General Settings */}
      <GeneralSettingsForm />
    </div>
  );
}
