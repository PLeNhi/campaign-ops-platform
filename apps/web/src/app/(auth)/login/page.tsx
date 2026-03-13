"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(callbackUrl);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 items-center justify-center">
      <div className="w-full rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-900/40">
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">
          Admin Sign In
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Use the admin credentials configured in environment variables.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-xs font-medium uppercase tracking-wide text-slate-400"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 ring-blue-500/60 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-xs font-medium uppercase tracking-wide text-slate-400"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 ring-blue-500/60 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-800"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

