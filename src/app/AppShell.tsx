"use client";

import React from "react";
import { usePathname } from "next/navigation";
import NavBar from "@/shared/ui/NavBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Admin usa o próprio AdminShell (topbar + sidebar). Então não duplicar NavBar nem padding.
  if (isAdmin) return <>{children}</>;

  return (
    <>
      <NavBar />
      <div style={{ paddingTop: "var(--nav-h)" }}>{children}</div>
    </>
  );
}