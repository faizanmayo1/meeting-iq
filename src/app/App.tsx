import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import MeetingsPage from "@/pages/meetings/MeetingsPage";
import ActionsPage from "@/pages/actions/ActionsPage";
import VelocityPage from "@/pages/velocity/VelocityPage";
import AlignmentPage from "@/pages/alignment/AlignmentPage";
import KnowledgePage from "@/pages/knowledge/KnowledgePage";
import RisksPage from "@/pages/risks/RisksPage";
import WorkflowsPage from "@/pages/workflows/WorkflowsPage";
import InsightsPage from "@/pages/insights/InsightsPage";
import CoachPage from "@/pages/coach/CoachPage";
import SettingsPage from "@/pages/settings/SettingsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/meetings" element={<MeetingsPage />} />
        <Route path="/actions" element={<ActionsPage />} />
        <Route path="/alignment" element={<AlignmentPage />} />
        <Route path="/velocity" element={<VelocityPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/risks" element={<RisksPage />} />
        <Route path="/workflows" element={<WorkflowsPage />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
        <Route path="/coach" element={<CoachPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
