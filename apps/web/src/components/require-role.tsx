"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type UserRole } from "@/lib/auth";

type RequireRoleProps = {
  allowedRoles: UserRole[];
  children: React.ReactNode;
};

export function RequireRole({ allowedRoles, children }: RequireRoleProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session?.user) {
      router.replace("/login");
      return;
    }
    const role = session?.user?.role;
    if (status !== "loading" && session?.user && (!role || !allowedRoles.includes(role))) {
      router.replace("/unauthorized");
    }
  }, [session, status, allowedRoles, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-8 text-slate-400">
        Loading...
      </div>
    );
  }

  if (!session?.user) return null;

  const role = session.user.role;
  if (!role || !allowedRoles.includes(role)) return null;

  return <>{children}</>;
}
