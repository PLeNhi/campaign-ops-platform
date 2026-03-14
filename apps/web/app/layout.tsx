import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers";

export const metadata: Metadata = {
  title: "Smart Campaign Manager",
  description: "Admin dashboard for campaigns and notifications"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-slate-800 bg-slate-900/60 px-6 py-4">
              <div className="mx-auto flex max-w-6xl items-center justify-between">
                <span className="text-lg font-semibold">
                  Smart Campaign Manager
                </span>
                <span className="text-sm text-slate-400">
                  Admin · Campaign Operations
                </span>
              </div>
            </header>
            <main className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-6">
              {children}
            </main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
