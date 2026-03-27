"use client";

import React from "react";
import { usePathname } from "next/navigation";
// import NavBar from "@/shared/ui-legacy/NavBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Admin usa o próprio AdminShell (topbar + sidebar).
  if (isAdmin) return <>{children}</>;

  // User agora tem UserShell via (users)/layout.tsx.
  // Mantemos o NavBar legacy só para rotas fora do “dashboard” (se existirem).
  // No momento, desativado para evitar duplicação.
  // void NavBar;
  return <>{children}</>;
}