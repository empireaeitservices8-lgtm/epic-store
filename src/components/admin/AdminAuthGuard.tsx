"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

const subscribePathname = () => () => {};
const getClientPathname = () => window.location.pathname;
const getServerPathname = () => "";

export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = useSyncExternalStore(
    subscribePathname,
    getClientPathname,
    getServerPathname
  );
  const isLoginRoute = pathname === "/admin/login";
  const [status, setStatus] = useState<"checking" | "authenticated" | "unauthenticated">(
    "checking"
  );

  useEffect(() => {
    if (!pathname) return;
    let cancelled = false;

    void (async () => {
      try {
        const res = await fetch("/api/admin/auth", { cache: "no-store" });
        const data = (await res.json()) as { authenticated?: boolean };
        if (cancelled) return;

        if (data?.authenticated) {
          setStatus("authenticated");
          if (isLoginRoute) {
            router.replace("/admin");
          }
        } else {
          setStatus("unauthenticated");
          if (!isLoginRoute) {
            router.replace(
              `/admin/login?redirect=${encodeURIComponent(pathname)}`
            );
          }
        }
      } catch {
        if (cancelled) return;
        setStatus("unauthenticated");
        if (!isLoginRoute) {
          router.replace("/admin/login");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, isLoginRoute, router]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F8F5] px-4 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#17171B] text-[#78D94F] shadow-lg">
          <ShieldCheck className="h-7 w-7 animate-pulse" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
          Verifying Admin Session...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

