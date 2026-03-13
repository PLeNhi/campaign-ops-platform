export default function HomePage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">
          Campaign Overview
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          This is the foundation for your Smart Campaign Manager admin
          dashboard.
        </p>
      </section>
      <section className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <h2 className="text-sm font-medium text-slate-200">
            Campaigns (stub)
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            We&apos;ll add campaign list and creation here in the next phases.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <h2 className="text-sm font-medium text-slate-200">
            Notifications (stub)
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Notification templates, schedules and logs will live here.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <h2 className="text-sm font-medium text-slate-200">
            Segments & Users (stub)
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            User segments and targeting rules will be connected later.
          </p>
        </div>
      </section>
    </div>
  );
}

