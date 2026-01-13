"use client";

import React from "react";
import NavBar from "@/shared/ui/NavBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <div style={{ paddingTop: 64 }}>{children}</div>
    </>
  );
}
