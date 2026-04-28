import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CopilotFAB } from "@/components/ai/CopilotFAB";

export function AppShell() {
  const [_copilotOpen, setCopilotOpen] = useState(false);
  return (
    <div className="h-screen overflow-hidden flex bg-canvas">
      <Sidebar />
      <div className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden">
        <Topbar onCopilotOpen={() => setCopilotOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <CopilotFAB onClick={() => setCopilotOpen(true)} />
    </div>
  );
}
