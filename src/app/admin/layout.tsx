import { Suspense, type ReactNode } from "react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F8F5]" />}>
      <AdminAuthGuard>{children}</AdminAuthGuard>
    </Suspense>
  );
}

