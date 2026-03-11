"use client";

import React, { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminTopbar } from "@/presentation/shell/AdminTopbar";
import { AdminSidebar, MobileSidebar } from "@/presentation/shell/AdminSidebar";
import { adminNav } from "@/shared/config/nav.admin";
import { userNav } from "@/shared/config/nav.user";

function titleFromPath(pathname: string) {
  const all = [...adminNav, ...userNav];
  const found = all.find((x) => x.href === pathname);
  if (found) return found.label;

  if (pathname.startsWith("/admin")) return "Admin";
  return "Dashboard";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = useMemo(() => titleFromPath(pathname), [pathname]);

  return (
    <div
      className={[
        "h-screen overflow-hidden text-slate-300",
        "bg-slate-950",
        "bg-[linear-gradient(to_right,rgba(30,41,59,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,41,59,0.5)_1px,transparent_1px)]",
        "bg-[size:40px_40px]",
      ].join(" ")}
    >
      <AdminTopbar pageTitle={pageTitle} onOpenMobileMenu={() => setMobileOpen(true)} />

      <div className="flex h-full pt-16">
        <AdminSidebar adminItems={adminNav} userItems={userNav} />
        <MobileSidebar
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          adminItems={adminNav}
          userItems={userNav}
        />

        <main className="h-full flex-1 overflow-y-auto p-4 pb-20 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}