export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back. Here&apos;s an overview of your newspaper.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Total Articles", "Published Articles", "Comments", "Users"].map(
          (title) => (
            <div key={title} className="rounded-xl border bg-card p-5">
              <p className="text-sm text-muted-foreground">{title}</p>

              <p className="mt-2 text-2xl font-semibold">—</p>
            </div>
          ),
        )}
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold">Recent Activity</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Activity data will be connected later.
        </p>
      </div>
    </div>
  );
}
