import React from "react";
import { AdminShell } from "@/presentation/shell/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}