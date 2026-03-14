import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-semibold text-slate-200">
        You don&apos;t have permission to view this page
      </h1>
      <p className="text-sm text-slate-400">
        Contact an administrator if you believe this is an error.
      </p>
      <Link
        href="/"
        className="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-600"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
