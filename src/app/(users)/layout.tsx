import React from "react";
import { UserShell } from "@/presentation/shell/UserShell";

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return <UserShell>{children}</UserShell>;
}